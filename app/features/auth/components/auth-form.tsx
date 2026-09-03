import type { ReactNode, SubmitEventHandler } from "react";
import type { FetcherWithComponents } from "react-router";
import { css, cx } from "../../../../styled-system/css";
import { grid } from "../../../../styled-system/patterns";

const authFormLayoutClassName = grid({
  alignItems: "center",
  gap: "4",
});

interface AuthFormProps {
  children: ReactNode;
  Form: FetcherWithComponents<unknown>["Form"];
  isSubmitting: boolean;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
}

/** Login/signup fetcher form: grid + pending opacity + disabled fieldset. */
const AuthForm = ({
  children,
  Form,
  isSubmitting,
  onSubmit,
}: AuthFormProps) => (
  <Form
    className={cx(
      authFormLayoutClassName,
      isSubmitting && css({ opacity: 0.75 })
    )}
    method="POST"
    onSubmit={onSubmit}
  >
    <fieldset className={authFormLayoutClassName} disabled={isSubmitting}>
      {children}
    </fieldset>
  </Form>
);

export { AuthForm };
