import { type SubmitEventHandler, useId } from "react";
import { Form } from "react-router";
import { css, cx } from "styled-system/css";
import { cq, grid } from "styled-system/patterns";
import { Field } from "~/components/form/field";
import { FormError } from "~/components/form/form-error";
import { getFetcherStatus } from "~/components/form/get-fetcher-status";
import type { FetcherStateObject } from "~/components/form/types";
import { useAutoIdleStatus } from "~/components/form/use-auto-idle-status";
import { StatusButton } from "~/components/status-button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { VAN_TYPE_VALUES } from "~/features/vans/schema";
import type { VanFormFieldErrors, VanFormValues } from "~/features/vans/types";
import type { Ok, Prettify } from "~/types";

type VanFormProps = Prettify<
  Partial<Ok> &
    FetcherStateObject & {
      fieldErrors?: VanFormFieldErrors;
      formDataDefaults?: VanFormValues;
      formError?: string;
      isPending: boolean;

      onSubmit: SubmitEventHandler<HTMLFormElement>;
    }
>;

const VanForm = ({
  onSubmit,
  isPending,
  formDataDefaults,
  fieldErrors,
  formError,
  fetcherState,
  ok,
}: VanFormProps) => {
  const formId = useId();
  const formErrorId = `${formId}-error`;
  const formTitleId = `${formId}-title`;
  const status = useAutoIdleStatus(
    getFetcherStatus(fetcherState, ok === undefined ? undefined : { ok }, {
      isTransitionPending: isPending,
    })
  );

  return (
    <Card
      className={cx(
        cq({ name: "form" }),
        css({ backgroundColor: "card", borderColor: "border" })
      )}
    >
      <CardHeader
        className={css({
          borderBottom: "1",
          borderColor: "border",
          paddingBlockEnd: "4",
        })}
      >
        <h2
          className={css({
            color: "foreground",
            fontSize: { base: "2xl", md: "4xl", sm: "3xl" },
            fontWeight: "bold",
          })}
          id={formTitleId}
        >
          Add Van
        </h2>
      </CardHeader>

      <CardContent>
        <Form
          aria-describedby={formError ? formErrorId : undefined}
          aria-labelledby={formTitleId}
          className={cx(
            grid({
              alignItems: "start",
              columnGap: "6",
              gridTemplateAreas: {
                "@form/xl":
                  '"name price" "description description" "image type" "discount discount" "error error" "submit submit"',
                base: '"name" "price" "description" "image" "type" "discount" "error" "submit"',
              },
              gridTemplateColumns: { "@form/xl": "repeat(2, minmax(0, 1fr))" },
              maxInlineSize: { "@form/xl": "4xl" },
              rowGap: "4",
            })
          )}
          method="POST"
          onSubmit={onSubmit}
        >
          <Field
            className={css({ gridArea: "name" })}
            error={fieldErrors?.name}
            label="Name"
          >
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
          <Field
            className={css({ gridArea: "price" })}
            error={fieldErrors?.price}
            label="Price ($/day)"
          >
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
            className={css({ gridArea: "description" })}
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
          <Field
            className={css({ gridArea: "image" })}
            error={fieldErrors?.imageUrl}
            label="Image URL"
          >
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
          <Field
            className={css({ gridArea: "type" })}
            error={fieldErrors?.type}
            label="Type"
          >
            {(a11y) => (
              <>
                <Input
                  {...a11y}
                  defaultValue={formDataDefaults?.type ?? ""}
                  list={`${a11y.id}-list`}
                  name="type"
                  placeholder="SIMPLE, LUXURY, or RUGGED"
                  type="text"
                />
                {/* react-doctor-disable-next-line*/}
                <datalist id={`${a11y.id}-list`}>
                  {VAN_TYPE_VALUES.map((vanType) => (
                    <option key={vanType} value={vanType} />
                  ))}
                </datalist>
              </>
            )}
          </Field>
          <Field
            className={css({ gridArea: "discount" })}
            error={fieldErrors?.discount}
            label="Discount (%)"
          >
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
            className={css({ gridArea: "error" })}
            id={formErrorId}
            message={formError}
          />

          <div
            className={css({
              display: "grid",
              gridArea: "submit",
              gridTemplateAreas: { "@form/xl": '". button"', base: '"button"' },
              gridTemplateColumns: { "@form/xl": "subgrid", base: "1fr" },
            })}
          >
            <StatusButton
              className={css({ gridArea: "button", inlineSize: "full" })}
              status={status}
              type="submit"
            >
              Add your van
            </StatusButton>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export { VanForm };
