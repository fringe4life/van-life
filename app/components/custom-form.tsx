import type React from "react";
import { Form } from "react-router";
import useIsNavigating from "~/hooks/use-is-navigating";
import { css, cx } from "../../styled-system/css";

const CustomForm = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Form>) => {
  const { usingForm } = useIsNavigating();
  return (
    <Form
      className={cx(className, !!usingForm && css({ opacity: 0.75 }))}
      {...props}
    >
      <fieldset className={className} disabled={usingForm}>
        {children}
      </fieldset>
    </Form>
  );
};

export { CustomForm };
