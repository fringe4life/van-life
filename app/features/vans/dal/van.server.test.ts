import { Database } from "bun:sqlite";
import { beforeEach, describe, expect, it } from "bun:test";
import { drizzle } from "drizzle-orm/bun-sqlite";
import type { AppDb } from "~/db/client.server";
import { VanState, VanType } from "~/db/enums";
import { user } from "~/db/schema/auth";
import { van } from "~/db/schema/van";
import type { UUIDv7 } from "~/types/ids.server";
import { createVan, getVanBySlug, getVans } from "./van.server";

const HOST_ID = "01900000-0000-7000-8000-000000000001" as UUIDv7;

const IDS = {
  availableLuxury: "01900000-0000-7000-8000-000000000030" as UUIDv7,
  availableSimple: "01900000-0000-7000-8000-000000000010" as UUIDv7,
  onSaleRugged: "01900000-0000-7000-8000-000000000020" as UUIDv7,
  repairSimple: "01900000-0000-7000-8000-000000000040" as UUIDv7,
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
      "type" text NOT NULL,
      FOREIGN KEY ("hostId") REFERENCES "user"("id")
    );
  `);

  return drizzle({ client: sqlite }) as unknown as AppDb;
}

async function seedVans(db: AppDb) {
  await db.insert(user).values({
    createdAt: new Date("2024-01-01T00:00:00Z"),
    email: "host@test.com",
    emailVerified: true,
    id: HOST_ID,
    name: "Test Host",
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  });

  await db.insert(van).values([
    {
      description: "Solar panels and kitchenette for weekend escapes",
      hostId: HOST_ID,
      id: IDS.availableSimple,
      imageUrl: "https://example.com/simple.jpg",
      isRented: false,
      name: "Modest Explorer",
      price: 60,
      slug: "modest-explorer",
      state: VanState.AVAILABLE,
      type: VanType.SIMPLE,
    },
    {
      description: "Surf-ready portable home with cool features",
      hostId: HOST_ID,
      id: IDS.onSaleRugged,
      imageUrl: "https://example.com/rugged.jpg",
      isRented: false,
      name: "Beach Bum",
      price: 80,
      slug: "beach-bum",
      state: VanState.ON_SALE,
      type: VanType.RUGGED,
    },
    {
      description: "Comfort and luxury for long trips",
      hostId: HOST_ID,
      id: IDS.availableLuxury,
      imageUrl: "https://example.com/luxury.jpg",
      isRented: false,
      name: "The Cruiser",
      price: 120,
      slug: "the-cruiser",
      state: VanState.AVAILABLE,
      type: VanType.LUXURY,
    },
    {
      description: "Currently in the shop for engine work",
      hostId: HOST_ID,
      id: IDS.repairSimple,
      imageUrl: "https://example.com/repair.jpg",
      isRented: false,
      name: "Shop Bound",
      price: 50,
      slug: "shop-bound",
      state: VanState.IN_REPAIR,
      type: VanType.SIMPLE,
    },
  ]);
}

const baseQuery = {
  cursor: undefined,
  limit: 10,
  typeFilter: undefined,
} as const;

describe("getVans", () => {
  let db: AppDb;

  beforeEach(async () => {
    db = createTestDb();
    await seedVans(db);
  });

  it("returns vans newest-id-first with take = limit + 1", async () => {
    const rows = await getVans(db, {
      ...baseQuery,
      direction: "forward",
      limit: 2,
    });

    expect(rows).toHaveLength(3);
    expect(rows.map((row) => row.id)).toEqual([
      IDS.repairSimple,
      IDS.availableLuxury,
      IDS.onSaleRugged,
    ]);
  });

  it("filters by typeFilter when types is empty", async () => {
    const rows = await getVans(db, {
      ...baseQuery,
      typeFilter: VanType.SIMPLE,
    });

    expect(rows.map((row) => row.slug).sort()).toEqual([
      "modest-explorer",
      "shop-bound",
    ]);
  });

  it("filters by types list and ignores invalid type strings", async () => {
    const rows = await getVans(db, {
      ...baseQuery,
      typeFilter: VanType.SIMPLE,
      types: ["luxury", "not-a-type"],
    });

    expect(rows).toHaveLength(1);
    expect(rows[0]?.slug).toBe("the-cruiser");
  });

  it("returns no type filter when types are all invalid", async () => {
    const rows = await getVans(db, {
      ...baseQuery,
      types: ["nope", "also-nope"],
    });

    expect(rows).toHaveLength(4);
  });

  it("matches search words against name and description", async () => {
    const byName = await getVans(db, {
      ...baseQuery,
      search: "  cruiser  ",
    });
    expect(byName.map((row) => row.slug)).toEqual(["the-cruiser"]);

    const byDescription = await getVans(db, {
      ...baseQuery,
      search: "solar",
    });
    expect(byDescription.map((row) => row.slug)).toEqual(["modest-explorer"]);
  });

  it("requires every search word to match", async () => {
    const rows = await getVans(db, {
      ...baseQuery,
      search: "solar luxury",
    });

    expect(rows).toHaveLength(0);
  });

  it("excludes vans in repair when excludeInRepair is set", async () => {
    const rows = await getVans(db, {
      ...baseQuery,
      excludeInRepair: true,
    });

    expect(rows.map((row) => row.slug).sort()).toEqual([
      "beach-bum",
      "modest-explorer",
      "the-cruiser",
    ]);
  });

  it("returns only on-sale vans when onlyOnSale is set", async () => {
    const rows = await getVans(db, {
      ...baseQuery,
      onlyOnSale: true,
    });

    expect(rows).toHaveLength(1);
    expect(rows[0]?.slug).toBe("beach-bum");
  });

  it("applies forward cursor with descending id order", async () => {
    const rows = await getVans(db, {
      ...baseQuery,
      cursor: IDS.availableLuxury,
      direction: "forward",
    });

    expect(rows.map((row) => row.id)).toEqual([
      IDS.onSaleRugged,
      IDS.availableSimple,
    ]);
  });

  it("applies backward cursor with ascending id order", async () => {
    const rows = await getVans(db, {
      ...baseQuery,
      cursor: IDS.onSaleRugged,
      direction: "backward",
    });

    expect(rows.map((row) => row.id)).toEqual([
      IDS.availableLuxury,
      IDS.repairSimple,
    ]);
  });

  it("combines type, state, and search filters", async () => {
    const rows = await getVans(db, {
      ...baseQuery,
      excludeInRepair: true,
      search: "explorer",
      types: ["simple"],
    });

    expect(rows).toHaveLength(1);
    expect(rows[0]?.slug).toBe("modest-explorer");
  });

  it("applies cursor while filters are active", async () => {
    const rows = await getVans(db, {
      ...baseQuery,
      cursor: IDS.availableLuxury,
      direction: "forward",
      excludeInRepair: true,
      limit: 2,
    });

    expect(rows.map((row) => row.id)).toEqual([
      IDS.onSaleRugged,
      IDS.availableSimple,
    ]);
  });
});

describe("getVanBySlug", () => {
  let db: AppDb;

  beforeEach(async () => {
    db = createTestDb();
    await seedVans(db);
  });

  it("returns the van for a known slug", async () => {
    const result = await getVanBySlug(db, "beach-bum");

    expect(result?.name).toBe("Beach Bum");
    expect(result?.type).toBe(VanType.RUGGED);
  });

  it("returns null when slug is missing", async () => {
    expect(await getVanBySlug(db, "missing-van")).toBeNull();
  });
});

describe("createVan", () => {
  let db: AppDb;

  beforeEach(async () => {
    db = createTestDb();
    await db.insert(user).values({
      createdAt: new Date("2024-01-01T00:00:00Z"),
      email: "host@test.com",
      emailVerified: true,
      id: HOST_ID,
      name: "Test Host",
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    });
  });

  it("inserts a van with isRented false", async () => {
    const created = await createVan(db, {
      description: "Brand new listing",
      discount: 0,
      hostId: HOST_ID,
      imageUrl: "https://example.com/new.jpg",
      name: "Fresh Wheels",
      price: 90,
      slug: "fresh-wheels",
      state: VanState.AVAILABLE,
      type: VanType.RUGGED,
    });

    expect(created.isRented).toBe(false);
    expect(created.slug).toBe("fresh-wheels");
    expect(await getVanBySlug(db, "fresh-wheels")).not.toBeNull();
  });
});
