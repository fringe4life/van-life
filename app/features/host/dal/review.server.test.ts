import { Database } from "bun:sqlite";
import { beforeEach, describe, expect, it } from "bun:test";
import { drizzle } from "drizzle-orm/bun-sqlite";
import type { AppDb } from "~/db/client.server";
import { VanType } from "~/db/enums";
import { user } from "~/db/schema/auth";
import { rent, review, van } from "~/db/schema/van";
import type { UUIDv7 } from "~/types/ids.server";
import { getHostReviewsPaginated } from "./review.server";

const HOST_A_ID = "01900000-0000-7000-8000-000000000001" as UUIDv7;
const HOST_B_ID = "01900000-0000-7000-8000-000000000002" as UUIDv7;
const REVIEWER_ALICE_ID = "01900000-0000-7000-8000-000000000003" as UUIDv7;
const REVIEWER_BOB_ID = "01900000-0000-7000-8000-000000000004" as UUIDv7;
const VAN_A_ID = "01900000-0000-7000-8000-000000000010" as UUIDv7;
const VAN_B_ID = "01900000-0000-7000-8000-000000000011" as UUIDv7;
const RENT_A_ID = "01900000-0000-7000-8000-000000000020" as UUIDv7;
const RENT_B_ID = "01900000-0000-7000-8000-000000000021" as UUIDv7;
const UNKNOWN_CURSOR_ID = "01900000-0000-7000-8000-000000000099" as UUIDv7;

