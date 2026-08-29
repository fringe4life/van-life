import type { ReactNode } from "react";
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

export const AuthCard = ({ children, footer, title }: AuthCardProps) => (
  <Card className="grid gap-y-4" style={{ viewTransitionName: AUTH_VT.card }}>
    <CardHeader>
      <CardTitle style={{ viewTransitionName: AUTH_VT.title }}>
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
    <CardFooter>
      <p style={{ viewTransitionName: AUTH_VT.footer }}>{footer}</p>
    </CardFooter>
  </Card>
);
