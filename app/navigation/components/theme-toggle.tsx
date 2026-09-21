import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import type { ChangeEventHandler } from "react";
import { addTransitionType, startTransition } from "react";
import { href, useFetcher, useRouteLoaderData } from "react-router";
import { css, cx } from "styled-system/css";
import { hstack, visuallyHidden } from "styled-system/patterns";
import { Popover } from "~/components/ui/popover";
import { closeClosestPopover } from "~/components/ui/popover/utils";
import { isThemeChoice, THEME_CHOICES, type ThemeChoice } from "~/theme/schema";
import { THEME_TRANSITION_TYPE, useThemeChange } from "~/theme/theme";
import type { Route as RootRoute } from "../../+types/root";

const THEME_FETCHER_KEY = "theme";

const THEME_TOGGLE_INSTANCES = {
  "mobile-nav": {
    popoverClassName: css({
      positionAnchor: "--mobile-nav-theme-toggle-trigger",
    }),
    popoverId: "mobile-nav-theme-toggle-popover",
    triggerClassName: css({
      anchorName: "--mobile-nav-theme-toggle-trigger",
    }),
  },
  nav: {
    popoverClassName: css({ positionAnchor: "--theme-toggle-trigger" }),
    popoverId: "theme-toggle-popover",
    triggerClassName: css({ anchorName: "--theme-toggle-trigger" }),
  },
} as const;

type ThemeToggleInstance = keyof typeof THEME_TOGGLE_INSTANCES;

const THEME_ICONS = {
  dark: MoonIcon,
  light: SunIcon,
  system: MonitorIcon,
} as const;

const THEME_LABELS = {
  dark: "Dark",
  light: "Light",
  system: "System",
} as const satisfies Record<ThemeChoice, string>;

const themeToggleGroupClassName = hstack({
  borderColor: "border",
  borderRadius: "md",
  borderStyle: "solid",
  borderWidth: "1px",
  display: { base: "none", xl: "inline-flex" },
  gap: "0",
  margin: "0",
  minInlineSize: "0",
  overflow: "hidden",
  padding: "0",
});

const themeToggleOptionClassName = css({
  _focusWithin: {
    outlineColor: "ring",
    outlineOffset: "-3px",
    outlineStyle: "solid",
    outlineWidth: "3px",
    zIndex: 1,
  },
  _hover: {
    backgroundColor: "surface.muted",
  },
  "&:has(:checked)": {
    backgroundColor: "accent",
    color: "accent.foreground",
  },
  alignItems: "center",
  backgroundColor: "transparent",
  blockSize: "var(--nav-control-size)",
  color: "foreground",
  cursor: "pointer",
  display: "inline-flex",
  flexShrink: "0",
  inlineSize: "var(--nav-control-size)",
  justifyContent: "center",
  minBlockSize: "var(--nav-control-size)",
  minInlineSize: "var(--nav-control-size)",
  padding: "0",
  transitionDuration: "normal",
  transitionProperty: "colors",
});

const themeToggleCompactClassName = css({
  alignItems: "center",
  display: "inline-flex",
  minInlineSize: "0",
});

const themeToggleNavCompactClassName = css({
  display: { base: "inline-flex", xl: "none" },
});

const themeToggleButtonClassName = css({
  _focusVisible: {
    outlineColor: "ring",
    outlineOffset: "3px",
    outlineStyle: "solid",
    outlineWidth: "3px",
  },
  _hover: {
    backgroundColor: "surface.muted",
  },
  alignItems: "center",
  backgroundColor: "transparent",
  borderRadius: "md",
  color: "foreground",
  cursor: "pointer",
  display: "inline-flex",
  flexShrink: "0",
  justifyContent: "center",
  minBlockSize: "var(--nav-control-size)",
  minInlineSize: "var(--nav-control-size)",
  padding: "0",
  transitionDuration: "normal",
  transitionProperty: "colors",
});

const themeTogglePopoverClassName = css({
  borderRadius: "md",
  inlineSize: "min(15rem, calc(100vw - 1.5rem))",
  insetBlockStart: "anchor(bottom)",
  insetInlineEnd: "anchor(right)",
  margin: "0",
  marginBlockStart: "2",
  marginInlineStart: "auto",
  maxInlineSize: "calc(100vw - 1.5rem)",
  padding: "1",
  position: "absolute",
  zIndex: "10",
});

const themeTogglePopoverOptionsClassName = css({
  display: "grid",
  gap: "1",
  margin: "0",
  minInlineSize: "0",
  padding: "0",
});

