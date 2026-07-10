import "~/lib/arktype.config";
import { type } from "arktype";

/**
 * Schema for validating user passwords.
 * - Must be a string with at least 10 characters.
 */
const passwordSchema = type("string >= 10").describe(
  "Password has to be a minimum of 10 characters"
);

/**
 * Schema for user login form.
 * - Requires a valid email and password.
 */
export const loginSchema = type({
  email: "string.email",
  password: passwordSchema,
});

/**
 * Schema for user sign-up form.
 * - Extends loginSchema with confirmPassword and name fields.
 * - Ensures password and confirmPassword match.
 */
export const signUpScheme = type({
  confirmPassword: passwordSchema,
  email: "string.email",
  name: "2 <= string <= 124",
  password: passwordSchema,
}).narrow((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    return ctx.reject({
      actual: "",
      expected: "identical to password",
      path: ["confirmPassword"],
    });
  }
  return true;
});
