import { defineRelations } from "drizzle-orm";
import { schema } from "./schema";

export const relations = defineRelations(schema, (r) => ({
  account: {
    user: r.one.user({
      from: r.account.userId,
      to: r.user.id,
    }),
  },
  rent: {
    host: r.one.user({
      alias: "host",
      from: r.rent.hostId,
      to: r.user.id,
    }),
    renter: r.one.user({
      alias: "renter",
      from: r.rent.renterId,
      to: r.user.id,
    }),
    reviews: r.many.review({
      from: r.rent.id,
      to: r.review.rentId,
    }),
    transactions: r.many.transaction({
      from: r.rent.id,
      to: r.transaction.rentId,
    }),
    van: r.one.van({
      from: r.rent.vanId,
      to: r.van.id,
    }),
  },
  review: {
    rent: r.one.rent({
      from: r.review.rentId,
      to: r.rent.id,
    }),
    user: r.one.user({
      from: r.review.userId,
      to: r.user.id,
    }),
  },
  session: {
    user: r.one.user({
      from: r.session.userId,
      to: r.user.id,
    }),
  },
  transaction: {
    rent: r.one.rent({
      from: r.transaction.rentId,
      to: r.rent.id,
    }),
    user: r.one.user({
      from: r.transaction.userId,
      to: r.user.id,
    }),
  },
  user: {
    accounts: r.many.account({
      from: r.user.id,
      to: r.account.userId,
    }),
    hostRents: r.many.rent({
      alias: "host",
      from: r.user.id,
      to: r.rent.hostId,
    }),
    renterRents: r.many.rent({
      alias: "renter",
      from: r.user.id,
      to: r.rent.renterId,
    }),
    reviews: r.many.review({
      from: r.user.id,
      to: r.review.userId,
    }),
    sessions: r.many.session({
      from: r.user.id,
      to: r.session.userId,
    }),
    transactions: r.many.transaction({
      from: r.user.id,
      to: r.transaction.userId,
    }),
    vans: r.many.van({
      from: r.user.id,
      to: r.van.hostId,
    }),
  },
  van: {
    host: r.one.user({
      from: r.van.hostId,
      to: r.user.id,
    }),
    rents: r.many.rent({
      from: r.van.id,
      to: r.rent.vanId,
    }),
  },
}));
