import { type SubmitEventHandler, useTransition } from "react";
import { href, redirect, replace, useFetcher } from "react-router";
import type { FormActionFailureFrom } from "~/components/form/form-action-result";
import { Field } from "~/components/form/field";
import { FormError } from "~/components/form/form-error";
import { getFetcherStatus } from "~/components/form/get-fetcher-status";
import { pickFormValues } from "~/components/form/pick-form-values";
import { readActionFormData } from "~/components/form/read-action-form-data";
import { useAutoIdleStatus } from "~/components/form/use-auto-idle-status";
import { StatusButton } from "~/components/status-button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { signUpScheme } from "~/features/auth/schemas.server";
import {
  SIGN_UP_ECHO_FIELDS,
  SIGN_UP_FORM_FIELDS,
} from "~/features/auth/types";
import { hasAuthContext } from "~/features/middleware/contexts/has-auth";
import { hasAuthMiddleware } from "~/features/middleware/functions/has-auth-middleware";
import { CustomLink } from "~/features/navigation/components/custom-link";
import { auth } from "~/lib/auth.server";
import { badRequest } from "~/utils/bad-request";
import {
  arkErrorsToFieldErrors,
  validateArkType,
} from "~/utils/parse-arktype.server";
import { tryCatch } from "~/utils/try-catch.server";
import { cn } from "~/utils/utils";
import type { Route } from "./+types/sign-up";

export const middleware: Route.MiddlewareFunction[] = [hasAuthMiddleware];

type SignUpActionData = FormActionFailureFrom<
  typeof SIGN_UP_FORM_FIELDS,
  typeof SIGN_UP_ECHO_FIELDS
>;

export const loader = ({ context }: Route.LoaderArgs) => {
  const session = context.get(hasAuthContext);

  if (session) {
    throw redirect(href("/host"));
  }
};

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = Object.fromEntries(await request.formData());
  const echoValues = pickFormValues(formData, SIGN_UP_ECHO_FIELDS);

  const validation = validateArkType(signUpScheme, formData);

  if (!validation.success) {
    return badRequest({
      fieldErrors: arkErrorsToFieldErrors(
        validation.errors,
        SIGN_UP_FORM_FIELDS
      ),
      formData: echoValues,
      ok: false,
    } satisfies SignUpActionData);
  }

  const { data: signUp, error } = await tryCatch(() =>
    auth.api.signUpEmail({
      body: validation.data,
      returnHeaders: true,
    })
  );

  if (!signUp?.response?.token || error) {
    return badRequest({
      formData: echoValues,
      formError: "Sign up failed please try again later",
      ok: false,
    } satisfies SignUpActionData);
  }

  throw replace("/host", {
    headers: signUp.headers,
  });
};

export default function SignUp() {
  const fetcher = useFetcher<SignUpActionData>();
  const [isPending, startTransition] = useTransition();
  const { data } = fetcher;
  const { fieldErrors, formData, formError } = readActionFormData(data, {
    defaults: { email: "", name: "" },
  });

  const status = useAutoIdleStatus(
    getFetcherStatus(fetcher.state, data, { isTransitionPending: isPending })
  );
  const isSubmitting = status === "pending";

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      await fetcher.submit(formData, { method: "POST" });
    });
  };

  return (
    <>
      <title>Sign Up | Van Life</title>
      <meta
        content="Create a Van Life account to start renting vans and managing your bookings"
        name="description"
      />
      <Card
        className="grid gap-y-4"
        style={{ viewTransitionName: "auth-card" }}
      >
        <CardHeader>
          <CardTitle style={{ viewTransitionName: "auth-title" }}>
            Create your account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <fetcher.Form
            className={cn(
              "grid items-center gap-4",
              isSubmitting && "opacity-75"
            )}
            method="POST"
            onSubmit={handleSubmit}
          >
            <fieldset
              className="grid items-center gap-4"
              disabled={isSubmitting}
            >
              <Field
                error={fieldErrors?.email}
                label="Email"
                labelProps={{
                  style: { viewTransitionName: "auth-email-label" },
                }}
              >
                {(a11y) => (
                  <Input
                    {...a11y}
                    defaultValue={formData.email}
                    name="email"
                    placeholder="your.email@email.com"
                    style={{ viewTransitionName: "auth-email" }}
                    type="email"
                  />
                )}
              </Field>
              <Field error={fieldErrors?.name} label="Name">
                {(a11y) => (
                  <Input
                    {...a11y}
                    defaultValue={formData.name}
                    name="name"
                    placeholder="John Doe"
                    type="text"
                  />
                )}
              </Field>
              <Field
                error={fieldErrors?.password}
                label="Password"
                labelProps={{
                  style: { viewTransitionName: "auth-password-label" },
                }}
              >
                {(a11y) => (
                  <Input
                    {...a11y}
                    name="password"
                    placeholder="password"
                    style={{ viewTransitionName: "auth-password" }}
                    type="password"
                  />
                )}
              </Field>
              <Field
                error={fieldErrors?.confirmPassword}
                label="Confirm password"
              >
                {(a11y) => (
                  <Input
                    {...a11y}
                    name="confirmPassword"
                    placeholder="confirm password"
                    type="password"
                  />
                )}
              </Field>
              <FormError message={formError} />
              <StatusButton
                status={status}
                style={{ viewTransitionName: "auth-submit" }}
                type="submit"
                variant="default"
              >
                Sign up
              </StatusButton>
            </fieldset>
          </fetcher.Form>
        </CardContent>
        <CardFooter>
          <p style={{ viewTransitionName: "auth-footer" }}>
            <span>Already have an account?</span>{" "}
            <CustomLink className="text-orange-400" to={href("/login")}>
              Sign in now
            </CustomLink>
          </p>
        </CardFooter>
      </Card>
    </>
  );
}
