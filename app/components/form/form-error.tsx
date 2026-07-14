import { useId, ViewTransition } from "react";
import type { ViewTransitionTune } from "~/components/types";
import type { Id, Message, Prettify } from "~/types";
import { cn } from "~/utils/utils";

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
          className={cn("font-medium text-red-500 text-sm", className)}
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
