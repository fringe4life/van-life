import type { ReactElement } from "react";
import { css } from "styled-system/css/css";
import { type IconProps, IconShell } from "./icon";

/*
 * Outcome state: empty. A carton with its lid folded back.
 *
 * Redrawn rather than ported: the pack version is a flattened isometric parcel
 * with five paths, which at 20px inside the 36px rail marker turns into a
 * smudge. Three shapes read here — a lid lying behind, the body, and the tape.
 *
 * The tape is the one brand detail in the glyph, in `glyph.amber` — the same
 * amber as the wallet coin and the star glint — and it is a filled band rather
 * than a hairline so it survives the render size.
 *
 * Nothing moves: this is a live region beside a heading the reader is meant to
 * read, and the panel already reveals as a block. A beat here would suggest the
 * page is still loading, which is the one thing an empty state must not imply.
 */

const tapeClassName = css({ fill: "glyph.amber", stroke: "none" });

const PackageOpenIcon = ({
  className,
  size,
  ...rest
}: IconProps): ReactElement => (
  <IconShell className={className} size={size} {...rest}>
    <path d="M6.4 9.8 4.8 5.2" />
    <path d="M17.6 9.8 19.2 5.2" />
    <path d="M4.8 9.8h14.4l-1.3 9.4H6.1z" />
    <rect
      className={tapeClassName}
      height="6.2"
      rx="1.1"
      width="2.5"
      x="10.75"
      y="11.9"
    />
  </IconShell>
);

export { PackageOpenIcon };
