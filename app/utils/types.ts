import { VanType } from "@prisma/client";
import { z } from "zod/v4";

export const loginSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(10, "Password has to be a minimum of 10 characters")
    .catch(() => ""),
});

export type loginSchemaType = z.infer<typeof loginSchema>;

export const signUpScheme = loginSchema
  .extend({
    confirmPassword: z
      .string()
      .min(10)
      .catch(() => ""),
    name: z.string().min(2).max(124),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords don't match.",
    path: ["confirmPassword"],
  });

const vanTypeSchema = z.enum(Object.values(VanType));

export const addVanSchema = z.object({
  name: z.string().max(60),
  description: z.string().max(1024),
  type: z
    .string()
    .transform((value) => value.trim().toUpperCase())
    .pipe(vanTypeSchema),
  imageUrl: z.url(),
  price: z.coerce.number().positive().max(32767),
});

export const uuidSchema = z.object({
  possibleUUID: z.uuid(),
});

function zodEnumFromRecordKeys<K extends string>(record: Record<K, any>) {
  const keys = Object.keys(record) as K[];
  return z.enum(keys as [K, ...K[], ""]);
}

const vanType = zodEnumFromRecordKeys(VanType);

export const searchParamsSchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  type: z.string().toUpperCase().optional().default("").pipe(vanType),
});
