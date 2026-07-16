import { describe, expect, it } from "bun:test";
import type { VanModel } from "~/db/client.server";
import { VanState, VanType } from "~/db/enums";
import type { HostVanListItem, PendingVan } from "~/features/vans/types";
import type { UUIDv7 } from "~/types/ids.server";
import { useDisplayHostVans } from "./use-display-host-vans";

const HOST_ID = "01900000-0000-7000-8000-000000000001" as UUIDv7;

const IDS = {
  created: "01900000-0000-7000-8000-000000000010" as UUIDv7,
  other: "01900000-0000-7000-8000-000000000020" as UUIDv7,
  v1: "01900000-0000-7000-8000-000000000030" as UUIDv7,
  v2: "01900000-0000-7000-8000-000000000040" as UUIDv7,
  v3: "01900000-0000-7000-8000-000000000050" as UUIDv7,
} as const;

function makeVan(
  overrides: Partial<VanModel> & Pick<VanModel, "id" | "slug">
): VanModel {
  return {
    createdAt: new Date("2024-01-01T00:00:00Z"),
    description: "A fine van",
    discount: 0,
    hostId: HOST_ID,
    imageUrl: "https://example.com/van.jpg",
    isRented: false,
    name: "Test Van",
    price: 80,
    state: VanState.AVAILABLE,
    type: VanType.SIMPLE,
    ...overrides,
  };
}

function makePending(
  overrides: Partial<PendingVan> & Pick<PendingVan, "clientKey" | "slug">
): PendingVan {
  return {
    description: "Pending van",
    discount: 0,
    id: `pending_${overrides.clientKey}`,
    imageUrl: "",
    name: "Pending",
    price: 80,
    status: "pending",
    type: VanType.SIMPLE,
    ...overrides,
  };
}

const created = makeVan({ id: IDS.created, slug: "desert-dream" });
const other = makeVan({ id: IDS.other, name: "Other", slug: "other-van" });

describe("useDisplayHostVans", () => {
  it("returns optimistic items when fetcher has not created a van yet", () => {
    const optimisticItems: HostVanListItem[] = [
      makePending({ clientKey: "ck_1", slug: "desert-dream" }),
      other,
    ];

    expect(
      useDisplayHostVans({
        fetcherData: undefined,
        fetcherState: "idle",
        limit: 10,
        optimisticItems,
      })
    ).toEqual(optimisticItems);

    expect(
      useDisplayHostVans({
        fetcherData: { formError: "Nope", ok: false },
        fetcherState: "idle",
        limit: 10,
        optimisticItems,
      })
    ).toEqual(optimisticItems);

    expect(
      useDisplayHostVans({
        fetcherData: { ok: true, van: created },
        fetcherState: "submitting",
        limit: 10,
        optimisticItems,
      })
    ).toEqual(optimisticItems);
  });

  it("swaps pending matched by clientKey for the created van", () => {
    const pending = makePending({
      clientKey: "ck_match",
      slug: "temp-slug",
    });

    const result = useDisplayHostVans({
      fetcherData: {
        clientKey: "ck_match",
        ok: true,
        van: created,
      },
      fetcherState: "idle",
      limit: 10,
      optimisticItems: [pending, other],
    });

    expect(result).toEqual([created, other]);
  });

  it("swaps pending matched by slug when clientKey differs", () => {
    const pending = makePending({
      clientKey: "ck_other",
      slug: "desert-dream",
    });

    const result = useDisplayHostVans({
      fetcherData: {
        clientKey: "ck_new",
        ok: true,
        van: created,
      },
      fetcherState: "idle",
      limit: 10,
      optimisticItems: [pending, other],
    });

    expect(result).toEqual([created, other]);
  });

  it("does not prepend when created van already in list", () => {
    const result = useDisplayHostVans({
      fetcherData: {
        clientKey: "ck_1",
        ok: true,
        van: created,
      },
      fetcherState: "idle",
      limit: 10,
      optimisticItems: [other, created],
    });

    expect(result).toEqual([other, created]);
  });

  it("strips unmatched pending vans once a create succeeds", () => {
    const strayPending = makePending({
      clientKey: "ck_stray",
      slug: "unrelated",
    });

    const result = useDisplayHostVans({
      fetcherData: {
        clientKey: "ck_match",
        ok: true,
        van: created,
      },
      fetcherState: "idle",
      limit: 10,
      optimisticItems: [strayPending, other],
    });

    expect(result).toEqual([created, other]);
  });

  it("respects limit when prepending created van", () => {
    const vans = [
      makeVan({ id: IDS.v1, slug: "a" }),
      makeVan({ id: IDS.v2, slug: "b" }),
      makeVan({ id: IDS.v3, slug: "c" }),
    ];

    const result = useDisplayHostVans({
      fetcherData: { ok: true, van: created },
      fetcherState: "idle",
      limit: 2,
      optimisticItems: vans,
    });

    expect(result).toEqual([created, vans[0]]);
    expect(result).toHaveLength(2);
  });

  it("respects limit when created already present", () => {
    const vans = [
      created,
      makeVan({ id: IDS.v1, slug: "a" }),
      makeVan({ id: IDS.v2, slug: "b" }),
    ];

    const result = useDisplayHostVans({
      fetcherData: { ok: true, van: created },
      fetcherState: "idle",
      limit: 2,
      optimisticItems: vans,
    });

    expect(result).toEqual([created, vans[1]]);
  });
});
