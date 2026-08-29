import type { ComponentProps } from "react";
import type { CustomLink } from "../components/custom-link";

export const linkClassName: NonNullable<
  ComponentProps<typeof CustomLink>["className"]
> =
  "flex items-center gap-2 transition-colors duration-250 px-2 py-1 rounded hover:bg-primary hover:text-primary-foreground";
