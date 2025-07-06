import { URLSearchParams } from "url";

export function getParamsClientSide(
  searchParams: URLSearchParams,
  defaultPage: number = 1,
  defaultLimit: number = 10
) {
  const page = Number.parseInt(
    searchParams.get("page") ?? defaultPage.toString()
  );
  const limit = Number.parseInt(
    searchParams.get("limit") ?? defaultLimit.toString()
  );

  const typeFilter = searchParams.get("type") ?? "";

  return { page, limit, typeFilter };
}
