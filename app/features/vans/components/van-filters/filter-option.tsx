import { type ChangeEvent, startTransition } from "react";
import { css, cx } from "styled-system/css";
import type { Prettify } from "~/types";

/**
 * The dimension an option filters. The key fills with the token family its
 * badge already uses — `type.simple`, `status.repair` — so the swatch on a card
 * and the control that produced it cannot drift apart.
 */
type FilterTone = "luxury" | "repair" | "rugged" | "sale" | "simple";

type FilterOptionProps = Prettify<{
  checked: boolean;
  className?: string;
  label: string;
  onChange: (checked: boolean) => void;
  tone: FilterTone;
}>;

/**
 * The input stays in the tree, keyboard-reachable and counted by screen readers;
 * it is the label that is drawn, so the row is the hit target and the key can be
 * any shape we like.
 */
const srOnly = css({
  blockSize: "1px",
  clip: "rect(0, 0, 0, 0)",
  clipPath: "inset(50%)",
  inlineSize: "1px",
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
});

/*
 * The row carries its own inline padding, so the hover tint starts before the
 * key instead of running flush against it. The padding also insets the key from
 * the panel's own edge; the legend carries the same inset, which is what keeps
 * the two on one line. Nothing overhangs the column — the tint stops where the
 * page gutter stops.
 */
const optionBase = css({
  _hover: {
    backgroundColor: "surface.muted",
  },
  "&:has(input:checked) [data-filter-label]": {
    fontWeight: "medium",
  },
  /* The row is the target, so the row is what carries the focus ring. */
  "&:has(input:focus-visible)": {
    outlineColor: "ring",
    outlineOffset: "2px",
    outlineStyle: "solid",
    outlineWidth: "2px",
  },
  /*
   * Press. `:hover:active` (two pseudo-classes) rather than `_active` alone:
   * a one-class `:active` rule loses the cascade to `_hover` depending on
   * emit order, so the tint would not deepen while the pointer is held.
   */
  "&:hover:active": {
    backgroundColor: "accent",
  },
  alignItems: "center",
  borderRadius: "sm",
  /*
   * The row is the control, so it has to say so. A `label` keeps the UA's
   * `default` and the real `<input>` that would lend it a pointer is the
   * visually hidden one — without this the only affordance on a full-width
   * press target was the hover tint.
   */
  cursor: "pointer",
  display: "flex",
  gap: "2.5",
  minBlockSize: "11",
  paddingInline: "2",
  transitionDuration: "fast",
  transitionProperty: "background-color",
});

/**
 * The drawn key. At rest it is an empty outline; when the peer input is checked
 * the outline becomes a flat fill in the option's tone and the tick draws itself
 * in through `stroke-dashoffset`. A tick that fades in reads as a texture; a
 * tick that is drawn reads as a mark being made.
 */
const keyBase = css({
  /* 0.86 on a 20px key is ~1.4px a side — visible; 0.9 was not. */
  _groupActive: {
    scale: "0.86",
  },
  _peerChecked: {
    "& path": {
      strokeDashoffset: "0",
    },
    backgroundColor: "var(--_filter-tone)",
    borderColor: "var(--_filter-tone)",
  },
  _red: {
    "& path": { transitionDuration: "0s" },
    transitionDuration: "0s",
  },
  "& path": {
    stroke: "currentColor",
    strokeDasharray: "18",
    strokeDashoffset: "18",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2.4",
    transitionDuration: "200ms",
    transitionProperty: "stroke-dashoffset",
    transitionTimingFunction: "glide",
  },
  "& svg": {
    blockSize: "3",
    inlineSize: "3",
  },
  /*
   * The key keeps its own surface. A transparent interior lets the row's hover
   * tint show through, so the control appears to take its colour from the warm
   * background it happens to sit on instead of reading as a neutral well.
   */
  backgroundColor: "card",
  blockSize: "5",
  borderColor: "input",
  /*
   * 6px on a 20px key. `md` (8px) is close enough to half the height that it
   * reads as a circle, and a circle is the affordance for a radio — these are
   * five independent checkboxes.
   */
  borderRadius: "sm",
  borderStyle: "solid",
  borderWidth: "2px",
  color: "var(--_filter-tone-foreground)",
  display: "grid",
  flexShrink: "0",
  inlineSize: "5",
  placeItems: "center",
  transitionDuration: "fast",
  transitionProperty: "background-color,border-color,scale",
});

const labelBase = css({
  color: "foreground",
  fontSize: "sm",
  minInlineSize: "0",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

/**
 * Workaround: top-level `css()` maps instead of `cva` so open-props does not
 * keep a residual recipe runtime in the client bundle (#471).
 *
 * @remarks
 * Same reason as `badge-variants.ts` / `button-variants.ts`: a recipe emits
 * `.raw`, `merge` and style-object `config` whether or not the app calls them.
 */
const toneClassName = {
  luxury: css({
    "--_filter-tone": "{colors.secondary}",
    "--_filter-tone-foreground": "{colors.secondary.foreground}",
  }),
  repair: css({
    "--_filter-tone": "{colors.status.repair}",
    "--_filter-tone-foreground": "{colors.status.repair.foreground}",
  }),
  rugged: css({
    "--_filter-tone": "{colors.type.rugged}",
    "--_filter-tone-foreground": "{colors.type.rugged.foreground}",
  }),
  sale: css({
    "--_filter-tone": "{colors.status.sale}",
    "--_filter-tone-foreground": "{colors.status.sale.foreground}",
  }),
  simple: css({
    "--_filter-tone": "{colors.type.simple}",
    "--_filter-tone-foreground": "{colors.type.simple.foreground}",
  }),
} as const satisfies Record<FilterTone, string>;

const FilterOption = ({
  checked,
  className,
  label,
  onChange,
  tone,
}: FilterOptionProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      onChange(event.currentTarget.checked);
    });
  };

  return (
    <label className={cx(optionBase, toneClassName[tone], "group", className)}>
      <input
        checked={checked}
        className={cx(srOnly, "peer")}
        onChange={handleChange}
        type="checkbox"
      />
      <span aria-hidden className={keyBase} data-filter-key>
        {/* biome-ignore lint/a11y/noSvgWithoutTitle: the tick is decoration; the input it draws for carries the state */}
        <svg fill="none" viewBox="0 0 12 12">
          <path d="M1.8 6.4 4.6 9.1 10.2 3.1" />
        </svg>
      </span>
      <span className={labelBase} data-filter-label>
        {label}
      </span>
    </label>
  );
};

export type { FilterTone };
export { FilterOption };
