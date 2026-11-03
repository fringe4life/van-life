import { defineKeyframes } from "@pandacss/dev/define";

export const keyframes = defineKeyframes({
  "fade-in": {
    from: {
      filter: "blur(2px)",
      opacity: "0",
    },
    to: {
      filter: "blur(0px)",
      opacity: "1",
    },
  },
  "fade-out": {
    from: {
      filter: "blur(2px)",
      opacity: "1",
    },
    to: {
      filter: "blur(0px)",
      opacity: "0",
    },
  },
  "icon-arrow-in": {
    "0%": { translate: "0 0" },
    "45%": { translate: "1.8px 0" },
    "100%": { translate: "0 0" },
  },
  "icon-arrow-out": {
    "0%": { translate: "0 0" },
    "45%": { translate: "2.6px 0" },
    "100%": { translate: "0 0" },
  },
  "icon-barb-ccw": {
    "0%": { rotate: "0deg" },
    "45%": { rotate: "-16deg" },
    "100%": { rotate: "0deg" },
  },
  "icon-barb-cw": {
    "0%": { rotate: "0deg" },
    "45%": { rotate: "16deg" },
    "100%": { rotate: "0deg" },
  },
  "icon-broaden": {
    "0%": { scale: "0.93 1" },
    "45%": { scale: "1.07 1" },
    "100%": { scale: "1 1" },
  },
  /*
   * A coin falling into an opened wallet: hidden above, visible on the way
   * down, squashed flat on landing, then back to round. Origin is the bottom
   * of the coin, so it lands on the wallet rather than sinking into it.
   */
  "icon-coin-drop": {
    "0%": { opacity: "0", scale: "1 1", translate: "0 -6.4px" },
    "22%": { opacity: "1" },
    "64%": { scale: "1.3 0.7", translate: "0 0" },
    "82%": { scale: "0.92 1.12" },
    "100%": { opacity: "1", scale: "1 1", translate: "0 0" },
  },
  /* A dash travelling one full lap of its path, for highlights on a bit. */
  "icon-dash-run": {
    from: { strokeDashoffset: "0" },
    to: { strokeDashoffset: "-100" },
  },
  "icon-drop": {
    "0%": { opacity: "0.3", translate: "0 -2.6px" },
    "55%": { opacity: "1", translate: "0 0.4px" },
    "100%": { opacity: "1", translate: "0 0" },
  },
  /*
   * Two arrows trading places, one keyframe per direction: each travels the
   * way its own head points. Literal distances, no custom property — Panda
   * extracts values statically, so a variable would never reach the class.
   */
  "icon-exchange-left": {
    "0%": { translate: "0 0" },
    "50%": { translate: "-1.6px 0" },
    "100%": { translate: "0 0" },
  },
  "icon-exchange-right": {
    "0%": { translate: "0 0" },
    "50%": { translate: "1.6px 0" },
    "100%": { translate: "0 0" },
  },
  /* A hinged panel lifting at its left edge. */
  "icon-flap-lift": {
    from: { rotate: "0deg", translate: "0 0" },
    to: { rotate: "-7deg", translate: "0 -0.4px" },
  },
  "icon-flicker": {
    "0%": { opacity: "1" },
    "40%": { opacity: "0.45" },
    "100%": { opacity: "1" },
  },
  /*
   * A light sweep across a filled shape. The glyph clips this line to its own
   * outline, so the sweep is confined to the star body; most of the cycle is
   * dark so the 6s loop reads as an occasional glint, not a scanner.
   */
  "icon-glint": {
    "0%": { opacity: "0", translate: "-6px 6px" },
    "12%": { opacity: "0.9" },
    "70%": { opacity: "0.9" },
    "86%": { opacity: "0", translate: "6px -6px" },
    "100%": { opacity: "0", translate: "6px -6px" },
  },
  "icon-glow": {
    "0%": { filter: "drop-shadow(0 0 0 transparent)" },
    "45%": { filter: "drop-shadow(0 0 1.6px currentColor)" },
    "100%": { filter: "drop-shadow(0 0 0 transparent)" },
  },
  "icon-grow": {
    from: { scale: "1 0.58" },
    to: { scale: "1 1" },
  },
  "icon-lift": {
    "0%": { translate: "0 0" },
    "45%": { translate: "0 -1.2px" },
    "100%": { translate: "0 0" },
  },
  "icon-overshoot": {
    "0%": { scale: "1" },
    "45%": { scale: "1.08" },
    "100%": { scale: "1" },
  },
  "icon-ping": {
    from: { opacity: "0.5", scale: "0.72" },
    to: { opacity: "0", scale: "1.18" },
  },
  /*
   * A plus dropping into its plate: it arrives from above, overshoots, and
   * holds slightly enlarged. Held via `animation-fill-mode: forwards`, because
   * the state is "added", not "bounced".
   */
  "icon-plus-add": {
    "0%": { opacity: "0.35", scale: "0.78", translate: "0 -3.4px" },
    "55%": { opacity: "1", scale: "1.18", translate: "0 0" },
    "100%": { opacity: "1", scale: "1.14", translate: "0 0" },
  },
  "icon-pulse": {
    "0%": { scale: "1" },
    "45%": { scale: "1.14" },
    "100%": { scale: "1" },
  },
  /* A key turning in a lock. Held at the end of the beat, not returned. */
  "icon-quarter-turn": {
    from: { rotate: "0deg" },
    to: { rotate: "90deg" },
  },
  "icon-shine": {
    "0%": { rotate: "0deg", scale: "1" },
    "45%": { rotate: "12deg", scale: "1.18" },
    "100%": { rotate: "0deg", scale: "1" },
  },
  /* A body settling onto its suspension. */
  "icon-sink": {
    "0%": { translate: "0 0" },
    "45%": { translate: "0 0.8px" },
    "100%": { translate: "0 0" },
  },
  /* A four-point sparkle appearing and leaving; never held. */
  "icon-sparkle": {
    "0%": { opacity: "0", scale: "0.4" },
    "32%": { opacity: "1", scale: "1" },
    "100%": { opacity: "0", scale: "0.7" },
  },
  /*
   * Icon motion. One keyframe per mechanic: a glyph composes several of these
   * so each part can carry its own easing (see docs/icon-packs.md).
   */
  "icon-spin": {
    from: { rotate: "0deg" },
    to: { rotate: "360deg" },
  },
  /* Sheet and rubber giving, then rebounding. Shared by the squishy glyphs. */
  "icon-squish": {
    "0%": { scale: "1 1" },
    "38%": { scale: "1.04 0.93" },
    "100%": { scale: "1 1" },
  },
  /*
   * A panel dropped into its slot. The fall is what makes it perceptible at
   * 20px: a 14% scale alone disappears, a 1.6px drop does not.
   */
  "icon-tile-in": {
    "0%": { opacity: "0.35", scale: "0.86", translate: "0 -1.6px" },
    "62%": { opacity: "1", scale: "1.03", translate: "0 0" },
    "100%": { opacity: "1", scale: "1", translate: "0 0" },
  },
  "icon-wax": {
    "0%": { translate: "0 0" },
    "45%": { translate: "-1.3px 0" },
    "100%": { translate: "0 0" },
  },
  /*
   * A pager speed line (#432 / #433): it stretches out of the arrow's tail,
   * holds while it thins, then leaves. Three of them fire 30ms apart, which is
   * what turns three dashes into one burst; they loop because the pulse is held
   * for a minimum time and stays up while the next slice is still loading.
   * Longer than the van's rays on purpose — the pager is answering a press, not
   * idling on a route.
   */
  "page-streak": {
    "0%": { opacity: "0", scale: "1 0.15", translate: "0 2.8px" },
    "10%": { opacity: "1" },
    "46%": { opacity: "0.9", scale: "1 1", translate: "0 0" },
    "76%": { opacity: "0.4", scale: "1 1", translate: "0 -1.7px" },
    "100%": { opacity: "0", scale: "1 1", translate: "0 -2.5px" },
  },
  scale: {
    from: {
      scale: "var(--scale-from, 0)",
    },
    to: {
      scale: "var(--scale-to, 1)",
    },
  },
  shimmer: {
    from: {
      backgroundPosition: "-200% 0",
    },
    to: {
      backgroundPosition: "200% 0",
    },
  },
  "slide-in": {
    from: {
      translate: "var(--slide-distance)",
    },
    to: {
      translate: "0 0",
    },
  },
  "slide-in-y": {
    from: {
      translate: "0 var(--slide-distance-y)",
    },
    to: {
      translate: "0 0",
    },
  },
  "slide-out": {
    from: {
      translate: "0 0",
    },
    to: {
      translate: "var(--slide-distance)",
    },
  },
  "slide-out-y": {
    from: {
      translate: "0 0",
    },
    to: {
      translate: "0 var(--slide-distance-y)",
    },
  },
  /* One 2px shake, then still: an error that keeps shaking reads as broken. */
  "status-cross-shake": {
    "0%": { translate: "0 0" },
    "18%": { translate: "-2px 0" },
    "38%": { translate: "2px 0" },
    "58%": { translate: "-1.2px 0" },
    "78%": { translate: "0.6px 0" },
    "100%": { translate: "0 0" },
  },
  /*
   * Status button answers (#429 – #431). The check draws on from nothing and
   * holds; each stroke of the cross does the same, 20ms behind its partner.
   * A stroke with no dash offset is a finished stroke, which is why the glyphs
   * rest complete and reduced motion only has to drop the animation.
   */
  "status-stroke-in": {
    from: { strokeDashoffset: "1" },
    to: { strokeDashoffset: "0" },
  },
  "van-beam-breathe": {
    "0%": { opacity: "0.46" },
    "50%": { opacity: "0.7" },
    "100%": { opacity: "0.46" },
  },
  "van-beam-in": {
    from: { opacity: "0", scale: "0.3 1" },
    to: { opacity: "0.6", scale: "1 1" },
  },
  "van-idle": {
    "0%": { translate: "0 0" },
    "50%": { translate: "0 -0.45px" },
    "100%": { translate: "0 0" },
  },
  "van-ray-drift": {
    "0%": { opacity: "0.95", translate: "0.8px 0" },
    "65%": { opacity: "0.45" },
    "100%": { opacity: "0", translate: "-3.4px 0" },
  },
  "van-ray-out": {
    from: { opacity: "0", translate: "1.8px 0" },
    to: { opacity: "1", translate: "-1.4px 0" },
  },
  "van-squish": {
    "0%": { scale: "1 1" },
    "38%": { scale: "1.02 0.94" },
    "100%": { scale: "1 1" },
  },
});
