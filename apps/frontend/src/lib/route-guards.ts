import { redirect } from "@tanstack/react-router";
import { authClient } from "./auth-client";

export async function requireSession() {
  const { data } = await authClient.getSession();
  if (!data) {
    throw redirect({ to: "/login" });
  }
  return data;
}
