import { describe, expect, it, mock } from "bun:test";
import { render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { createMemoryRouter, RouterProvider } from "react-router";
import type { VanModel } from "~/db/client.server";
import { VanState, VanType } from "~/db/enums";
import {
  DEFAULT_CURSOR,
  DEFAULT_LIMIT,
} from "~/pagination/pagination-constants";
import type { UUIDv7 } from "~/types/ids.server";

const van = {
  createdAt: new Date("2024-01-01T00:00:00Z"),
  description: "A fine van",
  discount: 0,
  hostId: "01900000-0000-7000-8000-000000000001" as UUIDv7,
  id: "01900000-0000-7000-8000-000000000010" as UUIDv7,
  imageUrl: "https://example.com/van.jpg",
  isRented: false,
  name: "Test Van",
  price: 80,
  slug: "test-van",
  state: VanState.AVAILABLE,
  type: VanType.SIMPLE,
} satisfies VanModel;

const seo = {
  description: "A van",
  title: "Modest Explorer | VanLife",
  url: "https://example.com/vans/modest-explorer",
};

mock.module("~/features/vans/components/van-detail", () => ({
  default: ({ van: detailVan }: { van: { name: string } }) => (
    <div>{detailVan.name}</div>
  ),
}));

mock.module("~/features/vans/loaders.server", () => ({
  loadVansSearchParams: () => ({
    cursor: DEFAULT_CURSOR,
    excludeInRepair: false,
    limit: DEFAULT_LIMIT,
    onlyOnSale: false,
    search: "",
    types: [],
  }),
}));

mock.module("~/features/vans/seo.server", () => ({
  buildVanDetailPageSeo: () => seo,
}));

mock.module("~/features/vans/services/van-detail.server", () => ({
  loadVanBySlug: () => ({ data: null, error: null }),
}));

mock.module("~/middleware/contexts/db", () => ({
  dbContext: {},
}));

const { default: VanDetailPage } = await import("./van-detail");

type VanDetailPageProps = ComponentProps<typeof VanDetailPage>;
type VanDetailLoaderData = VanDetailPageProps["loaderData"];

const FILTER_QUERY_KEYS = [
  "excludeInRepair",
  "onlyOnSale",
  "search",
  "types",
] as const;

const ALL_VANS_LINK = /back to all vans/i;
const FILTERED_VANS_LINK = /back to filtered vans/i;
const FILTERED_TEXT = /filtered/i;

const createLoaderData = (
  overrides: Partial<VanDetailLoaderData> = {}
): VanDetailLoaderData => ({
  cursor: DEFAULT_CURSOR,
  excludeInRepair: false,
  limit: DEFAULT_LIMIT,
  onlyOnSale: false,
  search: "",
  seo,
  types: [],
  van,
  ...overrides,
});

const renderVanDetailPage = (overrides: Partial<VanDetailLoaderData> = {}) => {
  const props = {
    loaderData: createLoaderData(overrides),
  } as VanDetailPageProps;
  const router = createMemoryRouter([
    {
      element: <VanDetailPage {...props} />,
      path: "/",
    },
  ]);

  return render(<RouterProvider router={router} />);
};

const backLinkHref = (name: RegExp) => {
  const href = screen.getByRole("link", { name }).getAttribute("href");
  return new URL(href ?? "", "https://example.com");
};

describe("VanDetailPage", () => {
  it("links back to all vans when no filters are active", () => {
    renderVanDetailPage();

    const link = screen.getByRole("link", { name: ALL_VANS_LINK });
    expect(link).toBeInTheDocument();
    expect(link).not.toHaveTextContent(FILTERED_TEXT);

    const url = backLinkHref(ALL_VANS_LINK);
    expect(url.pathname).toBe("/vans");
    for (const key of FILTER_QUERY_KEYS) {
      expect(url.searchParams.has(key)).toBe(false);
    }
  });

  it("links back to filtered vans when search is non-empty", () => {
    renderVanDetailPage({ search: "explorer" });

    expect(
      screen.getByRole("link", { name: FILTERED_VANS_LINK })
    ).toBeInTheDocument();

    const url = backLinkHref(FILTERED_VANS_LINK);
    expect(url.pathname).toBe("/vans");
    expect(url.searchParams.get("search")).toBe("explorer");
  });

  it("treats whitespace-only search as no active filter", () => {
    renderVanDetailPage({ search: "   " });

    const link = screen.getByRole("link", { name: ALL_VANS_LINK });
    expect(link).toBeInTheDocument();
    expect(link).not.toHaveTextContent(FILTERED_TEXT);

    const url = backLinkHref(ALL_VANS_LINK);
    expect(url.pathname).toBe("/vans");
    expect(url.searchParams.has("search")).toBe(false);
  });

  it("links back to filtered vans when types are selected", () => {
    renderVanDetailPage({ types: ["SIMPLE"] });

    expect(
      screen.getByRole("link", { name: FILTERED_VANS_LINK })
    ).toBeInTheDocument();
  });

  it("links back to filtered vans when excludeInRepair is true", () => {
    renderVanDetailPage({ excludeInRepair: true });

    expect(
      screen.getByRole("link", { name: FILTERED_VANS_LINK })
    ).toBeInTheDocument();
  });

  it("links back to filtered vans when onlyOnSale is true", () => {
    renderVanDetailPage({ onlyOnSale: true });

    expect(
      screen.getByRole("link", { name: FILTERED_VANS_LINK })
    ).toBeInTheDocument();
  });

  it("renders the mocked van name and seo title", () => {
    renderVanDetailPage();

    expect(screen.getByText("Test Van")).toBeInTheDocument();
    expect(document.title).toBe("Modest Explorer | VanLife");
  });
});
