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

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  typeFilter: z.enum([...Object.values(VanType), ""]).default(""),
});
