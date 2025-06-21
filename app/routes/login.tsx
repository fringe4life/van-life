import { Form, Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { Route } from "./+types/login";

import { loginSchema } from "~/types";
import { authClient } from "~/lib/auth/client";

export async function action({ request }: Route.ActionArgs) {
  const formData = Object.fromEntries(await request.formData());

  const result = loginSchema.safeParse(formData);

  if (!result.success) {
    return result.error;
  }

  const { data, error } = await authClient.signIn.email(result.data);

  if (error) {
    console.error(error.message);
    return;
  }
  console.log(data);
}

export default function Login({ actionData }: Route.ComponentProps) {
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
        />
        <Input
          name="password"
          id="password"
          type="password"
          placeholder="password"
        />
        <Button variant="default" type="submit">
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
