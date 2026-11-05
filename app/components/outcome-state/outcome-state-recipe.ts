import { css, cx } from "styled-system/css";

type OutcomeKind = "empty" | "error" | "no-match";

const outcomeStateBase = {
  actions: css({
    "@outcome-state/2xl": {
      alignItems: "end",
      gridTemplateColumns: "1fr",
      inlineSize: "auto",
    },
    "@outcome-state/md": {
      gridTemplateColumns: "1fr 1fr",
      justifyContent: "space-between",
    },
    alignItems: "center",
    display: "grid",
    gap: "3",
    inlineSize: "full",
    minInlineSize: "0",
  }),
  aside: css({
    "@outcome-state/md": {
      alignContent: "center",
      borderBlockStartWidth: "0",
      borderInlineStartColor: "border.subtle",
      borderInlineStartStyle: "solid",
      borderInlineStartWidth: "1px",
      paddingBlockStart: "0",
      paddingInlineStart: "4",
    },
    borderBlockStartColor: "border.subtle",
    borderBlockStartStyle: "solid",
    borderBlockStartWidth: "1px",
    display: "grid",
    gap: "4",
    gridArea: "aside",
    minInlineSize: "0",
    paddingBlockStart: "4",
  }),
  body: css({
    "@outcome-state/2xl": {
      columnGap: "8",
      gridTemplateAreas: '"content aside"',
      gridTemplateColumns: "minmax(0, 1fr) minmax(12rem, auto)",
    },
    "@outcome-state/md": {
      paddingBlock: "6",
      paddingInline: "6",
    },
    backgroundColor: "card",
    display: "grid",
    gap: "5",
    gridTemplateAreas: '"content" "aside"',
    minInlineSize: "0",
    paddingBlock: "5",
    paddingInline: "5",
  }),
  content: css({
    alignContent: "center",
    display: "grid",
    gap: "3",
    gridArea: "content",
    minInlineSize: "0",
  }),
  description: css({
    color: "muted.foreground",
    fontSize: "base",
    lineHeight: "7",
    maxInlineSize: "42rem",
  }),
  eyebrow: css({
    _before: {
      backgroundColor: "currentColor",
      blockSize: "1px",
      content: '""',
      display: "inline-block",
      inlineSize: "4",
    },
    alignItems: "center",
    color: "muted.foreground",
    display: "inline-flex",
    fontSize: "xs",
    fontWeight: "bold",
    gap: "2",
    letterSpacing: "0.14em",
    lineHeight: "4",
    textTransform: "uppercase",
  }),
  heading: css({
    "@outcome-state/2xl": {
      fontSize: "3xl",
      lineHeight: "9",
    },
    color: "foreground",
    fontSize: "2xl",
    fontWeight: "bold",
    letterSpacing: "-0.04em",
    lineHeight: "8",
    maxInlineSize: "28ch",
  }),
  icon: css({
    blockSize: "5",
    inlineSize: "5",
    strokeWidth: 2,
  }),
  label: css({
    fontSize: "xs",
    fontWeight: "bold",
    letterSpacing: "0.14em",
    lineHeight: "4",
    textTransform: "uppercase",
  }),
  marker: css({
    alignItems: "center",
    backgroundColor: "card",
    borderColor: "currentColor",
    borderRadius: "full",
    borderStyle: "solid",
    borderWidth: "1px",
    display: "inline-flex",
    flexShrink: "0",
    justifyContent: "center",
    minBlockSize: "9",
    minInlineSize: "9",
  }),
  metadata: css({
    color: "muted.foreground",
    display: "grid",
    fontSize: "sm",
    gap: "2",
    lineHeight: "6",
    minInlineSize: "0",
    overflowWrap: "anywhere",
  }),
  panel: css({
    _focusWithin: {
      borderColor: "border.accent",
    },
    "@outcome-state/md": {
      gridTemplateColumns: "7rem minmax(0, 1fr)",
    },
    backgroundColor: "card",
    borderColor: "border.strong",
    borderRadius: "xl",
    borderStyle: "solid",
    borderWidth: "1px",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    inlineSize: "full",
    minInlineSize: "0",
    overflow: "hidden",
    position: "relative",
    transitionDuration: "normal",
    transitionProperty: "border-color",
  }),
  primaryAction: css({
    "@outcome-state/2xl": {
      inlineSize: "auto",
    },
    inlineSize: "full",
    minBlockSize: "11",
  }),
  rail: css({
    "@outcome-state/md": {
      alignItems: "center",
      flexDirection: "column",
      gap: "4",
      justifyContent: "center",
      minBlockSize: "full",
      paddingBlock: "5",
      paddingInline: "3",
    },
    alignItems: "center",
    backgroundColor: "accent",
    color: "accent.foreground",
    display: "flex",
    flexDirection: "row",
    gap: "3",
    minBlockSize: "16",
    paddingBlock: "3",
    paddingInline: "4",
    position: "relative",
  }),
  root: css({
    containerName: "outcome-state",
    containerType: "inline-size",
    inlineSize: "full",
    minInlineSize: "0",
  }),
  seam: css({
    "@outcome-state/md": {
      borderBlockEndWidth: "0",
      borderInlineEndColor: "currentColor",
      borderInlineEndStyle: "dashed",
      borderInlineEndWidth: "2px",
      insetBlock: "4",
      insetBlockEnd: "4",
      insetInline: "auto",
      insetInlineEnd: "-1px",
    },
    borderBlockEndColor: "currentColor",
    borderBlockEndStyle: "dashed",
    borderBlockEndWidth: "2px",
    insetBlockEnd: "-1px",
    insetInline: "4",
    position: "absolute",
  }),
  secondaryAction: css({
    color: "foreground",
    justifySelf: "start",
    paddingInline: "1",
  }),
} as const;

