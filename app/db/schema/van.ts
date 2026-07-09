import { sql } from "drizzle-orm";
import {
  index,
  integer,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { uuidv7Column, uuidv7PrimaryKey } from "~/db/columns";
import { user } from "./auth";

export const van = sqliteTable(
  "van",
  {
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    description: text("description").notNull(),
    discount: integer("discount").default(0),
    hostId: uuidv7Column("hostId")
      .notNull()
      .references(() => user.id),
    id: uuidv7PrimaryKey(),
    imageUrl: text("imageUrl").notNull(),
    isRented: integer("isRented", { mode: "boolean" }).default(false).notNull(),
    name: text("name").notNull().unique(),
    price: integer("price").notNull(),
    slug: text("slug").notNull().unique(),
    state: text("state", {
      enum: ["IN_REPAIR", "ON_SALE", "AVAILABLE"],
    }).default("AVAILABLE"),
    type: text("type", { enum: ["SIMPLE", "LUXURY", "RUGGED"] }).notNull(),
  },
  (table) => [
    index("Van_slug_idx").on(table.slug),
    index("Van_hostId_idx").on(table.hostId),
    index("Van_type_idx").on(table.type),
    index("Van_hostId_id_idx").on(table.hostId, table.id),
    index("Van_type_id_idx").on(table.type, table.id),
  ]
);

export const rent = sqliteTable(
  "rent",
  {
    hostId: uuidv7Column("hostId")
      .notNull()
      .references(() => user.id),
    id: uuidv7PrimaryKey(),
    rentedAt: integer("rentedAt", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    rentedTo: integer("rentedTo", { mode: "timestamp_ms" }),
    renterId: uuidv7Column("renterId")
      .notNull()
      .references(() => user.id),
    vanId: uuidv7Column("vanId")
      .notNull()
      .references(() => van.id),
  },
  (table) => [
    index("Rent_rentedTo_idx").on(table.rentedTo),
    index("Rent_vanId_idx").on(table.vanId),
    index("Rent_renterId_idx").on(table.renterId),
    index("Rent_hostId_idx").on(table.hostId),
    index("Rent_renterId_rentedTo_idx").on(table.renterId, table.rentedTo),
    index("Rent_hostId_rentedTo_idx").on(table.hostId, table.rentedTo),
  ]
);

export const review = sqliteTable(
  "review",
  {
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    id: uuidv7PrimaryKey(),
    rating: integer("rating").notNull(),
    rentId: uuidv7Column("rentId")
      .notNull()
      .references(() => rent.id),
    text: text("text").notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    userId: uuidv7Column("userId")
      .notNull()
      .references(() => user.id),
  },
  (table) => [
    index("Review_rating_idx").on(table.rating),
    index("Review_createdAt_idx").on(table.createdAt),
  ]
);

export const transaction = sqliteTable(
  "transaction",
  {
    amount: real("amount").notNull(),
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    description: text("description"),
    id: uuidv7PrimaryKey(),
    rentId: uuidv7Column("rentId").references(() => rent.id),
    type: text("type", {
      enum: ["DEPOSIT", "WITHDRAW", "RENTAL_PAYMENT", "RENTAL_RETURN"],
    }).notNull(),
    userId: uuidv7Column("userId")
      .notNull()
      .references(() => user.id),
  },
  (table) => [
    index("Transaction_userId_idx").on(table.userId),
    index("Transaction_rentId_idx").on(table.rentId),
    index("Transaction_createdAt_idx").on(table.createdAt),
    index("Transaction_userId_type_idx").on(table.userId, table.type),
    index("Transaction_userId_createdAt_idx").on(table.userId, table.createdAt),
    index("Transaction_userId_amount_idx").on(table.userId, table.amount),
    index("Transaction_userId_type_createdAt_idx").on(
      table.userId,
      table.type,
      table.createdAt
    ),
    index("Transaction_userId_type_amount_idx").on(
      table.userId,
      table.type,
      table.amount
    ),
  ]
);
