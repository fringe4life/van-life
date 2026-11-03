import type { ReactElement } from "react";
import { css, cx } from "styled-system/css";
import { center, hstack, square } from "styled-system/patterns";
import {
  CheckIcon,
  CrossIcon,
  SpinnerIcon,
} from "~/components/icons/status-icon";
import { Button } from "~/components/ui/button";
import type { ButtonVariantProps } from "~/components/ui/button-variants";

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

/*
 * One box for all three glyphs (#429 – #431). The overlay is absolutely
 * centred, so an identical 20px mark is what keeps the button from shuffling
 * or resizing as status flips between pending, success and error.
 */
const statusGlyph = square({ size: "5" });

/*
 * A button that is working is not a button that is unavailable. `disabled`
 * still goes on the element — it is what stops the second submit — but the
 * dimmed 50% that buttons use for "you cannot press this" would take the status
 * mark down with it, and a faded glyph is exactly what these tickets set out to
 * stop shipping. Only applied while a status is showing, so an idle button that
 * is genuinely disabled still looks disabled; the cursor carries the rest.
 */
const busyButton = css({
  _disabled: { cursor: "progress", opacity: "1 !important" },
});

/*
 * Colour stays here rather than in the glyph: which inks are legible is what
 * the button knows about its own surface, and a glyph only knows its shape. The
 * marks themselves carry the beat (draw-on, snap-in) and hold under reduced
 * motion.
 */
const FILLED_VARIANTS: ReadonlySet<NonNullable<ButtonVariantProps["variant"]>> =
  new Set(["default", "destructive", "secondary"]);

/*
 * Colour is the state on a plain surface, and the surface on a filled one. A
 * `destructive` cross on a filled `primary` button is pink on orange — reported
 * from the sign-in screen, and true of every success mark there too. So a filled
 * variant keeps the button's own foreground (the colour its label was using) and
 * lets the shape carry the state; outline, ghost and link keep the ticketed
 * `success` / `destructive` ink.
 */
const getStatusIcon = (
  status: Status,
  variant: NonNullable<ButtonVariantProps["variant"]>
): ReactElement | null => {
  const onFill = FILLED_VARIANTS.has(variant);

  switch (status) {
    case "pending":
      return <SpinnerIcon className={statusGlyph} />;
    case "success":
      return (
        <CheckIcon
          className={cx(statusGlyph, !onFill && css({ color: "success" }))}
        />
      );
    case "error":
      return (
        <CrossIcon
          className={cx(statusGlyph, !onFill && css({ color: "destructive" }))}
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
  variant = "default",
  ...props
}: StatusButtonProps) => {
  const isIdle = status === "idle";

  const IconComponent = getStatusIcon(status, variant);

  return (
    <Button
      aria-busy={status === "pending"}
      className={cx(
        css({
          position: "relative",
          transitionDuration: "normal",
          transitionProperty: "all",
        }),
        !isIdle && busyButton,
        className
      )}
      // Button is disabled when not idle to prevent double submission
      // status is used as a proxy for disabled as requested
      disabled={disabled || !isIdle}
      ref={ref}
      variant={variant}
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
