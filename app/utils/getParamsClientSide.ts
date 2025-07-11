import { URLSearchParams } from "url";
import { DEFAULT_FILTER, DEFAULT_LIMIT, DEFAULT_PAGE } from "~/constants/constants";

export function getParamsClientSide(
  searchParams: URLSearchParams,
  defaultPage?: number ,
  defaultLimit?: number ,
) {

  if (!defaultPage) defaultPage = DEFAULT_PAGE
  if(!defaultLimit) defaultLimit = DEFAULT_LIMIT
  const page = Number.parseInt(
    searchParams.get("page") ?? defaultPage.toString()
  );
  const limit = Number.parseInt(
    searchParams.get("limit") ?? defaultLimit.toString()
  );

  const type = searchParams.get("type") ?? DEFAULT_FILTER;

  return { page, limit, type };
}