/**
 * Workaround: top-level `css()` slot maps instead of `sva` so open
 * `outcomeStateRecipe({ kind })` does not pull the full recipe runtime into
 * the client bundle (#471 / #269).
 *
 * @remarks
 * Still required on `@pandacss/vite@2.4.0` / `@pandacss/dev@2.4.0`.
 * Drop when Panda emits string-only residual recipes; re-verify no `cva-*.js`
 * / `sva` residual and no `panda_call_unextractable` after clean
 * `styled-system` + `build`.
 *
 * @see https://github.com/fringe4life/van-life/issues/471 — tracking
 */
const outcomeStateByKind = {
  empty: {
    eyebrow: css({ color: "muted.foreground" }),
    primaryAction: undefined,
    rail: css({
      backgroundColor: "surface.muted",
      color: "foreground",
    }),
  },
  error: {
    eyebrow: css({ color: "destructive" }),
    primaryAction: css({
      _hover: {
        backgroundColor: "destructive/90",
      },
      backgroundColor: "destructive",
      color: "destructive.foreground",
    }),
    rail: css({
      backgroundColor: "destructive",
      color: "destructive.foreground",
    }),
  },
  "no-match": {
    eyebrow: css({ color: "primary" }),
    primaryAction: undefined,
    rail: css({
      backgroundColor: "accent",
      color: "accent.foreground",
    }),
  },
} as const satisfies Record<
  OutcomeKind,
  {
    eyebrow: string;
    primaryAction: string | undefined;
    rail: string;
  }
>;

function outcomeStateRecipe({ kind }: { kind: OutcomeKind }) {
  const kindStyles = outcomeStateByKind[kind];

  return {
    actions: outcomeStateBase.actions,
    aside: outcomeStateBase.aside,
    body: outcomeStateBase.body,
    content: outcomeStateBase.content,
    description: outcomeStateBase.description,
    eyebrow: cx(outcomeStateBase.eyebrow, kindStyles.eyebrow),
    heading: outcomeStateBase.heading,
    icon: outcomeStateBase.icon,
    label: outcomeStateBase.label,
    marker: outcomeStateBase.marker,
    metadata: outcomeStateBase.metadata,
    panel: outcomeStateBase.panel,
    primaryAction: cx(outcomeStateBase.primaryAction, kindStyles.primaryAction),
    rail: cx(outcomeStateBase.rail, kindStyles.rail),
    root: outcomeStateBase.root,
    seam: outcomeStateBase.seam,
    secondaryAction: outcomeStateBase.secondaryAction,
  };
}

export { outcomeStateRecipe };
