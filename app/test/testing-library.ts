import { afterEach, expect } from "bun:test";
// biome-ignore lint/performance/noNamespaceImport: bun + jest-dom official expect.extend object
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
