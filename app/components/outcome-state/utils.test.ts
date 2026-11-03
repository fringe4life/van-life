import { describe, expect, it } from "bun:test";
import { PackageOpenIcon } from "~/components/icons/package-open-icon";
import { SearchXIcon } from "~/components/icons/search-x-icon";
import { TriangleAlertIcon } from "~/components/icons/triangle-alert-icon";
import { getOutcomeStateVisibility, resolveOutcomeStateConfig } from "./utils";

const defaultCases = [
  { icon: PackageOpenIcon, kind: "empty" as const, label: "Empty" },
  { icon: TriangleAlertIcon, kind: "error" as const, label: "Error" },
  { icon: SearchXIcon, kind: "no-match" as const, label: "No matches" },
];

describe("resolveOutcomeStateConfig", () => {
  it("resolves the default presentation fields for every outcome kind", () => {
    for (const { icon, kind, label } of defaultCases) {
      const resolved = resolveOutcomeStateConfig({
        config: { title: "State title" },
        generatedHeadingId: "generated-id",
        kind,
      });

      expect(resolved.headingId).toBe("outcome-state-generated-id");
      expect(resolved.headingLevel).toBe("h2");
      expect(resolved.icon).toBe(icon);
      expect(resolved.label).toBe(label);
    }
  });

  it("preserves explicit presentation overrides", () => {
    const resolved = resolveOutcomeStateConfig({
      config: {
        headingId: "custom-heading",
        headingLevel: "h1",
        icon: SearchXIcon,
        label: "Custom state",
        title: "State title",
      },
      generatedHeadingId: "generated-id",
      kind: "error",
    });

    expect(resolved.headingId).toBe("custom-heading");
    expect(resolved.headingLevel).toBe("h1");
    expect(resolved.icon).toBe(SearchXIcon);
    expect(resolved.label).toBe("Custom state");
  });
});

describe("getOutcomeStateVisibility", () => {
  it("hides optional regions when no content or actions are provided", () => {
    expect(getOutcomeStateVisibility({})).toEqual({
      hasActions: false,
      hasAside: false,
      hasDescription: false,
      hasMetadata: false,
    });
  });

  it("keeps empty strings and false as present React content", () => {
    expect(
      getOutcomeStateVisibility({ description: "", metadata: false })
    ).toEqual({
      hasActions: false,
      hasAside: true,
      hasDescription: true,
      hasMetadata: true,
    });
  });

  it("shows the aside when either action is available", () => {
    expect(
      getOutcomeStateVisibility({
        primaryAction: { kind: "reload", label: "Try again", to: "/vans" },
      })
    ).toEqual({
      hasActions: true,
      hasAside: true,
      hasDescription: false,
      hasMetadata: false,
    });
  });
});
