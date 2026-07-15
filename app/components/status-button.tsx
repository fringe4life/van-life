import { Check, Loader2, X } from "lucide-react";
import type { ReactElement } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/utils/utils";

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
      return <Loader2 className="size-4 animate-spin" />;
    case "success":
      return <Check className="size-4 text-green-500" />;
    case "error":
      return <X className="size-4 text-red-500" />;
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
      className={cn("relative transition-all duration-200", className)}
      // Button is disabled when not idle to prevent double submission
      // status is used as a proxy for disabled as requested
      disabled={disabled || !isIdle}
      ref={ref}
      {...props}
    >
      {/* Render children with invisible class when not idle to maintain button width */}
      <span className={cn("flex items-center gap-2", !isIdle && "invisible")}>
        {children}
      </span>

      {/* Overlay for status icons */}
      {IconComponent ? (
        <span className="absolute inset-0 flex items-center justify-center">
          {IconComponent}
        </span>
      ) : null}
    </Button>
  );
};

export type { Status, StatusButtonProps };
export { StatusButton };
