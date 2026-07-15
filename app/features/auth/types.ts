export const LOGIN_FORM_FIELDS = ["email", "password"] as const;

/** Safe subset replayed to the client (never password). */
export const LOGIN_ECHO_FIELDS = ["email"] as const;

export const SIGN_UP_FORM_FIELDS = [
  "confirmPassword",
  "email",
  "name",
  "password",
] as const;

/** Safe subset replayed to the client (never passwords). */
export const SIGN_UP_ECHO_FIELDS = ["email", "name"] as const;
