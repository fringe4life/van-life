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
import { loginSchema } from "~/features/auth/schemas.server";
import { LOGIN_ECHO_FIELDS, LOGIN_FORM_FIELDS } from "~/features/auth/types";
import { hasAuthContext } from "~/features/middleware/contexts/has-auth";
import { hasAuthMiddleware } from "~/features/middleware/functions/has-auth-middleware";
import {
  getRedirectFromRequest,
  getSafeRedirectPath,
} from "~/features/middleware/utils/auth-redirect";
import { CustomLink } from "~/features/navigation/components/custom-link";
import { auth } from "~/lib/auth.server";
import { badRequest } from "~/utils/errors/bad-request";
import {
  schemaErrorsToFieldErrors,
  validateSchema,
} from "~/utils/errors/parse-schema.server";
import { tryCatch } from "~/utils/errors/try-catch.server";
import { cn } from "~/utils/utils";
import type { Route } from "./+types/login";

export const middleware: Route.MiddlewareFunction[] = [hasAuthMiddleware];

type LoginActionData = FormActionFailureFrom<
  typeof LOGIN_FORM_FIELDS,
  typeof LOGIN_ECHO_FIELDS
>;

export const headers = forwardDataHeaders;

export function loader({ context, request }: Route.LoaderArgs) {
  const hasAuth = context.get(hasAuthContext);
  const redirectTo = getRedirectFromRequest(request);

  if (hasAuth) {
    throw redirect(redirectTo);
  }

  return data({ redirectTo }, { headers: PRIVATE_NO_STORE_HEADERS });
}

export async function action({ request }: Route.ActionArgs) {
  const formData = Object.fromEntries(await request.formData());
  const echoValues = pickFormValues(formData, LOGIN_ECHO_FIELDS);

  const validation = validateSchema(loginSchema, formData);

  if (!validation.success) {
    return badRequest({
      fieldErrors: schemaErrorsToFieldErrors(
        validation.errors,
        LOGIN_FORM_FIELDS
      ),
      formData: echoValues,
      ok: false,
    } satisfies LoginActionData);
  }

  const { data: login, error } = await tryCatch(() =>
    auth.api.signInEmail({
      body: validation.data,
      returnHeaders: true,
    })
  );

  if (!login?.response?.token || error) {
    return badRequest({
      formData: echoValues,
      formError: "Your email or password is incorrect",
      ok: false,
    } satisfies LoginActionData);
  }

  const redirectTo = getSafeRedirectPath(formData.redirectTo);

  throw replace(redirectTo, {
    headers: login.headers,
  });
}

export default function Login({ loaderData }: Route.ComponentProps) {
  const fetcher = useFetcher<LoginActionData>();
  const [isPending, startTransition] = useTransition();

  const { data: fetcherData } = fetcher;
  const { fieldErrors, formData, formError } = readActionFormData(fetcherData, {
    defaults: { email: "" },
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
      <title>Sign In | Van Life</title>
      <meta
        content="Sign in to your Van Life account to manage your van rentals and bookings"
        name="description"
      />
      <AuthCard
        footer={
          <>
            <span>Don't have an account?</span>{" "}
            <CustomLink className="text-primary" to={href("/signup")}>
              Create one now
            </CustomLink>
          </>
        }
        title="Sign into your account"
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
            <input
              name="redirectTo"
              type="hidden"
              value={loaderData.redirectTo}
            />
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
                  placeholder="john.doe@email.com"
                  style={{ viewTransitionName: AUTH_VT.email }}
                  type="email"
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
                  defaultValue=""
                  name="password"
                  placeholder="password"
                  style={{ viewTransitionName: AUTH_VT.password }}
                  type="password"
                />
              )}
            </Field>
            <FormError message={formError} />
            <StatusButton
              status={status}
              style={{ viewTransitionName: AUTH_VT.submit }}
              type="submit"
            >
              Sign in
            </StatusButton>
          </fieldset>
        </fetcher.Form>
      </AuthCard>
    </>
  );
}
