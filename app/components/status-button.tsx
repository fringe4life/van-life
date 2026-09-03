import { Check, Loader2, X } from "lucide-react";
import type { ReactElement } from "react";
import { Button } from "~/components/ui/button";
import { css, cx } from "../../styled-system/css";
import { center, hstack, square } from "../../styled-system/patterns";

/**
 * Status of the button action
 */
type Status = "idle" | "pending" | "success" | "error";

/**
 * Props for the StatusButton component.
 * Extends standard Button props with a required status.
 */
interface StatusButtonProps extends React.ComponentProps<typeof Button> {
  /** The current status of the button action */
  status: Status;
}

// Component selection for status icons
const getStatusIcon = (status: Status): ReactElement | null => {
  switch (status) {
    case "pending":
      return (
        <Loader2
          className={cx(square({ size: "4" }), css({ animation: "spin" }))}
        />
      );
    case "success":
      return (
        <Check
          className={cx(square({ size: "4" }), css({ color: "success" }))}
        />
      );
    case "error":
      return (
        <X
          className={cx(square({ size: "4" }), css({ color: "destructive" }))}
        />
      );
    default:
      return null;
  }
};
/**
 * A specialized Button component that handles pending, success, and error states.
 *
 * Features:
 * - Prevents layout shifts by preserving space for children while showing status icons.
 * - Automatically disables the button during non-idle states.
 * - Uses absolute positioning to center status icons.
 * - Accessible with aria-busy for loading states.
 */
const StatusButton = ({
  status,
  className,
  children,
  disabled,
  ref,
  ...props
}: StatusButtonProps) => {
  const isIdle = status === "idle";

  const IconComponent = getStatusIcon(status);

  return (
    <Button
      aria-busy={status === "pending"}
      className={cx(
        css({
          position: "relative",
          transitionDuration: "normal",
          transitionProperty: "all",
        }),
        className
      )}
      // Button is disabled when not idle to prevent double submission
      // status is used as a proxy for disabled as requested
      disabled={disabled || !isIdle}
      ref={ref}
      {...props}
    >
      {/* Render children with invisible class when not idle to maintain button width */}
      <span
        className={cx(
          hstack({ gap: 2 }),
          !isIdle && css({ visibility: "hidden" })
        )}
      >
        {children}
      </span>

      {/* Overlay for status icons */}
      {IconComponent ? (
        <span className={center({ inset: "0", position: "absolute" })}>
          {IconComponent}
        </span>
      ) : null}
    </Button>
  );
};

export type { Status };
export { StatusButton };
