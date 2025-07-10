import { Form, Link, redirect, replace } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { auth } from "~/lib/auth/auth";
import { loginSchema } from "~/types";
import type { Route } from "./+types/login";
import useIsNavigating from "~/hooks/useIsNavigating";
import { z } from "zod/v4";

export async function loader({ request }: Route.LoaderArgs) {
  const result = await auth.api.getSession({ headers: request.headers });
  if (result?.session) {
    throw redirect("/host");
  }
}

export async function action({ request }: Route.ActionArgs) {
  const formData = Object.fromEntries(await request.formData());

  const result = loginSchema.safeParse(formData);

  if (!result.success) {
    return {
      errors: z.prettifyError(result.error),
      email: (formData["email"] as string) ?? "",
    };
  }

  const response = await auth.api.signInEmail({
    body: result.data,
    asResponse: true,
  });

  if (!response.ok) {
    return {
      errors: "Your email or password is incorrect",
      email: (formData["email"] as string) ?? "",
    };
  }

  throw replace("/host", {
    headers: response.headers,
  });
}

export default function Login({ actionData }: Route.ComponentProps) {
  const { usingForm } = useIsNavigating();
  return (
    <div className="grid gap-12 sm:justify-center justify-start items-center">
      <h2 className="font-bold text-3xl justify-center text-shadow-text">
        Sign into your account
      </h2>
      <Form method="POST" className="grid gap-4">
        <Input
          name="email"
          id="email"
          type="email"
          placeholder="your.email@email.com"
          disabled={usingForm}
          defaultValue={actionData?.email ?? ""}
        />
        <Input
          name="password"
          id="password"
          type="password"
          placeholder="password"
          disabled={usingForm}
          defaultValue=""
        />
        {actionData?.errors ? <p>{actionData.errors}</p> : null}
        <Button  type="submit" disabled={usingForm}>
          Sign in
        </Button>
      </Form>
      <p>
        <span>Don't have an account?</span>{" "}
        <Link to="/signup" className="text-orange-400">
          Create one now
        </Link>
      </p>
    </div>
  );
}
