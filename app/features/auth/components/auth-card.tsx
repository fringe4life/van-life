import { type ReactNode, ViewTransition } from "react";
import { viewTransition } from "styled-system/css";
import { grid } from "styled-system/patterns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { viewTransitionShare } from "~/components/view-transition-share";
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

const authTitleTransition = viewTransition("authTitle");
const authFooterTransition = viewTransition("authFooter");

type AuthCardProps = Prettify<
  Children & {
    footer: ReactNode;
    title: string;
  }
>;

export const AuthCard = ({ children, footer, title }: AuthCardProps) => (
  <ViewTransition {...viewTransitionShare} name={AUTH_VT.card}>
    <Card className={grid({ rowGap: "4" })}>
      <CardHeader>
        <ViewTransition
          default="none"
          name={AUTH_VT.title}
          share={authTitleTransition}
        >
          <CardTitle>{title}</CardTitle>
        </ViewTransition>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <ViewTransition
          default="none"
          name={AUTH_VT.footer}
          share={authFooterTransition}
        >
          <p>{footer}</p>
        </ViewTransition>
      </CardFooter>
    </Card>
  </ViewTransition>
);
