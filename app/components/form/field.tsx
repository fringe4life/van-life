import {
  type ComponentProps,
  type ReactNode,
  useId,
  ViewTransition,
} from "react";
import type { ViewTransitionTune } from "~/components/types";
import { Label } from "~/components/ui/label";
import type { Id, Message, Prettify } from "~/types";
import { cn } from "~/utils/utils";

type FieldA11y = Prettify<
  {
    "aria-describedby"?: string;
    "aria-invalid"?: boolean;
  } & Id
>;

type FieldErrorProps = Prettify<
  {
    errorTransition?: ViewTransitionTune;
  } & Partial<Message> &
    Id
>;

const FieldError = ({ errorTransition, id, message }: FieldErrorProps) => (
  <ViewTransition {...errorTransition}>
    {message ? (
      <p className="font-medium text-red-500 text-sm" id={id}>
        {message}
      </p>
    ) : null}
  </ViewTransition>
);

interface FieldProps {
  children: (a11y: FieldA11y) => ReactNode;
  className?: string;
  error?: string;
  errorTransition?: ViewTransitionTune;
  label: ReactNode;
  labelProps?: ComponentProps<typeof Label>;
}

const Field = ({
  children,
  className,
  error,
  errorTransition,
  label,
  labelProps,
}: FieldProps) => {
  const id = useId();
  const errorId = `${id}-error`;
  const a11y: FieldA11y = {
    "aria-describedby": error ? errorId : undefined,
    "aria-invalid": error ? true : undefined,
    id,
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id} {...labelProps}>
        {label}
      </Label>
      {children(a11y)}
      <FieldError
        errorTransition={errorTransition}
        id={errorId}
        message={error}
      />
    </div>
  );
};

export { Field };
