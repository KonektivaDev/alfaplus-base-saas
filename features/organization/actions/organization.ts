import { db } from "@/lib/prisma";

export async function getOrganizations() {
  const organizations = await db.organization.findMany({
    include: {
      _count: {
        select: { members: true },
      },
    },
  });

  return organizations;
}

export async function getOrganization(organizationId: string, allData = false) {
  const organization = await db.organization.findUnique({
    where: {
      id: organizationId,
    },
  });

  if (!organization) {
    return null;
  }

  if (allData) {
    return organization;
  }

  return {
    name: organization.name,
  };
}
