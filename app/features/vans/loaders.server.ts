import { createLoader } from "nuqs/server";
import { vansParsers } from "~/features/vans/schema";

export const loadVansSearchParams = createLoader(vansParsers);
