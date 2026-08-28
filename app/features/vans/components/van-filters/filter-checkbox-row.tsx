import type { ChangeEvent } from "react";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import type { Id, Prettify } from "~/types";
import { cn } from "~/utils/utils";

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
      className={cn(
        "flex min-h-11 items-center gap-2 rounded-md px-3 py-2 transition-colors focus-within:bg-orange-100/70 hover:bg-orange-100",
        className
      )}
    >
      <Checkbox checked={checked} id={id} onChange={handleChange} />
      <Label
        className={cn("cursor-pointer font-normal", labelClassName)}
        htmlFor={id}
      >
        {label}
      </Label>
    </div>
  );
};

export { FilterCheckboxRow };
