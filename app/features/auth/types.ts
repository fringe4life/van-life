export const LOGIN_FORM_FIELDS = ["email", "password"] as const;

type LoginFormFieldKey = (typeof LOGIN_FORM_FIELDS)[number];

export type LoginFormFieldErrors = {
  [K in LoginFormFieldKey]?: string;
};

export const SIGN_UP_FORM_FIELDS = [
  "confirmPassword",
  "email",
  "name",
  "password",
] as const;

type SignUpFormFieldKey = (typeof SIGN_UP_FORM_FIELDS)[number];

export type SignUpFormFieldErrors = {
  [K in SignUpFormFieldKey]?: string;
};
