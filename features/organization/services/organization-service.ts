import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { err, ERROR_CODE, ok } from "@/lib/errors/errors";
import { saveUser } from "@/features/user/db/users";
import { logServerEvent } from "@/lib/logger/server-logger";

export async function setActiveOrganizationService(organizationId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id ?? null;

  if (userId == null)
    return err(ERROR_CODE.UNAUTHENTICATED, "Unauthenticated.");

  const member = await db.member.findFirst({
    where: {
      userId,
      organizationId,
    },
  });

  if (member == null) {
    return err(ERROR_CODE.FORBIDDEN, "Unauthorized.");
  }

  try {
    return ok(
      await saveUser(userId, {
        activeOrganizationId: organizationId,
      }),
    );
  } catch (error) {
    logServerEvent({
      level: "error",
      scope: "organization.setActiveOrganizationService",
      message: "Failed to persist activeOrganizationId on user",
      error,
      meta: { userId, organizationId },
    });

    return err(ERROR_CODE.UNEXPECTED, "Unexpected error.");
  }
}

export async function clearActiveOrganizationService() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id ?? null;
  if (userId == null)
    return err(ERROR_CODE.UNAUTHENTICATED, "Unauthenticated.");

  try {
    return ok(
      await saveUser(userId, {
        activeOrganizationId: null,
      }),
    );
  } catch (error) {
    logServerEvent({
      level: "error",
      scope: "organization.clearActiveOrganizationService",
      message: "Failed to clear activeOrganizationId on user",
      error,
      meta: { userId },
    });

    return err(ERROR_CODE.UNEXPECTED, "Unexpected error.");
  }
}

export async function getInitialOrganizationService(userId: string) {
  try {
    const initialOrganization = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        activeOrganizationId: true,
      },
    });

    if (initialOrganization?.activeOrganizationId == null) {
      return err(ERROR_CODE.NOT_FOUND, "Initial organization not found.");
    }

    const member = await db.member.findFirst({
      where: {
        userId,
        organizationId: initialOrganization?.activeOrganizationId,
      },
    });

    if (member == null) {
      return err(ERROR_CODE.NOT_FOUND, "Member not found.");
    }

    return ok({
      activeOrganizationId: initialOrganization?.activeOrganizationId,
    });
  } catch (error) {
    logServerEvent({
      level: "error",
      scope: "organization.getInitialOrganization",
      message: "Failed to get initial organization",
      error,
      meta: { userId },
    });
    return err(ERROR_CODE.UNEXPECTED, "Unexpected error.");
  }
}
