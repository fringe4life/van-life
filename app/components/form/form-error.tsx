import { useId, ViewTransition } from "react";
import type { ViewTransitionTune } from "~/components/types";
import type { Id, Message, Prettify } from "~/types";

import { css, cx } from "../../../styled-system/css";

type FormErrorProps = Prettify<
  {
    className?: string;
    errorTransition?: ViewTransitionTune;
  } & Partial<Message> &
    Partial<Id>
>;

const FormError = ({
  className,
  errorTransition,
  id: idProp,
  message,
}: FormErrorProps) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  return (
    <ViewTransition {...errorTransition}>
      {message ? (
        <p
          className={cx(
            css({ color: "destructive", fontSize: "sm" }),
            className
          )}
          id={id}
          role="alert"
        >
          {message}
        </p>
      ) : null}
    </ViewTransition>
  );
};

export { FormError };
