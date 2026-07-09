import type { UUIDv7 } from "~/types/ids.server";
import type { User } from "~/types/index.server";
import type { Replace } from ".";

export type AuthenticatedUser = Replace<User, "id", UUIDv7>;
