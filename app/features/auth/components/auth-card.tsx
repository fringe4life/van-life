import type { ReactNode } from "react";
import { css, cx, viewTransition } from "styled-system/css";
import { grid } from "styled-system/patterns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { Children, Prettify } from "~/types";

/** Shared view-transition names for login ↔ signup morph. */
export const AUTH_VT = {
  card: "auth-card",
  email: "auth-email",
  emailLabel: "auth-email-label",
  footer: "auth-footer",
  password: "auth-password",
  passwordLabel: "auth-password-label",
  submit: "auth-submit",
  title: "auth-title",
} as const;

type AuthCardProps = Prettify<
  Children & {
    footer: ReactNode;
    title: string;
  }
>;

/**
 * ::view-transition-old(auth-title) {
  --fade-to: 0;
  --slide-x-to: 1rem;
  animation-name: --fade, --slide-x;
}

::view-transition-new(auth-title) {
  --fade-from: 0;
  --slide-x-from: -1rem;
  animation-name: --fade, --slide-x;
}
 */

export const AuthCard = ({ children, footer, title }: AuthCardProps) => (
  <Card
    className={grid({ rowGap: "4" })}
    style={{ viewTransitionName: AUTH_VT.card }}
  >
    <CardHeader>
      <CardTitle
        className={cx(
          viewTransition("authTitle"),
          css({ viewTransitionName: AUTH_VT.title })
        )}
      >
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
    <CardFooter>
      <p
        className={cx(
          viewTransition("authFooter"),
          css({ viewTransitionName: AUTH_VT.footer })
        )}
      >
        {footer}
      </p>
    </CardFooter>
  </Card>
);
