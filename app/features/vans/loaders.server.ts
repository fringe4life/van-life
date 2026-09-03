import { createLoader } from "nuqs/server";
import { vansParsers } from "~/features/vans/parsers";

export const loadVansSearchParams = createLoader(vansParsers);
