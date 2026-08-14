import type { auth } from "./auth.js";

export type Variables = {
  user: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>["user"];
};
