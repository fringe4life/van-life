import {
  email,
  forward,
  maxLength,
  minLength,
  object,
  partialCheck,
  pipe,
  string,
} from "valibot";

/**
 * Schema for validating user passwords.
 * - Must be a string with at least 10 characters.
 */
const passwordSchema = pipe(
  string(),
  minLength(10, "Password has to be a minimum of 10 characters")
);

/**
 * Schema for user login form.
 * - Requires a valid email and password.
 */
export const loginSchema = object({
  email: pipe(string(), email()),
  password: passwordSchema,
});

/**
 * Schema for user sign-up form.
 * - Extends loginSchema with confirmPassword and name fields.
 * - Ensures password and confirmPassword match.
 */
export const signUpScheme = pipe(
  object({
    confirmPassword: passwordSchema,
    email: pipe(string(), email()),
    name: pipe(string(), minLength(2), maxLength(124)),
    password: passwordSchema,
  }),
  forward(
    partialCheck(
      [["password"], ["confirmPassword"]],
      (input) => input.password === input.confirmPassword,
      "identical to password"
    ),
    ["confirmPassword"]
  )
);
