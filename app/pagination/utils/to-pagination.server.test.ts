import { describe, expect, it } from "bun:test";
import type { UUIDv7 } from "~/types/ids.server";
import { NO_PAGINATION, PAGINATION_METADATA } from "../pagination-constants";
import { toPagination } from "./to-pagination.server";

const a = { id: "a" };
const b = { id: "b" };
const c = { id: "c" };
const cursor = "01900000-0000-7000-8000-000000000001" as UUIDv7;

describe("toPagination", () => {
  it("returns NO_PAGINATION when items is null", () => {
    expect(toPagination({ cursor: undefined, items: null, limit: 2 })).toBe(
      NO_PAGINATION
    );
  });

  it("returns NO_PAGINATION when items is undefined", () => {
    expect(
      toPagination({ cursor: undefined, items: undefined, limit: 2 })
    ).toBe(NO_PAGINATION);
  });

  it("returns empty items and PAGINATION_METADATA when items is empty", () => {
    const items: { id: string }[] = [];
    const result = toPagination({ cursor: undefined, items, limit: 2 });

    expect(result.items).toBe(items);
    expect(result.paginationMetadata).toBe(PAGINATION_METADATA);
  });

  it("keeps all items and both flags false at exact limit, forward, no cursor", () => {
    expect(
      toPagination({
        cursor: undefined,
        direction: "forward",
        items: [a, b],
        limit: 2,
      })
    ).toEqual({
      items: [a, b],
      paginationMetadata: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
  });

  it("slices to limit and sets hasNext when more than limit, forward, no cursor", () => {
    expect(
      toPagination({
        cursor: undefined,
        direction: "forward",
        items: [a, b, c],
        limit: 2,
      })
    ).toEqual({
      items: [a, b],
      paginationMetadata: {
        hasNextPage: true,
        hasPreviousPage: false,
      },
    });
  });

  it("sets both flags when more than limit, forward, with cursor", () => {
    expect(
      toPagination({
        cursor,
        direction: "forward",
        items: [a, b, c],
        limit: 2,
      })
    ).toEqual({
      items: [a, b],
      paginationMetadata: {
        hasNextPage: true,
        hasPreviousPage: true,
      },
    });
  });

  it("reverses sliced items and sets both flags when more than limit, backward, with cursor", () => {
    expect(
      toPagination({
        cursor,
        direction: "backward",
        items: [a, b, c],
        limit: 2,
      })
    ).toEqual({
      items: [b, a],
      paginationMetadata: {
        hasNextPage: true,
        hasPreviousPage: true,
      },
    });
  });

  it("reverses items and sets both flags false when backward, no extra item, no cursor", () => {
    expect(
      toPagination({
        cursor: undefined,
        direction: "backward",
        items: [a, b],
        limit: 2,
      })
    ).toEqual({
      items: [b, a],
      paginationMetadata: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
  });

  it("defaults omitted direction to forward", () => {
    expect(
      toPagination({
        cursor: undefined,
        items: [a, b, c],
        limit: 2,
      })
    ).toEqual({
      items: [a, b],
      paginationMetadata: {
        hasNextPage: true,
        hasPreviousPage: false,
      },
    });
  });
});
