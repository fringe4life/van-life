import type { schema } from "./schema";

export type VanModel = typeof schema.van.$inferSelect;
export type VanInsert = typeof schema.van.$inferInsert;
export type ReviewModel = typeof schema.review.$inferSelect;
export type TransactionModel = typeof schema.transaction.$inferSelect;
export type UserModel = typeof schema.user.$inferSelect;
