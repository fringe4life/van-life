import { Database } from "bun:sqlite";
import { beforeEach, describe, expect, it } from "bun:test";
import { drizzle } from "drizzle-orm/bun-sqlite";
import type { AppDb } from "~/db/client.server";
import { VanState, VanType } from "~/db/enums";
import { user } from "~/db/schema/auth";
import { van } from "~/db/schema/van";
import { getVanForRentBySlug } from "~/features/host/dal/rental.server";
import { rentVan } from "~/features/host/services/rental.server";
import type { UUIDv7 } from "~/types/ids.server";

const HOST_ID = "01900000-0000-7000-8000-000000000001" as UUIDv7;
const RENTER_ID = "01900000-0000-7000-8000-000000000002" as UUIDv7;

const IDS = {
  alreadyRented: "01900000-0000-7000-8000-000000000013" as UUIDv7,
  beachBum: "01900000-0000-7000-8000-000000000010" as UUIDv7,
  inRepair: "01900000-0000-7000-8000-000000000012" as UUIDv7,
  onSale: "01900000-0000-7000-8000-000000000014" as UUIDv7,
  renterOwned: "01900000-0000-7000-8000-000000000011" as UUIDv7,
} as const;

function createTestDb() {
  const sqlite = new Database(":memory:");
  sqlite.exec(`
    CREATE TABLE "user" (
      "id" text PRIMARY KEY NOT NULL,
      "name" text NOT NULL,
      "email" text NOT NULL UNIQUE,
      "email_verified" integer DEFAULT false NOT NULL,
      "image" text,
      "created_at" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
      "updated_at" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
    );
    CREATE TABLE "van" (
      "createdAt" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
      "description" text NOT NULL,
      "discount" integer DEFAULT 0,
      "hostId" text NOT NULL,
      "id" text PRIMARY KEY,
      "imageUrl" text NOT NULL,
      "isRented" integer DEFAULT false NOT NULL,
      "name" text NOT NULL UNIQUE,
      "price" integer NOT NULL,
      "slug" text NOT NULL,
      "state" text DEFAULT 'AVAILABLE',
      "type" text NOT NULL
    );
    CREATE TABLE "rent" (
      "hostId" text NOT NULL,
      "id" text PRIMARY KEY,
      "rentedAt" integer NOT NULL,
      "rentedTo" integer,
      "renterId" text NOT NULL,
      "vanId" text NOT NULL
    );
  `);

  return drizzle({ client: sqlite }) as unknown as AppDb;
}

async function seedRentVans(db: AppDb) {
  const createdAt = new Date("2024-01-01T00:00:00Z");

  await db.insert(user).values([
    {
      createdAt,
      email: "host@test.com",
      emailVerified: true,
      id: HOST_ID,
      name: "Host",
      updatedAt: createdAt,
    },
    {
      createdAt,
      email: "renter@test.com",
      emailVerified: true,
      id: RENTER_ID,
      name: "Renter",
      updatedAt: createdAt,
    },
  ]);

  await db.insert(van).values([
    {
      description: "Surf-ready portable home with cool features",
      hostId: HOST_ID,
      id: IDS.beachBum,
      imageUrl: "https://example.com/beach-bum.jpg",
      isRented: false,
      name: "Beach Bum",
      price: 80,
      slug: "beach-bum",
      state: VanState.AVAILABLE,
      type: VanType.RUGGED,
    },
    {
      description: "Owned by the renter",
      hostId: RENTER_ID,
      id: IDS.renterOwned,
      imageUrl: "https://example.com/renter-owned.jpg",
      isRented: false,
      name: "Renter Wheels",
      price: 70,
      slug: "renter-wheels",
      state: VanState.AVAILABLE,
      type: VanType.SIMPLE,
    },
    {
      description: "Currently in the shop for engine work",
      hostId: HOST_ID,
      id: IDS.inRepair,
      imageUrl: "https://example.com/repair.jpg",
      isRented: false,
      name: "Shop Bound",
      price: 50,
      slug: "shop-bound",
      state: VanState.IN_REPAIR,
      type: VanType.SIMPLE,
    },
    {
      description: "Already out with another renter",
      hostId: HOST_ID,
      id: IDS.alreadyRented,
      imageUrl: "https://example.com/rented.jpg",
      isRented: true,
      name: "Taken Van",
      price: 90,
      slug: "taken-van",
      state: VanState.AVAILABLE,
      type: VanType.LUXURY,
    },
    {
      description: "Discounted but still rentable",
      hostId: HOST_ID,
      id: IDS.onSale,
      imageUrl: "https://example.com/sale.jpg",
      isRented: false,
      name: "Sale Wheels",
      price: 60,
      slug: "sale-wheels",
      state: VanState.ON_SALE,
      type: VanType.SIMPLE,
    },
  ]);
}

describe("rentVan", () => {
  let db: AppDb;

  beforeEach(async () => {
    db = createTestDb();
    await seedRentVans(db);
  });

  it("returns not_found for an unknown slug", async () => {
    const result = await rentVan(db, "missing-van", RENTER_ID);

    expect(result).toEqual({
      kind: "not_found",
      message: "Van not found",
      ok: false,
    });
  });

  it("returns forbidden when the renter owns the van", async () => {
    const result = await rentVan(db, "renter-wheels", RENTER_ID);

    expect(result).toEqual({
      kind: "forbidden",
      message: "You cannot rent your own van",
      ok: false,
    });
  });

  it("returns unavailable when the van is in repair", async () => {
    const result = await rentVan(db, "shop-bound", RENTER_ID);

    expect(result).toEqual({
      kind: "unavailable",
      message: "This van is not available to rent",
      ok: false,
    });
  });

  it("returns unavailable when the van is already rented", async () => {
    const result = await rentVan(db, "taken-van", RENTER_ID);

    expect(result).toEqual({
      kind: "unavailable",
      message: "This van is not available to rent",
      ok: false,
    });
  });

  it("creates a rent row and marks the van rented", async () => {
    const result = await rentVan(db, "beach-bum", RENTER_ID);

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error("expected rentVan to succeed");
    }

    expect(result.data.hostId).toBe(HOST_ID);
    expect(result.data.renterId).toBe(RENTER_ID);
    expect(result.data.vanId).toBe(IDS.beachBum);

    const claimed = await getVanForRentBySlug(db, "beach-bum");
    expect(claimed?.isRented).toBe(true);
  });

  it("rents an on-sale van that is not already rented", async () => {
    const result = await rentVan(db, "sale-wheels", RENTER_ID);

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error("expected rentVan to succeed for on-sale van");
    }

    expect(result.data.hostId).toBe(HOST_ID);
    expect(result.data.renterId).toBe(RENTER_ID);
    expect(result.data.vanId).toBe(IDS.onSale);

    const claimed = await getVanForRentBySlug(db, "sale-wheels");
    expect(claimed?.isRented).toBe(true);
  });
});
