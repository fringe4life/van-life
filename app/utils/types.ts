import { VanType } from "@prisma/client";
import { z } from "zod/v4";
import {
  DEFAULT_FILTER,
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
} from "~/constants/constants";

const passwordSchema = z
  .string()
  .min(10, "Password has to be a minimum of 10 characters")
  .catch(() => "");

export const loginSchema = z.object({
  email: z.email(),
  password: passwordSchema,
});

export type loginSchemaType = z.infer<typeof loginSchema>;

export const signUpScheme = loginSchema
  .extend({
    confirmPassword: passwordSchema,
    name: z.string().min(2).max(124),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords don't match.",
    path: ["confirmPassword"],
  });

const vanTypeSchema = z.enum(Object.values(VanType));

export const addVanSchema = z.object({
  name: z
    .string()
    .max(60, { error: "Name cannot be longer then 60 characters" }),
  description: z.string().max(1024, {
    error: "Description is too long. Max length is 1024 characters",
  }),
  type: z.string().toUpperCase().pipe(vanTypeSchema),
  imageUrl: z.url(),
  price: z.coerce.number().positive().max(32767, {
    error: "Your van cannot be more expensive then $32,767 dollars",
  }),
});

export const uuidSchema = z.object({
  possibleUUID: z.uuid(),
});

function zodEnumFromRecordKeys<K extends string>(record: Record<K, any>) {
  const keys = Object.keys(record) as K[];
  return z.enum(keys as [K, ...K[], typeof DEFAULT_FILTER]);
}

const vanType = zodEnumFromRecordKeys(VanType);

const paginationSchema = z.coerce.number().optional();

export const searchParamsSchema = z.object({
  page: paginationSchema.default(DEFAULT_PAGE),
  limit: paginationSchema.default(DEFAULT_LIMIT),
  type: z
    .string()
    .toUpperCase()
    .optional()
    .default(DEFAULT_FILTER)
    .pipe(vanType),
});