const themeTogglePopoverOptionClassName = css({
  _focusWithin: {
    outlineColor: "ring",
    outlineOffset: "-3px",
    outlineStyle: "solid",
    outlineWidth: "3px",
    zIndex: 1,
  },
  _hover: {
    backgroundColor: "surface.muted",
  },
  "&:has(:checked)": {
    backgroundColor: "accent",
    color: "accent.foreground",
  },
  alignItems: "center",
  borderRadius: "sm",
  color: "foreground",
  cursor: "pointer",
  display: "flex",
  gap: "3",
  minBlockSize: "var(--nav-control-size)",
  minInlineSize: "0",
  paddingInline: "3",
  transitionDuration: "normal",
  transitionProperty: "colors",
  whiteSpace: "nowrap",
});

const themeIconClassName = css({
  aspectRatio: "square",
  flexShrink: "0",
  inlineSize: "4",
});

const legendClassName = visuallyHidden();
const radioClassName = visuallyHidden();

const readRootTheme = (
  loaderData: RootRoute.ComponentProps["loaderData"] | undefined
): ThemeChoice => loaderData?.theme ?? "system";

interface ThemeOptionProps {
  choice: ThemeChoice;
  compact?: boolean;
  name?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  theme: ThemeChoice;
}

const ThemeOption = ({
  choice,
  compact = false,
  name = "theme",
  onChange,
  theme,
}: ThemeOptionProps) => {
  const Icon = THEME_ICONS[choice];

  return (
    <label
      className={
        compact ? themeTogglePopoverOptionClassName : themeToggleOptionClassName
      }
      key={choice}
    >
      <input
        aria-label={THEME_LABELS[choice]}
        checked={theme === choice}
        className={radioClassName}
        name={name}
        onChange={onChange}
        // Chromium inlines caret-color on clipped radios before hydrate.
        // Client VDOM has no style; React will not patch it. One-level hatch.
        suppressHydrationWarning
        type="radio"
        value={choice}
      />
      <Icon aria-hidden="true" className={themeIconClassName} />
      {compact ? <span>{THEME_LABELS[choice]}</span> : null}
    </label>
  );
};

interface ThemeToggleProps {
  instance?: ThemeToggleInstance;
}

const ThemeToggle = ({ instance = "nav" }: ThemeToggleProps) => {
  const { popoverClassName, popoverId, triggerClassName } =
    THEME_TOGGLE_INSTANCES[instance];
  const fetcher = useFetcher({ key: THEME_FETCHER_KEY });
  const loaderData = useRouteLoaderData("root") as
    | RootRoute.ComponentProps["loaderData"]
    | undefined;
  const pendingTheme = fetcher.formData?.get("theme");
  const theme = isThemeChoice(pendingTheme)
    ? pendingTheme
    : readRootTheme(loaderData);
  const requestThemeChange = useThemeChange();

  const onThemeChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const next = event.currentTarget.value;
    if (!isThemeChoice(next)) {
      return;
    }

    const radio = event.currentTarget;
    startTransition(async () => {
      addTransitionType(THEME_TRANSITION_TYPE);
      requestThemeChange(next);
      await fetcher.submit(
        { theme: next },
        {
          action: href("/theme"),
          method: "post",
          preventScrollReset: true,
        }
      );
      closeClosestPopover(radio);
    });
  };

  const ActiveThemeIcon = THEME_ICONS[theme];

  return (
    <fetcher.Form action={href("/theme")} method="post" preventScrollReset>
      {instance === "nav" ? (
        <fieldset className={themeToggleGroupClassName}>
          <legend className={legendClassName}>Color theme</legend>
          {THEME_CHOICES.map((choice) => (
            <ThemeOption
              choice={choice}
              key={choice}
              onChange={onThemeChange}
              theme={theme}
            />
          ))}
        </fieldset>
      ) : null}

      <div
        className={cx(
          themeToggleCompactClassName,
          instance === "nav" ? themeToggleNavCompactClassName : undefined
        )}
      >
        <button
          aria-controls={popoverId}
          aria-label={`Color theme: ${THEME_LABELS[theme]}`}
          className={cx(themeToggleButtonClassName, triggerClassName)}
          popoverTarget={popoverId}
          popoverTargetAction="toggle"
          type="button"
        >
          <ActiveThemeIcon aria-hidden="true" className={themeIconClassName} />
        </button>
        <Popover
          className={cx(themeTogglePopoverClassName, popoverClassName)}
          id={popoverId}
          popover="auto"
        >
          <fieldset className={themeTogglePopoverOptionsClassName}>
            <legend className={legendClassName}>Color theme</legend>
            {THEME_CHOICES.map((choice) => (
              <ThemeOption
                choice={choice}
                compact
                key={choice}
                name={`theme-${instance}`}
                onChange={onThemeChange}
                theme={theme}
              />
            ))}
          </fieldset>
        </Popover>
      </div>
    </fetcher.Form>
  );
};

export { ThemeToggle };
