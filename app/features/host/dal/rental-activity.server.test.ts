import { Database } from "bun:sqlite";
import { beforeEach, describe, expect, it } from "bun:test";
import { drizzle } from "drizzle-orm/bun-sqlite";
import type { AppDb } from "~/db/client.server";
import { TransactionType, VanType } from "~/db/enums";
import { user } from "~/db/schema/auth";
import { rent, transaction, van } from "~/db/schema/van";
import type { UUIDv7 } from "~/types/ids.server";
import { getHostTransactionsPaginated } from "./rental-activity.server";

const HOST_ID = "01900000-0000-7000-8000-000000000001" as UUIDv7;
const RENTER_ID = "01900000-0000-7000-8000-000000000002" as UUIDv7;
const VAN_ID = "01900000-0000-7000-8000-000000000010" as UUIDv7;
const RENT_ID = "01900000-0000-7000-8000-000000000020" as UUIDv7;

const TXN = {
  id1: "01900000-0000-7000-8000-000000000031" as UUIDv7,
  id2: "01900000-0000-7000-8000-000000000032" as UUIDv7,
  id3: "01900000-0000-7000-8000-000000000033" as UUIDv7,
  id4: "01900000-0000-7000-8000-000000000034" as UUIDv7,
  id5: "01900000-0000-7000-8000-000000000035" as UUIDv7,
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
    CREATE TABLE "transaction" (
      "amount" real NOT NULL,
      "createdAt" integer NOT NULL,
      "description" text,
      "id" text PRIMARY KEY,
      "rentId" text,
      "type" text NOT NULL,
      "userId" text NOT NULL
    );
  `);

  return drizzle({ client: sqlite }) as unknown as AppDb;
}

async function seedRentalActivity(db: AppDb) {
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

  await db.insert(van).values({
    description: "Test van",
    hostId: HOST_ID,
    id: VAN_ID,
    imageUrl: "https://example.com/van.jpg",
    isRented: false,
    name: "Test Van",
    price: 80,
    slug: "test-van",
    type: VanType.SIMPLE,
  });

  await db.insert(rent).values({
    hostId: HOST_ID,
    id: RENT_ID,
    rentedAt: new Date("2024-02-01T00:00:00Z"),
    rentedTo: new Date("2024-02-05T00:00:00Z"),
    renterId: RENTER_ID,
    vanId: VAN_ID,
  });

  await db.insert(transaction).values([
    {
      amount: 100,
      createdAt: new Date("2024-03-01T00:00:00Z"),
      id: TXN.id1,
      rentId: RENT_ID,
      type: TransactionType.RENTAL_PAYMENT,
      userId: HOST_ID,
    },
    {
      amount: 50,
      createdAt: new Date("2024-03-02T00:00:00Z"),
      id: TXN.id2,
      rentId: RENT_ID,
      type: TransactionType.RENTAL_PAYMENT,
      userId: HOST_ID,
    },
    {
      amount: 200,
      createdAt: new Date("2024-03-03T00:00:00Z"),
      id: TXN.id3,
      rentId: RENT_ID,
      type: TransactionType.RENTAL_PAYMENT,
      userId: HOST_ID,
    },
    {
      amount: 50,
      createdAt: new Date("2024-03-04T00:00:00Z"),
      id: TXN.id4,
      rentId: RENT_ID,
      type: TransactionType.RENTAL_PAYMENT,
      userId: HOST_ID,
    },
    {
      amount: 150,
      createdAt: new Date("2024-03-05T00:00:00Z"),
      id: TXN.id5,
      rentId: RENT_ID,
      type: TransactionType.RENTAL_PAYMENT,
      userId: HOST_ID,
    },
  ]);
}

describe("getHostTransactionsPaginated", () => {
  let db: AppDb;

  beforeEach(async () => {
    db = createTestDb();
    await seedRentalActivity(db);
  });

  it("pages by amount then id when sorting highest, not by id alone", async () => {
    const firstPage = await getHostTransactionsPaginated(db, {
      cursor: undefined,
      limit: 2,
      sort: "highest",
      userId: HOST_ID,
    });

    expect(firstPage.map((row) => row.id)).toEqual([TXN.id3, TXN.id5, TXN.id1]);

    const secondPage = await getHostTransactionsPaginated(db, {
      cursor: TXN.id5,
      limit: 2,
      sort: "highest",
      userId: HOST_ID,
    });

    expect(secondPage.map((row) => row.id)).toEqual([
      TXN.id1,
      TXN.id4,
      TXN.id2,
    ]);
  });

  it("pages by createdAt then id when sorting newest", async () => {
    const firstPage = await getHostTransactionsPaginated(db, {
      cursor: undefined,
      limit: 2,
      sort: "newest",
      userId: HOST_ID,
    });

    expect(firstPage.map((row) => row.id)).toEqual([TXN.id5, TXN.id4, TXN.id3]);

    const secondPage = await getHostTransactionsPaginated(db, {
      cursor: TXN.id4,
      limit: 2,
      sort: "newest",
      userId: HOST_ID,
    });

    expect(secondPage.map((row) => row.id)).toEqual([
      TXN.id3,
      TXN.id2,
      TXN.id1,
    ]);
  });
});
