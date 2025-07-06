import { URLSearchParams } from "url";

export function getPaginationParams(
  url: string,
  defaultPage: number = 1,
  defaultLimit: number = 10
) {
  const searchParams = new URLSearchParams(url.split("?").at(1) ?? "");
  const page = Number.parseInt(
    searchParams.get("page") ?? defaultPage.toString()
  );
  const limit = Number.parseInt(
    searchParams.get("limit") ?? defaultLimit.toString()
  );

  const typeFilter = searchParams.get("type") ?? "";

  return { page, limit, typeFilter };
}
