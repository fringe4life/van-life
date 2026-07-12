import { type SubmitEventHandler, useId } from "react";
import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
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

const FieldError = ({ id, message }: { id: string; message?: string }) => {
  if (!message) {
    return null;
  }

  return (
    <p className="font-medium text-red-500 text-sm" id={id}>
      {message}
    </p>
  );
};

const VanForm = ({
  onSubmit,
  isPending,
  formDataDefaults,
  fieldErrors,
  formError,
}: VanFormProps) => {
  const nameId = useId();
  const priceId = useId();
  const descriptionId = useId();
  const imageUrlId = useId();
  const typeId = useId();
  const discountId = useId();
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
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={nameId}>Name</Label>
          <Input
            aria-describedby={fieldErrors?.name ? `${nameId}-error` : undefined}
            aria-invalid={Boolean(fieldErrors?.name)}
            defaultValue={formDataDefaults?.name ?? ""}
            id={nameId}
            name="name"
            placeholder="Silver Bullet"
            type="text"
          />
          <FieldError id={`${nameId}-error`} message={fieldErrors?.name} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={priceId}>Price ($/day)</Label>
          <Input
            aria-describedby={
              fieldErrors?.price ? `${priceId}-error` : undefined
            }
            aria-invalid={Boolean(fieldErrors?.price)}
            defaultValue={formDataDefaults?.price ?? ""}
            id={priceId}
            name="price"
            placeholder="100"
            type="number"
          />
          <FieldError id={`${priceId}-error`} message={fieldErrors?.price} />
        </div>
        <div className="@min-xl/form:col-span-2 flex flex-col gap-1.5">
          <Label htmlFor={descriptionId}>Description</Label>
          <Textarea
            aria-describedby={
              fieldErrors?.description ? `${descriptionId}-error` : undefined
            }
            aria-invalid={Boolean(fieldErrors?.description)}
            defaultValue={formDataDefaults?.description ?? ""}
            id={descriptionId}
            name="description"
            placeholder="The silver bullet can take you on an amazing adventure..."
          />
          <FieldError
            id={`${descriptionId}-error`}
            message={fieldErrors?.description}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={imageUrlId}>Image URL</Label>
          <Input
            aria-describedby={
              fieldErrors?.imageUrl ? `${imageUrlId}-error` : undefined
            }
            aria-invalid={Boolean(fieldErrors?.imageUrl)}
            defaultValue={formDataDefaults?.imageUrl ?? ""}
            id={imageUrlId}
            name="imageUrl"
            placeholder="https://images.unsplash.com/"
            type="url"
          />
          <FieldError
            id={`${imageUrlId}-error`}
            message={fieldErrors?.imageUrl}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={typeId}>Type</Label>
          <Input
            aria-describedby={fieldErrors?.type ? `${typeId}-error` : undefined}
            aria-invalid={Boolean(fieldErrors?.type)}
            defaultValue={formDataDefaults?.type ?? ""}
            id={typeId}
            list={`${typeId}-list`}
            name="type"
            placeholder="simple or luxury or rugged"
            type="text"
          />
          {/* react-doctor-disable-next-line*/}
          <datalist id={`${typeId}-list`}>
            {/* react-doctor-disable-next-line*/}
            <option value="luxury" />
            {/* react-doctor-disable-next-line*/}
            <option value="simple" />
            {/* react-doctor-disable-next-line*/}
            <option value="rugged" />
          </datalist>
          <FieldError id={`${typeId}-error`} message={fieldErrors?.type} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={discountId}>Discount (%)</Label>
          <Input
            aria-describedby={
              fieldErrors?.discount ? `${discountId}-error` : undefined
            }
            aria-invalid={Boolean(fieldErrors?.discount)}
            defaultValue={formDataDefaults?.discount ?? "0"}
            id={discountId}
            max={50}
            min={0}
            name="discount"
            placeholder="0"
            type="number"
          />
          <FieldError
            id={`${discountId}-error`}
            message={fieldErrors?.discount}
          />
        </div>
        {formError ? (
          <p
            className="col-span-full font-medium text-red-500 text-sm"
            id={formErrorId}
            role="alert"
          >
            {formError}
          </p>
        ) : null}
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
