import type { ReactNode } from "react";
import type { OutcomeHeadingLevel, OutcomeStateStyles } from "./types";

interface OutcomeStateContentProps {
  description: ReactNode;
  descriptionId: string;
  hasDescription: boolean;
  headingId: string;
  headingLevel: OutcomeHeadingLevel;
  label: string;
  styles: OutcomeStateStyles;
  title: ReactNode;
}

const OutcomeStateContent = ({
  description,
  descriptionId,
  hasDescription,
  headingId,
  headingLevel,
  label,
  styles,
  title,
}: OutcomeStateContentProps) => {
  const Heading = headingLevel;

  return (
    <div className={styles.content}>
      <span className={styles.eyebrow}>{label}</span>
      <Heading className={styles.heading} id={headingId}>
        {title}
      </Heading>
      {hasDescription ? (
        <p className={styles.description} id={descriptionId}>
          {description}
        </p>
      ) : null}
    </div>
  );
};

export { OutcomeStateContent };
