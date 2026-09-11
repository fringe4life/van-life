import { createContext } from "react-router";
import type { AppDb } from "~/db/client.server";

export const dbContext = createContext<AppDb>();
