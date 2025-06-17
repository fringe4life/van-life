import { z } from "zod/v4";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(10, "Password has to be a minimum of 10 characters"),
});

export const signUpScheme = loginSchema
  .extend({
    confirmPassword: z.string().min(10),
    name: z.string().min(2).max(124),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords don't match.",
    path: ["confirmPassword"],
  });
