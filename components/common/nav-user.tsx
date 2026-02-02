import { getCurrentUser } from "@/lib/auth-utils";
import { Suspense } from "react";
import { NavUserClient } from "./nav-user-client";

export function NavUser() {
  return (
    <Suspense>
      <NavUserSuspense />
    </Suspense>
  )
}

async function NavUserSuspense() {
  const { user } = await getCurrentUser({ allData: true });
  if (user == null) {
    return null;
  }

  return (
    <NavUserClient user={{
      ...user,
      image: user?.image ?? null,

    }} />
  )
}