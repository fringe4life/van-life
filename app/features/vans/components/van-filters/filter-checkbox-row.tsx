import type { ChangeEvent } from "react";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import type { Id, Prettify } from "~/types";

import { css, cx } from "../../../../../styled-system/css";
import { hstack } from "../../../../../styled-system/patterns";

type FilterCheckboxRowProps = Prettify<
  Id & {
    checked: boolean;
    className?: string;
    label: string;
    labelClassName?: string;
    onChange: (checked: boolean) => void;
  }
>;

const FilterCheckboxRow = ({
  id,
  label,
  checked,
  onChange,
  className,
  labelClassName,
}: FilterCheckboxRowProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.currentTarget.checked);
  };

  return (
    <div
      className={cx(
        hstack({ gap: "2" }),
        css({
          backgroundColor: {
            _focusWithin: "surface.muted/70",
            _hover: "surface.muted",
          },
          borderRadius: "md",
          minBlockSize: "11",
          paddingBlock: "2",
          paddingInline: "3",
          transitionDuration: "fast",
          transitionProperty: "colors",
        }),
        className
      )}
    >
      <Checkbox checked={checked} id={id} onChange={handleChange} />
      <Label
        className={cx(
          css({ cursor: "pointer", fontWeight: "normal" }),
          labelClassName
        )}
        htmlFor={id}
      >
        {label}
      </Label>
    </div>
  );
};

export { FilterCheckboxRow };
