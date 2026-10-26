import { drizzle, type SqliteProxyExecutors } from "drizzle-orm/sqlite-proxy";
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

interface ParsedRawResults {
  columns: string[];
  rows: unknown[][];
}

function parseRawResults(
  results: unknown[] | D1RawResults | undefined
): ParsedRawResults {
  if (!results) {
    return { columns: [], rows: [] };
  }
  // `/query` → object rows[]; `/raw` → { columns, rows }
  if (Array.isArray(results)) {
    if (results.length === 0) {
      return { columns: [], rows: [] };
    }
    const [first] = results;
    if (Array.isArray(first)) {
      return { columns: [], rows: results as unknown[][] };
    }
    const columns = Object.keys(first as Record<string, unknown>);
    const rows = (results as Record<string, unknown>[]).map((row) =>
      columns.map((column) => row[column])
    );
    return { columns, rows };
  }
  return {
    columns: results.columns ?? [],
    rows: results.rows ?? [],
  };
}

function rowToObject(
  columns: string[],
  row: unknown[]
): Record<string, unknown> {
  const record: Record<string, unknown> = {};
  for (const [index, column] of columns.entries()) {
    record[column] = row[index];
  }
  return record;
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

  const { data: text } = await tryCatch(() => response.text());
  const data = parseD1HttpResponse(response, text ?? "");
  assertD1HttpSuccess(response, data);
  return data;
}

/**
 * Drizzle client over Cloudflare D1 HTTP API.
 * sqlite-proxy expects raw row arrays (`unknown[][]`), so use the `/raw` endpoint.
 */
export function createD1HttpDb(credentials: D1HttpCredentials) {
  const { accountId, databaseId, token } = credentials;
  const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}`;

  const queryRaw = async (sql: string, params: unknown[]) => {
    const data = await fetchD1Raw(baseUrl, token, sql, params);
    return parseRawResults(data.result[0]?.results);
  };

  const executors = {
    all: (sql, params, rowMode) =>
      queryRaw(sql, params).then(({ columns, rows }) => {
        if (rowMode === "object") {
          return rows.map((row) => rowToObject(columns, row));
        }
        return rows;
      }),
    get: (sql, params, rowMode) =>
      queryRaw(sql, params).then(({ columns, rows }) => {
        const [first] = rows;
        if (first === undefined) {
          return;
        }
        if (rowMode === "object") {
          return rowToObject(columns, first);
        }
        return first;
      }),
    run: async (sql, params) => {
      await queryRaw(sql, params);
    },
  } as SqliteProxyExecutors;

  return drizzle(executors, { relations });
}

export type D1HttpDb = ReturnType<typeof createD1HttpDb>;
