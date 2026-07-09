/**
 * Client-safe van type constants
 * These are hardcoded to avoid importing Prisma enums in client components
 * Keep in sync with VanType in app/db/enums.ts
 */

export const VAN_TYPE_LOWERCASE = ["simple", "rugged", "luxury"] as const;
