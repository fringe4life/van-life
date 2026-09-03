import { href, isRouteErrorResponse, useLocation } from "react-router";
import { css } from "styled-system/css";
import { HTTP_STATUS } from "~/constants/http-constants";
import { getRouteErrorMessage } from "~/utils/errors/get-route-error-message";
import { OutcomeState } from "./outcome-state";
import type { OutcomeStateConfig } from "./outcome-state/types";

const PATH_SEPARATOR_PATTERN = /[?#]/u;
const DEFAULT_NOT_FOUND_DESCRIPTION =
  "We couldn't find this page. The address may be incorrect, or the page may have moved.";
const DEFAULT_ERROR_TITLE = "Something went wrong";

interface RouteErrorBoundaryProps {
  emptyState?: Partial<OutcomeStateConfig>;
  error: unknown;
  errorFallback?: string;
  errorState?: Partial<OutcomeStateConfig>;
  fallback?: string;
}

const getDisplayPathname = (pathname?: string) => {
  const displayPathname = pathname?.split(PATH_SEPARATOR_PATTERN, 1)[0]?.trim();
  return displayPathname || "unavailable";
};

const PathMetadata = ({ pathname }: { pathname?: string }) => (
  <span>
    <strong>Path:</strong> <bdi dir="auto">{getDisplayPathname(pathname)}</bdi>
  </span>
);

const ErrorMetadata = ({
  error,
  pathname,
}: {
  error: unknown;
  pathname?: string;
}) => {
  const developerStack =
    import.meta.env.DEV && error instanceof Error ? error.stack : undefined;
  const hasDeveloperStack = Boolean(developerStack);

  return (
    <div className={css({ display: "grid", gap: "2" })}>
      <PathMetadata pathname={pathname} />
      {hasDeveloperStack ? (
        <details>
          <summary>Developer details</summary>
          <pre
            className={css({
              maxBlockSize: "sm",
              overflow: "auto",
              paddingBlockStart: "2",
              whiteSpace: "pre-wrap",
            })}
          >
            <code>{developerStack}</code>
          </pre>
        </details>
      ) : null}
    </div>
  );
};

const mergeOutcomeState = (
  defaults: OutcomeStateConfig,
  overrides?: Partial<OutcomeStateConfig>
): OutcomeStateConfig => ({
  ...defaults,
  ...overrides,
  title: overrides?.title ?? defaults.title,
});

const RouteErrorBoundary = ({
  emptyState,
  error,
  errorFallback,
  errorState,
  fallback,
}: RouteErrorBoundaryProps) => {
  const { pathname } = useLocation();
  const errorMessage = getRouteErrorMessage(error, {
    errorFallback,
    fallback,
  });
  const retryTo = pathname?.trim() || "/";

  if (isRouteErrorResponse(error) && error.status === HTTP_STATUS.NOT_FOUND) {
    const state = mergeOutcomeState(
      {
        description: DEFAULT_NOT_FOUND_DESCRIPTION,
        headingLevel: "h1",
        metadata: <PathMetadata pathname={pathname} />,
        primaryAction: { label: "Return home", to: href("/") },
        secondaryAction: { label: "Browse vans", to: href("/vans") },
        title: "Page not found",
      },
      emptyState
    );

    return <OutcomeState kind="empty" {...state} />;
  }

  const state = mergeOutcomeState(
    {
      description: errorMessage,
      headingLevel: "h1",
      metadata: <ErrorMetadata error={error} pathname={pathname} />,
      primaryAction: { kind: "reload", label: "Try again", to: retryTo },
      secondaryAction: { label: "Return home", to: href("/") },
      title: DEFAULT_ERROR_TITLE,
    },
    errorState
  );

  return <OutcomeState kind="error" {...state} />;
};

export { RouteErrorBoundary };
