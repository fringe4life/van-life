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
    onCheckedChange: (checked: boolean) => void;
  }
>;

const FilterCheckboxRow = ({
  id,
  label,
  checked,
  onCheckedChange,
  className,
  labelClassName,
}: FilterCheckboxRowProps) => {
  const handleCheckedChange = (value: boolean | "indeterminate") => {
    onCheckedChange(value === true);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-sm px-2 py-1.5",
        className
      )}
    >
      <Checkbox
        checked={checked}
        id={id}
        onCheckedChange={handleCheckedChange}
      />
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