const REVIEW = {
  hostB: "01900000-0000-7000-8000-000000000090" as UUIDv7,
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
    CREATE TABLE "review" (
      "createdAt" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
      "id" text PRIMARY KEY,
      "rating" integer NOT NULL,
      "rentId" text NOT NULL,
      "text" text NOT NULL,
      "updatedAt" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
      "userId" text NOT NULL
    );
  `);

  return drizzle({ client: sqlite }) as unknown as AppDb;
}

async function seedHostReviews(db: AppDb) {
  const createdAt = new Date("2024-01-01T00:00:00Z");

  await db.insert(user).values([
    {
      createdAt,
      email: "host-a@test.com",
      emailVerified: true,
      id: HOST_A_ID,
      name: "Host A",
      updatedAt: createdAt,
    },
    {
      createdAt,
      email: "host-b@test.com",
      emailVerified: true,
      id: HOST_B_ID,
      name: "Host B",
      updatedAt: createdAt,
    },
    {
      createdAt,
      email: "alice@test.com",
      emailVerified: true,
      id: REVIEWER_ALICE_ID,
      name: "Alice",
      updatedAt: createdAt,
    },
    {
      createdAt,
      email: "bob@test.com",
      emailVerified: true,
      id: REVIEWER_BOB_ID,
      name: "Bob",
      updatedAt: createdAt,
    },
  ]);

  await db.insert(van).values([
    {
      description: "Host A van",
      hostId: HOST_A_ID,
      id: VAN_A_ID,
      imageUrl: "https://example.com/van-a.jpg",
      isRented: false,
      name: "Host A Van",
      price: 80,
      slug: "host-a-van",
      type: VanType.SIMPLE,
    },
    {
      description: "Host B van",
      hostId: HOST_B_ID,
      id: VAN_B_ID,
      imageUrl: "https://example.com/van-b.jpg",
      isRented: false,
      name: "Host B Van",
      price: 90,
      slug: "host-b-van",
      type: VanType.LUXURY,
    },
  ]);

  await db.insert(rent).values([
    {
      hostId: HOST_A_ID,
      id: RENT_A_ID,
      rentedAt: new Date("2024-02-01T00:00:00Z"),
      rentedTo: new Date("2024-02-05T00:00:00Z"),
      renterId: REVIEWER_ALICE_ID,
      vanId: VAN_A_ID,
    },
    {
      hostId: HOST_B_ID,
      id: RENT_B_ID,
      rentedAt: new Date("2024-02-01T00:00:00Z"),
      rentedTo: new Date("2024-02-05T00:00:00Z"),
      renterId: REVIEWER_BOB_ID,
      vanId: VAN_B_ID,
    },
  ]);

  await db.insert(review).values([
    {
      createdAt: new Date("2024-03-01T00:00:00Z"),
      id: REVIEW.id1,
      rating: 3,
      rentId: RENT_A_ID,
      text: "Fine trip",
      updatedAt: new Date("2024-03-01T00:00:00Z"),
      userId: REVIEWER_ALICE_ID,
    },
    {
      createdAt: new Date("2024-03-02T00:00:00Z"),
      id: REVIEW.id2,
      rating: 1,
      rentId: RENT_A_ID,
      text: "Rough ride",
      updatedAt: new Date("2024-03-02T00:00:00Z"),
      userId: REVIEWER_BOB_ID,
    },
    {
      createdAt: new Date("2024-03-03T00:00:00Z"),
      id: REVIEW.id3,
      rating: 5,
      rentId: RENT_A_ID,
      text: "Loved it",
      updatedAt: new Date("2024-03-03T00:00:00Z"),
      userId: REVIEWER_ALICE_ID,
    },
    {
      createdAt: new Date("2024-03-04T00:00:00Z"),
      id: REVIEW.id4,
      rating: 2,
      rentId: RENT_A_ID,
      text: "Meh",
      updatedAt: new Date("2024-03-04T00:00:00Z"),
      userId: REVIEWER_BOB_ID,
    },
    {
      createdAt: new Date("2024-03-05T00:00:00Z"),
      id: REVIEW.id5,
      rating: 4,
      rentId: RENT_A_ID,
      text: "Pretty good",
      updatedAt: new Date("2024-03-05T00:00:00Z"),
      userId: REVIEWER_ALICE_ID,
    },
    {
      createdAt: new Date("2024-03-06T00:00:00Z"),
      id: REVIEW.hostB,
      rating: 5,
      rentId: RENT_B_ID,
      text: "Host B review must not leak",
      updatedAt: new Date("2024-03-06T00:00:00Z"),
      userId: REVIEWER_BOB_ID,
    },
  ]);
}

describe("getHostReviewsPaginated", () => {
  let db: AppDb;

  beforeEach(async () => {
    db = createTestDb();
    await seedHostReviews(db);
  });

  it("only returns reviews for that host and includes reviewer user.name", async () => {
    const rows = await getHostReviewsPaginated(db, {
      cursor: undefined,
      limit: 10,
      userId: HOST_A_ID,
    });

    expect(rows.map((row) => row.id)).toEqual([
      REVIEW.id5,
      REVIEW.id4,
      REVIEW.id3,
      REVIEW.id2,
      REVIEW.id1,
    ]);
    expect(rows.map((row) => row.user.name)).toEqual([
      "Alice",
      "Bob",
      "Alice",
      "Bob",
      "Alice",
    ]);
  });

  it("pages by createdAt then id when sorting newest", async () => {
    const firstPage = await getHostReviewsPaginated(db, {
      cursor: undefined,
      limit: 2,
      sort: "newest",
      userId: HOST_A_ID,
    });

    expect(firstPage.map((row) => row.id)).toEqual([
      REVIEW.id5,
      REVIEW.id4,
      REVIEW.id3,
    ]);

    const secondPage = await getHostReviewsPaginated(db, {
      cursor: REVIEW.id4,
      limit: 2,
      sort: "newest",
      userId: HOST_A_ID,
    });

    expect(secondPage.map((row) => row.id)).toEqual([
      REVIEW.id3,
      REVIEW.id2,
      REVIEW.id1,
    ]);
  });

  it("pages by rating then id when sorting highest", async () => {
    const firstPage = await getHostReviewsPaginated(db, {
      cursor: undefined,
      limit: 2,
      sort: "highest",
      userId: HOST_A_ID,
    });

    expect(firstPage.map((row) => row.id)).toEqual([
      REVIEW.id3,
      REVIEW.id5,
      REVIEW.id1,
    ]);

    const secondPage = await getHostReviewsPaginated(db, {
      cursor: REVIEW.id5,
      limit: 2,
      sort: "highest",
      userId: HOST_A_ID,
    });

    expect(secondPage.map((row) => row.id)).toEqual([
      REVIEW.id1,
      REVIEW.id4,
      REVIEW.id2,
    ]);
  });

  it("unknown cursor id does not throw and still returns first page", async () => {
    const rows = await getHostReviewsPaginated(db, {
      cursor: UNKNOWN_CURSOR_ID,
      limit: 2,
      sort: "newest",
      userId: HOST_A_ID,
    });

    expect(rows.map((row) => row.id)).toEqual([
      REVIEW.id5,
      REVIEW.id4,
      REVIEW.id3,
    ]);
  });

  it("first page length is limit + 1 when enough reviews exist", async () => {
    const rows = await getHostReviewsPaginated(db, {
      cursor: undefined,
      limit: 2,
      userId: HOST_A_ID,
    });

    expect(rows).toHaveLength(3);
  });
});
