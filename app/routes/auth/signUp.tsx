import { Form, Link, replace } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { Route } from "./+types/signUp";

import { signUpScheme } from "~/types";
import { auth } from "~/lib/auth/auth";

export async function action({ request }: Route.ActionArgs) {
  const formData = Object.fromEntries(await request.formData());

  const result = signUpScheme.safeParse(formData);

  if (!result.success) {
    return result.error;
  }

  const signUp = await auth.api.signUpEmail({
    body: result.data,
    asResponse: true,
  });
  throw replace("/host", {
    headers: signUp.headers,
  });
}

export default function SignUp({ actionData }: Route.ComponentProps) {
  console.log(actionData);

  return (
    <div className="grid gap-12 sm:justify-center justify-start items-center">
      <h2 className="font-bold text-3xl justify-center text-shadow-text">
        Create your account
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
          Sign up
        </Button>
      </Form>
      <p>
        <span>Already have an account?</span>{" "}
        <Link to="/login" className="text-orange-400">
          Sign in now
        </Link>
      </p>
    </div>
  );
}
