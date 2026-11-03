import { useSyncExternalStore } from "react";

function subscribeSupportsBaseSelect() {
  return () => undefined;
}

let capability: boolean | undefined;

interface ComputedStyleLike {
  getPropertyValue: (property: string) => string;
}

/**
 * Confirm the engine honours `base-select` rather than merely parsing it.
 *
 * `getComputedStyle` only resolves against an element that is in the document.
 * A detached `<select>` reports an empty `appearance` even where customizable
 * select is supported, so probing one off-document pins this check to `false`
 * on every browser — which is exactly how the glyphs became invisible.
 *
 * The probe is therefore attached, read and removed inside one synchronous
 * call: zero-sized, invisible, inert and never painted.
 */
function detectSupportsBaseSelect(): boolean {
  if (typeof document === "undefined") {
    return false;
  }
  if (typeof CSS === "undefined" || typeof CSS.supports !== "function") {
    return false;
  }
  if (!CSS.supports("appearance", "base-select")) {
    return false;
  }

  const { body } = document;
  if (!body) {
    return false;
  }

  const probe = document.createElement("select");
  probe.setAttribute("aria-hidden", "true");
  probe.style.setProperty("appearance", "base-select");
  probe.style.setProperty("block-size", "0");
  probe.style.setProperty("inline-size", "0");
  probe.style.setProperty("pointer-events", "none");
  probe.style.setProperty("position", "absolute");
  probe.style.setProperty("visibility", "hidden");
  probe.tabIndex = -1;
  // The Worker typings ship a second DOM declaration set that does not line up
  // with lib.dom, so both boundary calls are cast; at runtime these are an
  // ordinary <select> and an ordinary body.
  body.append(probe as never);

  try {
    const style = globalThis.getComputedStyle(
      probe as never
    ) as unknown as ComputedStyleLike;
    return style.getPropertyValue("appearance") === "base-select";
  } finally {
    probe.remove();
  }
}

/**
 * Cached capability read. The answer cannot change during a session, and this
 * is called from `useSyncExternalStore`'s snapshot on every render — which has
 * to stay free of repeated DOM work.
 */
export function getSupportsBaseSelect(): boolean {
  if (typeof document === "undefined") {
    return false;
  }
  capability ??= detectSupportsBaseSelect();
  return capability;
}

/** Test seam: drop the cached answer so a new probe is taken. */
export function resetSupportsBaseSelect(): void {
  capability = undefined;
}

/**
 * Chromium customizable `<select>` (`appearance: base-select`).
 *
 * Server snapshot is always `false` so SSR and the first hydrate pass stay a
 * classic `<select>`. After hydrate, supporting engines re-render with
 * `<button>` / `<selectedcontent>` / rich options. React still logs a DEV
 * nesting warning ([#33038](https://github.com/facebook/react/issues/33038));
 * that is a client update, not a hydrate mismatch.
 */
export function useSupportsBaseSelect(): boolean {
  return useSyncExternalStore(
    subscribeSupportsBaseSelect,
    getSupportsBaseSelect,
    () => false
  );
}
