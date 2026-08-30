import { type SubmitEventHandler, useTransition } from "react";
import { data, href, redirect, replace, useFetcher } from "react-router";
import { Field } from "~/components/form/field";
import type { FormActionFailureFrom } from "~/components/form/form-action-result";
import { FormError } from "~/components/form/form-error";
import { getFetcherStatus } from "~/components/form/get-fetcher-status";
import { pickFormValues } from "~/components/form/pick-form-values";
import { readActionFormData } from "~/components/form/read-action-form-data";
import { useAutoIdleStatus } from "~/components/form/use-auto-idle-status";
import { StatusButton } from "~/components/status-button";
import { Input } from "~/components/ui/input";
import {
  forwardDataHeaders,
  PRIVATE_NO_STORE_HEADERS,
} from "~/constants/cache-headers";
import { AUTH_VT, AuthCard } from "~/features/auth/components/auth-card";
import { signUpScheme } from "~/features/auth/schemas.server";
import {
  SIGN_UP_ECHO_FIELDS,
  SIGN_UP_FORM_FIELDS,
} from "~/features/auth/types";
import { hasAuthContext } from "~/features/middleware/contexts/has-auth";
import { hasAuthMiddleware } from "~/features/middleware/functions/has-auth-middleware";
import { CustomLink } from "~/features/navigation/components/custom-link";
import { auth } from "~/lib/auth.server";
import { badRequest } from "~/utils/errors/bad-request";
import {
  schemaErrorsToFieldErrors,
  validateSchema,
} from "~/utils/errors/parse-schema.server";
import { tryCatch } from "~/utils/errors/try-catch.server";
import { cn } from "~/utils/utils";
import type { Route } from "./+types/sign-up";

export const middleware: Route.MiddlewareFunction[] = [hasAuthMiddleware];

type SignUpActionData = FormActionFailureFrom<
  typeof SIGN_UP_FORM_FIELDS,
  typeof SIGN_UP_ECHO_FIELDS
>;

export const headers = forwardDataHeaders;

export const loader = ({ context }: Route.LoaderArgs) => {
  const session = context.get(hasAuthContext);

  if (session) {
    throw redirect(href("/host"));
  }

  return data(null, { headers: PRIVATE_NO_STORE_HEADERS });
};

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = Object.fromEntries(await request.formData());
  const echoValues = pickFormValues(formData, SIGN_UP_ECHO_FIELDS);

  const validation = validateSchema(signUpScheme, formData);

  if (!validation.success) {
    return badRequest({
      fieldErrors: schemaErrorsToFieldErrors(
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
  const { data: fetcherData } = fetcher;
  const { fieldErrors, formData, formError } = readActionFormData(fetcherData, {
    defaults: { email: "", name: "" },
  });

  const status = useAutoIdleStatus(
    getFetcherStatus(fetcher.state, fetcherData, {
      isTransitionPending: isPending,
    })
  );
  const isSubmitting = status === "pending";

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const fieldValues = new FormData(event.currentTarget);
    startTransition(async () => {
      await fetcher.submit(fieldValues, { method: "POST" });
    });
  };

  return (
    <>
      <title>Sign Up | Van Life</title>
      <meta
        content="Create a Van Life account to start renting vans and managing your bookings"
        name="description"
      />
      <AuthCard
        footer={
          <>
            <span>Already have an account?</span>{" "}
            <CustomLink className="text-primary" to={href("/login")}>
              Sign in now
            </CustomLink>
          </>
        }
        title="Create your account"
      >
        <fetcher.Form
          className={cn(
            "grid items-center gap-4",
            isSubmitting && "opacity-75"
          )}
          method="POST"
          onSubmit={handleSubmit}
        >
          <fieldset className="grid items-center gap-4" disabled={isSubmitting}>
            <Field
              error={fieldErrors?.email}
              label="Email"
              labelProps={{
                style: { viewTransitionName: AUTH_VT.emailLabel },
              }}
            >
              {(a11y) => (
                <Input
                  {...a11y}
                  defaultValue={formData.email}
                  name="email"
                  placeholder="your.email@email.com"
                  style={{ viewTransitionName: AUTH_VT.email }}
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
                style: { viewTransitionName: AUTH_VT.passwordLabel },
              }}
            >
              {(a11y) => (
                <Input
                  {...a11y}
                  name="password"
                  placeholder="password"
                  style={{ viewTransitionName: AUTH_VT.password }}
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
              style={{ viewTransitionName: AUTH_VT.submit }}
              type="submit"
              variant="default"
            >
              Sign up
            </StatusButton>
          </fieldset>
        </fetcher.Form>
      </AuthCard>
    </>
  );
}
