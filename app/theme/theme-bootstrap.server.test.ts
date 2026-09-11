import { describe, expect, it } from "bun:test";
import {
  injectThemeBootstrapHtml,
  injectThemeBootstrapIntoStream,
  THEME_BOOTSTRAP_SCRIPT,
  THEME_BOOTSTRAP_TAG,
} from "./theme-bootstrap.server";

const colorSchemeMeta = `<meta content="light dark" name="color-scheme"/>`;
const stylesheet = `<link rel="stylesheet" href="/app.css"/>`;
const documentStart = `<html><head><meta charset="utf-8"/>${colorSchemeMeta}${stylesheet}</head><body></body></html>`;

const readStream = async (stream: ReadableStream<Uint8Array>) =>
  await new Response(stream).text();

const chunkStream = (chunks: string[]) => {
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });
};

describe("injectThemeBootstrapHtml", () => {
  it("inserts the blocking script after color-scheme and before CSS", () => {
    const html = injectThemeBootstrapHtml(documentStart);
    const metaIndex = html.indexOf(colorSchemeMeta);
    const scriptIndex = html.indexOf(THEME_BOOTSTRAP_TAG);
    const cssIndex = html.indexOf(stylesheet);

    expect(scriptIndex).toBe(metaIndex + colorSchemeMeta.length);
    expect(scriptIndex).toBeLessThan(cssIndex);
    expect(html).toContain(`data-cfasync="false"`);
    expect(html).toContain(THEME_BOOTSTRAP_SCRIPT);
  });

  it("is a no-op without a color-scheme meta", () => {
    const html = "<html><head></head></html>";
    expect(injectThemeBootstrapHtml(html)).toBe(html);
  });

  it("does not insert twice", () => {
    const once = injectThemeBootstrapHtml(documentStart);
    expect(injectThemeBootstrapHtml(once)).toBe(once);
  });
});

describe("injectThemeBootstrapIntoStream", () => {
  it("injects when the meta is split across chunks", async () => {
    const splitAt = documentStart.indexOf("color-scheme") + 6;
    const html = await readStream(
      injectThemeBootstrapIntoStream(
        chunkStream([
          documentStart.slice(0, splitAt),
          documentStart.slice(splitAt),
        ])
      )
    );

    expect(html).toContain(THEME_BOOTSTRAP_TAG);
    expect(html.indexOf(THEME_BOOTSTRAP_TAG)).toBeLessThan(
      html.indexOf(stylesheet)
    );
  });

  it("passes through HTML that has no color-scheme meta", async () => {
    const html = "<html><head></head><body>ok</body></html>";
    expect(
      await readStream(injectThemeBootstrapIntoStream(chunkStream([html])))
    ).toBe(html);
  });
});
