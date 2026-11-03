declare module "subset-font" {
  type TargetFormat = "sfnt" | "truetype" | "woff" | "woff2";

  interface SubsetFontOptions {
    /** Name records to keep. Defaults to a small subset of the naming table. */
    preserveNameIds?: readonly string[];
    /** Output container. Defaults to the input container. */
    targetFormat?: TargetFormat;
    variationAxes?: Record<
      string,
      number | { min?: number; max?: number; default?: number }
    >;
  }

  const subsetFont: (
    font: Buffer | ArrayBuffer | Uint8Array,
    text: string,
    options?: SubsetFontOptions
  ) => Promise<Buffer>;

  export default subsetFont;
}
