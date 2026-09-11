import { useSyncExternalStore } from "react";

function subscribeSupportsBaseSelect() {
  return () => undefined;
}

/**
 * Trust computed `appearance`, not `CSS.supports` alone. Engines like happy-dom
 * report `true` for unknown values without implementing customizable select.
 */
export function getSupportsBaseSelect(): boolean {
  if (typeof document === "undefined") {
    return false;
  }
  if (typeof CSS === "undefined" || typeof CSS.supports !== "function") {
    return false;
  }
  if (!CSS.supports("appearance", "base-select")) {
    return false;
  }
  const probe = document.createElement("select");
  probe.style.setProperty("appearance", "base-select");
  return (
    globalThis.getComputedStyle(probe as never).appearance === "base-select"
  );
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
