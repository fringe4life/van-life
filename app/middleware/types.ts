import type { Maybe, Prettify } from "~/types";
import type { AuthenticatedUser } from "~/types/auth.server";

interface HeadersObject {
  headers: Maybe<Headers>;
}

export type UserAndHeaders = Prettify<
  HeadersObject & {
    user: Maybe<AuthenticatedUser>;
  }
>;

export type SetCookieHeaders = Prettify<
  HeadersObject & {
    result: Response;
  }
>;
