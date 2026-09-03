import type { LucideIcon } from "lucide-react";
import type { OutcomeStateStyles } from "./types";

interface OutcomeStateRailProps {
  Icon: LucideIcon;
  label: string;
  styles: OutcomeStateStyles;
}

const OutcomeStateRail = ({ Icon, label, styles }: OutcomeStateRailProps) => (
  <aside aria-label={`${label} state`} className={styles.rail}>
    <span className={styles.marker}>
      <Icon aria-hidden className={styles.icon} />
    </span>
    <span className={styles.label}>{label}</span>
    <span aria-hidden="true" className={styles.seam} data-outcome-state-seam />
  </aside>
);

export { OutcomeStateRail };
