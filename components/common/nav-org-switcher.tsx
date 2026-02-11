import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { Suspense } from "react";
import { NavOrgSwitcherClient } from "./nav-org-switcher-client";

export function NavOrgSwitcher() {
  return (
    <Suspense fallback={<NavOrgSwitcherClient isOwner={false} />}>
      <NavOrgSwitcherSuspense />
    </Suspense>
  );
}

async function NavOrgSwitcherSuspense() {
  const session = await auth.api.getSession({ headers: await headers() });

  const userId = session?.user?.id ?? null;
  const activeOrgId = session?.session?.activeOrganizationId ?? null;

  if (!userId || !activeOrgId) {
    return <NavOrgSwitcherClient isOwner={false} />;
  }

  const member = await db.member.findFirst({
    where: { userId, organizationId: activeOrgId },
    select: { role: true },
  });

  const roles = (member?.role ?? "")
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean);

  const isOwner = roles.includes("owner");

  return <NavOrgSwitcherClient isOwner={isOwner} />;
}
