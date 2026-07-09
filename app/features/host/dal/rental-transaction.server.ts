import { eq } from "drizzle-orm";
import type { AppDb } from "~/db/client.server";
import { TransactionType } from "~/db/enums";
import { rent, transaction, van } from "~/db/schema/van";
import type { UUIDv7 } from "~/types/ids.server";

export async function createRent(
  db: AppDb,
  data: {
    vanId: UUIDv7;
    renterId: UUIDv7;
    hostId: UUIDv7;
  }
) {
  const [created] = await db
    .insert(rent)
    .values({
      hostId: data.hostId,
      renterId: data.renterId,
      vanId: data.vanId,
    })
    .returning();
  return created;
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
    throw new Error(`Rent ${rentId} not found`);
  }

  const now = new Date();

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
