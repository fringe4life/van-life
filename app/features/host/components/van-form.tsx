import { type SubmitEventHandler, useId } from "react";
import { Form } from "react-router";
import { Field } from "~/components/form/field";
import { FormError } from "~/components/form/form-error";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import type { VanFormFieldErrors, VanFormValues } from "~/features/vans/types";
import { cn } from "~/utils/utils";

export interface VanFormProps {
  fieldErrors?: VanFormFieldErrors;
  formDataDefaults?: VanFormValues;
  formError?: string;
  isPending: boolean;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
}

const VanForm = ({
  onSubmit,
  isPending,
  formDataDefaults,
  fieldErrors,
  formError,
}: VanFormProps) => {
  const formErrorId = useId();

  return (
    <div className="@container/form">
      <Form
        aria-describedby={formError ? formErrorId : undefined}
        className={cn(
          "mt-6 grid gap-x-6 gap-y-4",
          "@min-xl/form:max-w-4xl @min-xl/form:grid-cols-2"
        )}
        method="POST"
        onSubmit={onSubmit}
      >
        <Field error={fieldErrors?.name} label="Name">
          {(a11y) => (
            <Input
              {...a11y}
              defaultValue={formDataDefaults?.name ?? ""}
              name="name"
              placeholder="Silver Bullet"
              type="text"
            />
          )}
        </Field>
        <Field error={fieldErrors?.price} label="Price ($/day)">
          {(a11y) => (
            <Input
              {...a11y}
              defaultValue={formDataDefaults?.price ?? ""}
              name="price"
              placeholder="100"
              type="number"
            />
          )}
        </Field>
        <Field
          className="@min-xl/form:col-span-2"
          error={fieldErrors?.description}
          label="Description"
        >
          {(a11y) => (
            <Textarea
              {...a11y}
              defaultValue={formDataDefaults?.description ?? ""}
              name="description"
              placeholder="The silver bullet can take you on an amazing adventure..."
            />
          )}
        </Field>
        <Field error={fieldErrors?.imageUrl} label="Image URL">
          {(a11y) => (
            <Input
              {...a11y}
              defaultValue={formDataDefaults?.imageUrl ?? ""}
              name="imageUrl"
              placeholder="https://images.unsplash.com/"
              type="url"
            />
          )}
        </Field>
        <Field error={fieldErrors?.type} label="Type">
          {(a11y) => (
            <>
              <Input
                {...a11y}
                defaultValue={formDataDefaults?.type ?? ""}
                list={`${a11y.id}-list`}
                name="type"
                placeholder="simple or luxury or rugged"
                type="text"
              />
              {/* react-doctor-disable-next-line*/}
              <datalist id={`${a11y.id}-list`}>
                {/* react-doctor-disable-next-line*/}
                <option value="luxury" />
                {/* react-doctor-disable-next-line*/}
                <option value="simple" />
                {/* react-doctor-disable-next-line*/}
                <option value="rugged" />
              </datalist>
            </>
          )}
        </Field>
        <Field error={fieldErrors?.discount} label="Discount (%)">
          {(a11y) => (
            <Input
              {...a11y}
              defaultValue={formDataDefaults?.discount ?? "0"}
              max={50}
              min={0}
              name="discount"
              placeholder="0"
              type="number"
            />
          )}
        </Field>
        <FormError
          className="col-span-full"
          id={formErrorId}
          message={formError}
        />
        <div className="col-span-full grid grid-cols-subgrid">
          <Button
            className="col-span-full @min-xl/form:col-start-2"
            disabled={isPending}
            type="submit"
          >
            Add your van
          </Button>
        </div>
      </Form>
    </div>
  );
};

export { VanForm };
