import { drizzle } from "drizzle-orm/sqlite-proxy";
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
    method: "run" | "all" | "values" | "get"
  ) => {
    const response = await fetch(`${baseUrl}/raw`, {
      body: JSON.stringify({ params, sql }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    if (!response.ok) {
      throw new Error(
        `D1 HTTP API error: ${response.status} ${response.statusText}`
      );
    }
    const data = (await response.json()) as D1HttpResponse;
    if (!data.success) {
      const message = data.errors
        .map((error) => `${error.code}: ${error.message}`)
        .join("\n");
      throw new Error(message);
    }

    const rows = extractRows(data.result[0]?.results);

    // `get` expects a single row array; everything else expects row arrays.
    if (method === "get") {
      // biome-ignore lint/suspicious/noUnnecessaryConditions: way to seed d1 in production
      return { rows: (rows[0] as unknown[]) ?? [] };
    }

    return { rows };
  };

  return drizzle(remoteCallback, { relations });
}

export type D1HttpDb = ReturnType<typeof createD1HttpDb>;
