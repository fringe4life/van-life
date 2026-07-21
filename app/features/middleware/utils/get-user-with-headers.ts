import { parseUuidV7 } from "~/dal/parse-uuidv7.server";
import type { UserAndHeaders } from "~/features/middleware/types";
import { auth } from "~/lib/auth.server";
import type { AuthenticatedUser } from "~/types/auth.server";
import type { User } from "~/types/index.server";
import { tryCatch } from "~/utils/errors/try-catch.server";

const toAuthenticatedUser = (user: User): AuthenticatedUser => ({
  ...user,
  id: parseUuidV7(user.id),
});

const getUserWithHeaders = async (
  request: Request
): Promise<UserAndHeaders> => {
  const { data: responseWithHeaders } = await tryCatch(() =>
    auth.api.getSession({
      headers: request.headers,
      returnHeaders: true,
    })
  );
  const sessionUser = responseWithHeaders?.response?.user;
  const headers = responseWithHeaders?.headers;

  const user = sessionUser ? toAuthenticatedUser(sessionUser) : undefined;

  return { headers, user };
};

export { getUserWithHeaders };
