import { useId } from "react";
import { cx } from "styled-system/css";
import { OutcomeStateActions } from "./outcome-state-actions";
import { OutcomeStateContent } from "./outcome-state-content";
import { OutcomeStateMetadata } from "./outcome-state-metadata";
import { OutcomeStateRail } from "./outcome-state-rail";
import { outcomeStateRecipe } from "./outcome-state-recipe";
import type { OutcomeStateProps } from "./types";
import { getOutcomeStateVisibility, resolveOutcomeStateConfig } from "./utils";

const OutcomeState = ({ className, kind, ...config }: OutcomeStateProps) => {
  const generatedHeadingId = useId();
  const resolvedConfig = resolveOutcomeStateConfig({
    config,
    generatedHeadingId,
    kind,
  });
  const {
    description,
    headingId,
    headingLevel,
    icon: StateIcon,
    label,
    metadata,
    primaryAction,
    secondaryAction,
    title,
  } = resolvedConfig;
  const styles = outcomeStateRecipe({ kind });
  const { hasActions, hasAside, hasDescription, hasMetadata } =
    getOutcomeStateVisibility(resolvedConfig);
  const descriptionId = `${headingId}-description`;

  return (
    <section
      aria-atomic="true"
      aria-describedby={hasDescription ? descriptionId : undefined}
      aria-labelledby={headingId}
      aria-live={kind === "error" ? "assertive" : "polite"}
      className={cx(styles.root, className)}
      role={kind === "error" ? "alert" : "status"}
    >
      <div className={styles.panel}>
        <OutcomeStateRail Icon={StateIcon} label={label} styles={styles} />
        <div className={styles.body}>
          <OutcomeStateContent
            description={description}
            descriptionId={descriptionId}
            hasDescription={hasDescription}
            headingId={headingId}
            headingLevel={headingLevel}
            label={label}
            styles={styles}
            title={title}
          />
          {hasAside ? (
            <aside className={styles.aside}>
              {hasMetadata ? (
                <OutcomeStateMetadata metadata={metadata} styles={styles} />
              ) : null}
              {hasActions ? (
                <OutcomeStateActions
                  kind={kind}
                  primaryAction={primaryAction}
                  secondaryAction={secondaryAction}
                  styles={styles}
                />
              ) : null}
            </aside>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export { OutcomeState };
