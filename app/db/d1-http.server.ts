import { drizzle } from "drizzle-orm/sqlite-proxy";
import { tryCatch } from "~/utils/errors/try-catch.server";
import { relations } from "./relations";

interface D1HttpCredentials {
  accountId: string;
  databaseId: string;
  token: string;
}

interface D1RawResults {
  columns?: string[];
  rows?: unknown[][];
}

interface D1HttpResponse {
  errors: { code: number; message: string }[];
  result: { results: unknown[] | D1RawResults }[];
  success: boolean;
}

type SqliteProxyMethod = "run" | "all" | "values" | "get";

function extractRows(results: unknown[] | D1RawResults | undefined): unknown[] {
  if (!results) {
    return [];
  }
  // `/query` → object rows[]; `/raw` → { columns, rows }
  if (Array.isArray(results)) {
    return results;
  }
  return results.rows ?? [];
}

function d1HttpError(response: Response, body: string, cause?: unknown): Error {
  return new Error(
    `D1 HTTP API error: ${response.status} ${response.statusText}${body ? `\n${body}` : ""}`,
    cause === undefined ? undefined : { cause }
  );
}

function assertD1HttpSuccess(response: Response, data: D1HttpResponse): void {
  if (response.ok && data.success) {
    return;
  }
  const details = data.errors.map((e) => `${e.code}: ${e.message}`).join("\n");
  throw d1HttpError(response, details);
}

function parseD1HttpResponse(response: Response, text: string): D1HttpResponse {
  try {
    return JSON.parse(text) as D1HttpResponse;
  } catch (cause) {
    throw d1HttpError(response, text, cause);
  }
}

async function fetchD1Raw(
  baseUrl: string,
  token: string,
  sql: string,
  params: unknown[]
): Promise<D1HttpResponse> {
  const { data: response, error: fetchError } = await tryCatch(() =>
    fetch(`${baseUrl}/raw`, {
      body: JSON.stringify({ params, sql }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    })
  );

  if (fetchError || !response) {
    throw new Error("D1 HTTP API error: network request failed", {
      cause: fetchError,
    });
  }

  const text = await response.text().catch(() => "");
  const data = parseD1HttpResponse(response, text);
  assertD1HttpSuccess(response, data);
  return data;
}

function toProxyRows(
  data: D1HttpResponse,
  method: SqliteProxyMethod
): { rows: unknown[] } {
  const rows = extractRows(data.result[0]?.results);

  // `get` expects a single row array; everything else expects row arrays.
  if (method === "get") {
    // biome-ignore lint/suspicious/noUnnecessaryConditions: way to seed d1 in production
    return { rows: (rows[0] as unknown[]) ?? [] };
  }

  return { rows };
}

/**
 * Drizzle client over Cloudflare D1 HTTP API.
 * sqlite-proxy expects raw row arrays (`unknown[][]`), so use the `/raw` endpoint.
 */
export function createD1HttpDb(credentials: D1HttpCredentials) {
  const { accountId, databaseId, token } = credentials;
  const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}`;

  const remoteCallback = async (
    sql: string,
    params: unknown[],
    method: SqliteProxyMethod
  ) => {
    const data = await fetchD1Raw(baseUrl, token, sql, params);
    return toProxyRows(data, method);
  };

  return drizzle(remoteCallback, { relations });
}

export type D1HttpDb = ReturnType<typeof createD1HttpDb>;
