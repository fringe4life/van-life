import { describe, expect, it } from "bun:test";
import { COMMON_SORT_CONFIGS } from "~/lib/generic-sorting.server";
import type { UUIDv7 } from "~/types/ids.server";
import { resolveSortedCursor } from "./resolve-sorted-cursor.server";

const CURSOR = "01900000-0000-7000-8000-000000000099" as UUIDv7;

describe("resolveSortedCursor", () => {
  it("aligns id direction with the primary sort for newest", () => {
    const resolved = resolveSortedCursor(
      { cursor: undefined, limit: 10, sort: "newest" },
      COMMON_SORT_CONFIGS.transaction
    );

    expect(resolved.orderBy.id).toBe("desc");
    expect(resolved.orderByClause).toEqual({ createdAt: "desc" });
  });

  it("aligns id direction with the primary sort for lowest", () => {
    const resolved = resolveSortedCursor(
      { cursor: undefined, limit: 10, sort: "lowest" },
      COMMON_SORT_CONFIGS.transaction
    );

    expect(resolved.orderBy.id).toBe("asc");
    expect(resolved.orderByClause).toEqual({ amount: "asc" });
  });

  it("reverses both sort and id direction when paging backward", () => {
    const resolved = resolveSortedCursor(
      {
        cursor: CURSOR,
        direction: "backward",
        limit: 10,
        sort: "highest",
      },
      COMMON_SORT_CONFIGS.transaction
    );

    expect(resolved.orderBy.id).toBe("asc");
    expect(resolved.orderByClause).toEqual({ amount: "asc" });
    expect(resolved.cursorId).toBe(CURSOR);
  });
});
