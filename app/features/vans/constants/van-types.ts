/**
 * Client-safe van type constants
 * These are hardcoded to avoid importing Prisma enums in client components
 * Keep in sync with the VanType enum in prisma/models/enums.prisma
 */

export const VAN_TYPE_LOWERCASE = ['simple', 'rugged', 'luxury'] as const;

export type LowercaseVanType = (typeof VAN_TYPE_LOWERCASE)[number];
