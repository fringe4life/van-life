import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import {
  getSupportsBaseSelect,
  resetSupportsBaseSelect,
} from "./use-supports-base-select";

const originalGetComputedStyle = globalThis.getComputedStyle;
const originalCSS = globalThis.CSS;

interface StubOptions {
  appearance: (element: Element) => string;
  onRead?: (element: Element) => void;
}

const stubAppearance = ({ appearance, onRead }: StubOptions) => {
  globalThis.getComputedStyle = ((element: Element) => {
    onRead?.(element);
    return {
      getPropertyValue: (property: string) =>
        property === "appearance" ? appearance(element) : "",
    } as unknown as CSSStyleDeclaration;
  }) as unknown as typeof getComputedStyle;
};

const stubSupports = (supported: boolean) => {
  Object.defineProperty(globalThis, "CSS", {
    configurable: true,
    value: { supports: () => supported } as unknown as typeof CSS,
    writable: true,
  });
};

describe("getSupportsBaseSelect", () => {
  beforeEach(() => {
    resetSupportsBaseSelect();
  });

  afterEach(() => {
    globalThis.getComputedStyle = originalGetComputedStyle;
    Object.defineProperty(globalThis, "CSS", {
      configurable: true,
      value: originalCSS,
      writable: true,
    });
    resetSupportsBaseSelect();
  });

  it("reads the computed value only once the probe is in the document", () => {
    stubSupports(true);
    stubAppearance({
      appearance: (element) => (element.isConnected ? "base-select" : ""),
      onRead: (element) => {
        expect(element.isConnected).toBe(true);
      },
    });

    expect(getSupportsBaseSelect()).toBe(true);
  });

  it("would fail if the probe were read while detached", () => {
    stubSupports(true);
    stubAppearance({
      // The real engine answers this way for an off-document element, which is
      // the regression this hook exists to avoid.
      appearance: (element) => (element.isConnected ? "" : "base-select"),
    });

    expect(getSupportsBaseSelect()).toBe(false);
  });

  it("leaves no probe behind in either outcome", () => {
    stubSupports(true);
    stubAppearance({ appearance: () => "" });
    expect(getSupportsBaseSelect()).toBe(false);
    expect(document.body.querySelector("select")).toBeNull();

    resetSupportsBaseSelect();
    stubAppearance({ appearance: () => "base-select" });
    expect(getSupportsBaseSelect()).toBe(true);
    expect(document.body.querySelector("select")).toBeNull();
  });

  it("does not touch the DOM when the engine rejects the value outright", () => {
    stubSupports(false);
    let reads = 0;
    stubAppearance({
      appearance: () => "base-select",
      onRead: () => {
        reads += 1;
      },
    });

    expect(getSupportsBaseSelect()).toBe(false);
    expect(reads).toBe(0);
  });

  it("probes once, then answers from the cached result", () => {
    stubSupports(true);
    let probes = 0;
    stubAppearance({
      appearance: (element) => {
        probes += 1;
        return element.isConnected ? "base-select" : "";
      },
    });

    expect(getSupportsBaseSelect()).toBe(true);
    expect(getSupportsBaseSelect()).toBe(true);
    expect(probes).toBe(1);
  });
});
