/**
 * Blocking first-paint script. Injected from `entry.server` into HTML,
 * not from React — React 19 does not execute `<script>` in components
 * on the client.
 *
 * Must run in `<head>` before CSS. No-op when `<html>` already has
 * `.dark` or `.light` (cookie / SSR class).
 */
export const THEME_BOOTSTRAP_SCRIPT = `(function(){try{var r=document.documentElement;if(r.classList.contains("dark")||r.classList.contains("light"))return;var d=window.matchMedia("(prefers-color-scheme: dark)").matches;r.classList.add(d?"dark":"light");r.style.colorScheme=d?"dark":"light";}catch(e){}})();`;

export const THEME_BOOTSTRAP_TAG = `<script data-cfasync="false">${THEME_BOOTSTRAP_SCRIPT}</script>`;

const COLOR_SCHEME_META = /<meta\b[^>]*\bname="color-scheme"[^>]*>/i;
const HEAD_CLOSE = "</head>";
const MAX_SCAN_BYTES = 8192;

export function injectThemeBootstrapHtml(html: string): string {
  const match = COLOR_SCHEME_META.exec(html);
  if (match === null) {
    return html;
  }

  const insertAt = match.index + match[0].length;
  if (html.startsWith(THEME_BOOTSTRAP_TAG, insertAt)) {
    return html;
  }

  return `${html.slice(0, insertAt)}${THEME_BOOTSTRAP_TAG}${html.slice(insertAt)}`;
}

export function injectThemeBootstrapIntoStream(
  body: ReadableStream<Uint8Array>
): ReadableStream<Uint8Array> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let leftover = "";
  let settled = false;

  const pull = async (
    controller: ReadableStreamDefaultController<Uint8Array>
  ) => {
    if (settled) {
      const rest = await reader.read();
      if (rest.done) {
        controller.close();
        return;
      }
      controller.enqueue(rest.value);
      return;
    }

    const next = await reader.read();
    if (next.done) {
      leftover += decoder.decode();
      controller.enqueue(encoder.encode(injectThemeBootstrapHtml(leftover)));
      leftover = "";
      controller.close();
      return;
    }

    leftover += decoder.decode(next.value, { stream: true });
    const injected = injectThemeBootstrapHtml(leftover);
    if (injected !== leftover) {
      controller.enqueue(encoder.encode(injected));
      leftover = "";
      settled = true;
      return;
    }

    if (leftover.includes(HEAD_CLOSE) || leftover.length >= MAX_SCAN_BYTES) {
      controller.enqueue(encoder.encode(leftover));
      leftover = "";
      settled = true;
      return;
    }

    await pull(controller);
  };

  return new ReadableStream<Uint8Array>({
    cancel(reason) {
      return reader.cancel(reason);
    },
    pull,
  });
}
