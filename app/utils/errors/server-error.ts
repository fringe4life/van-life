import { data } from "react-router";

export function serverError(
  message = "Something went wrong. Please try again later."
): never {
  throw data(message, { status: 500 });
}
