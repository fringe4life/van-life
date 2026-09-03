import { CustomLink } from "~/components/links/custom-link";
import { buttonVariants } from "~/components/ui/button-variants";
import { cx } from "../../../styled-system/css";
import type {
  OutcomeKind,
  OutcomeStateAction,
  OutcomeStateStyles,
} from "./types";

interface OutcomeStateActionsProps {
  kind: OutcomeKind;
  primaryAction?: OutcomeStateAction;
  secondaryAction?: OutcomeStateAction;
  styles: OutcomeStateStyles;
}

interface OutcomeActionLinkProps {
  action: OutcomeStateAction;
  className: string;
}

const OutcomeActionLink = ({ action, className }: OutcomeActionLinkProps) => {
  if (action.kind === "reload") {
    return (
      <a className={className} href={action.to}>
        {action.label}
      </a>
    );
  }

  return (
    <CustomLink className={className} to={action.to}>
      {action.label}
    </CustomLink>
  );
};

const OutcomeStateActions = ({
  kind,
  primaryAction,
  secondaryAction,
  styles,
}: OutcomeStateActionsProps) => (
  <nav aria-label="Recovery actions" className={styles.actions}>
    {primaryAction ? (
      <OutcomeActionLink
        action={primaryAction}
        className={cx(
          buttonVariants({
            size: "lg",
            variant: kind === "error" ? "destructive" : "default",
          }),
          styles.primaryAction
        )}
      />
    ) : null}
    {secondaryAction ? (
      <OutcomeActionLink
        action={secondaryAction}
        className={cx(
          buttonVariants({ size: "sm", variant: "link" }),
          styles.secondaryAction
        )}
      />
    ) : null}
  </nav>
);

export { OutcomeStateActions };
