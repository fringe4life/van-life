import { URLSearchParams } from "url";
import { searchParamsSchema } from "~/utils/types";
import {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  DEFAULT_FILTER,
} from "~/constants/constants";
export function getPaginationParams(url: string) {
  const searchParams = Object.fromEntries(
    new URLSearchParams(url.split("?").at(1) ?? "")
  );
  const { success, data } = searchParamsSchema.safeParse(searchParams);

  if (!success) {
    return { page: DEFAULT_PAGE, limit: DEFAULT_LIMIT, type: DEFAULT_FILTER };
  }
  const { page, limit, type } = data;

  return { page, limit, type };
}
