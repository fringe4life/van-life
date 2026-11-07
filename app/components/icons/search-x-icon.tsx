import type { ReactElement } from "react";
import { css } from "styled-system/css/css";
import { type IconProps, IconShell } from "./icon";

/*
 * Outcome state: no matches.
 *
 * Two attempts before this one, both rejected on how they read at 20px: the
 * pack glyph puts an X in the lens, which is five strokes crossing in a 12px
 * circle, and a "list of results" inside the glass collapsed into a hamburger
 * inside a circle. A short list needs more room than a lens has.
 *
 * So the glass is empty and one amber slash crosses it. That is the whole
 * message — nothing under this lens — and it is a single clean stroke at any
 * size, in the same `glyph.amber` as the wallet coin and the star glint.
 *
 * Static: the state comes from the filter panel, not from a reader action, and
 * a beat beside announced content is noise. The sweep this ticket once proposed
 * is gone.
 */

const slashClassName = css({ stroke: "glyph.amber" });

const SearchXIcon = ({ className, size, ...rest }: IconProps): ReactElement => (
  <IconShell className={className} size={size} {...rest}>
    <circle cx="10.4" cy="10.2" r="6.2" />
    <path d="M15 15.2 20.4 20.6" />
    <path className={slashClassName} d="M7.4 7.2 13.4 13.2" strokeWidth={1.9} />
  </IconShell>
);

export { SearchXIcon };
