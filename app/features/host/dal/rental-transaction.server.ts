import { and, eq, isNull, ne, notExists } from "drizzle-orm";
import type { AppDb } from "~/db/client.server";
import { TransactionType, VanState } from "~/db/enums";
import { rent, transaction, van } from "~/db/schema/van";
import type { UUIDv7 } from "~/types/ids.server";
import { DomainError } from "~/utils/domain-error.server";

/**
 * Atomically claim a van (`isRented`) then insert the rent row.
 *
 * D1 has no interactive transactions; `batch` cannot branch on the first
 * statement's RETURNING. Claim-with-WHERE then insert mirrors that constraint:
 * only one concurrent renter wins the update. If insert fails after claim,
 * roll `isRented` back so the van is not stuck — but only when no active
 * rent exists, so a concurrent successful claim/insert is not undone.
 */
export async function executeRentVanTransaction(
  db: AppDb,
  data: {
    vanId: UUIDv7;
    renterId: UUIDv7;
    hostId: UUIDv7;
  }
) {
  const [claimed] = await db
    .update(van)
    .set({ isRented: true })
    .where(
      and(
        eq(van.id, data.vanId),
        eq(van.isRented, false),
        ne(van.state, VanState.IN_REPAIR)
      )
    )
    .returning({ id: van.id });

  if (!claimed) {
    throw new DomainError(
      "CONFLICT",
      "This van is not available to rent",
      "van"
    );
  }

  try {
    const [created] = await db
      .insert(rent)
      .values({
        hostId: data.hostId,
        renterId: data.renterId,
        vanId: data.vanId,
      })
      .returning();
    return created;
  } catch (error) {
    // Guarded rollback: insert may have committed while the client saw a
    // failure, or another renter may have claimed after a true failure.
    // Clearing isRented only when no open rent exists avoids double-rent.
    await db
      .update(van)
      .set({ isRented: false })
      .where(
        and(
          eq(van.id, data.vanId),
          notExists(
            db
              .select({ id: rent.id })
              .from(rent)
              .where(and(eq(rent.vanId, data.vanId), isNull(rent.rentedTo)))
          )
        )
      );

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to insert rent after claiming van", {
      cause: error,
    });
  }
}

export async function executeReturnVanTransaction(
  db: AppDb,
  rentId: UUIDv7,
  userId: UUIDv7,
  amount: number,
  vanId: UUIDv7
) {
  const [currentRent] = await db
    .select()
    .from(rent)
    .where(eq(rent.id, rentId))
    .limit(1);

  if (!currentRent) {
    throw new DomainError("NOT_FOUND", `Rent ${rentId} not found`, "rent");
  }

  const now = new Date();

  // Unconditional multi-write — batch is atomic on D1.
  await db.batch([
    db.update(rent).set({ rentedTo: now }).where(eq(rent.id, rentId)),
    db.insert(transaction).values({
      amount: -amount,
      description: `Payment for van rental ${vanId}`,
      rentId,
      type: TransactionType.RENTAL_RETURN,
      userId,
    }),
    db.insert(transaction).values({
      amount,
      description: `Received payment for van ${vanId}`,
      rentId,
      type: TransactionType.RENTAL_PAYMENT,
      userId: currentRent.hostId,
    }),
    db.update(van).set({ isRented: false }).where(eq(van.id, vanId)),
  ]);

  return { ...currentRent, rentedTo: now };
}
