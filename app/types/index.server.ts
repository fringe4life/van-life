import type { Auth } from "~/lib/auth.server";

export type Session = Auth["$Infer"]["Session"];
export type User = Session["user"];
