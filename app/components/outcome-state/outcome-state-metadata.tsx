import type { ReactNode } from "react";
import type { OutcomeStateStyles } from "./types";

interface OutcomeStateMetadataProps {
  metadata: ReactNode;
  styles: OutcomeStateStyles;
}

const OutcomeStateMetadata = ({
  metadata,
  styles,
}: OutcomeStateMetadataProps) => (
  <div className={styles.metadata}>{metadata}</div>
);

export { OutcomeStateMetadata };
