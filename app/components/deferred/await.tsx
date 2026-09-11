import type { ReactNode } from "react";
import { Suspense } from "react";
import { Await } from "react-router";
import { OutcomeState } from "~/components/outcome-state";
import { DeferredTransition } from "./transition";

const DEFAULT_ERROR = (
  <OutcomeState kind="error" title="Something went wrong" />
);

interface DeferredAwaitProps<T> {
  children: (data: T) => ReactNode;
  errorElement?: ReactNode;
  fallback: ReactNode;
  resolve: Promise<T>;
}

/**
 * Suspense + Await wrapper for deferred loader promises.
 */
const DeferredAwait = <T,>({
  children,
  errorElement = DEFAULT_ERROR,
  fallback,
  resolve,
}: DeferredAwaitProps<T>) => (
  <Suspense
    fallback={<DeferredTransition phase="exit">{fallback}</DeferredTransition>}
  >
    <DeferredTransition phase="enter">
      <Await errorElement={errorElement} resolve={resolve}>
        {children}
      </Await>
    </DeferredTransition>
  </Suspense>
);

export { DeferredAwait };
