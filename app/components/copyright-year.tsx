import { Suspense, use } from "react";
import { browser } from "react-dom";

const BrowserCopyrightYear = () => {
  use(browser("viewer-local calendar year"));
  return new Date().getFullYear();
};

const CopyrightYear = () => (
  <Suspense fallback={new Date().getFullYear()}>
    <BrowserCopyrightYear />
  </Suspense>
);

export { CopyrightYear };
