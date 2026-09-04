import { href, useFetcher } from "react-router";
import { css, cx } from "styled-system/css";
import { getFetcherStatus } from "~/components/form/get-fetcher-status";
import { useAutoIdleStatus } from "~/components/form/use-auto-idle-status";
import { StatusButton } from "~/components/status-button";
import type { Children, Failure } from "~/types";

const SIGNOUT_FETCHER_KEY = "signout";

interface SignOutFormProps extends Children {
  className: string;
}

const SignOutForm = ({ children, className }: SignOutFormProps) => {
  const fetcher = useFetcher<Failure>({ key: SIGNOUT_FETCHER_KEY });
  const status = useAutoIdleStatus(
    getFetcherStatus(fetcher.state, fetcher.data)
  );

  return (
    <fetcher.Form action={href("/signout")} method="POST">
      <StatusButton
        aria-label="Sign out"
        className={cx(
          css({
            blockSize: "auto",
            fontSize: "inherit",
            fontWeight: "inherit",
          }),
          className
        )}
        status={status}
        type="submit"
        variant="ghost"
      >
        {children}
      </StatusButton>
    </fetcher.Form>
  );
};

export { SignOutForm };
