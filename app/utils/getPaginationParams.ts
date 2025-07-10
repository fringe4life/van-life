import { URLSearchParams } from "url";
import { searchParamsSchema } from "~/utils/types";
export function getPaginationParams(url: string) {
  const searchParams = Object.fromEntries(
    new URLSearchParams(url.split("?").at(1) ?? "")
  );

  const { success, data } = searchParamsSchema.safeParse(searchParams);
  // TODO return defa
  if (!success) {
    console.log("unsuccesful");
    return {page: 1, limit: 10, typeFilter: ''};
  }
  const { page, limit, typeFilter } = data;

  return { page, limit, typeFilter };
}
