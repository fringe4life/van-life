import { Form, Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { Route } from "./+types/login";

import { signUpScheme } from "~/types";
import { authClient } from "~/lib/auth/client";

export async function action({ request }: Route.ActionArgs) {
  const formData = Object.fromEntries(await request.formData());

  const result = signUpScheme.safeParse(formData);

  if (!result.success) {
    return result.error;
  }

  const { data, error } = await authClient.signUp.email({...result.data, callbackURL: '/'});

  if (error) {
    console.error(error.message);
    return;
  }
  console.log(data);
}

export default function Login({ actionData }: Route.ComponentProps) {
  console.log(actionData);

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
        <Input type="text" name="name" id="name" placeholder="John Doe" />
        <Input
          name="password"
          id="password"
          type="password"
          placeholder="password"
        />
        <Input
          name="confirmPassword"
          id="confirmPassword"
          type="password"
          placeholder="confirm password"
        />
        <Button variant="default" type="submit">
          Sign in
        </Button>
      </Form>
      <p>
        <span>Don't have an account?</span> <Link to="">Create one now</Link>
      </p>
    </div>
  );
}
