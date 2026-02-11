import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getCurrentUser({ allData = false } = {}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id ?? null;

  return {
    userId,
    redirectToSignIn: userId == null ? () => redirect("/login") : undefined,
    user: (allData && session?.user) || undefined,
    session: session || undefined,
  };
}
