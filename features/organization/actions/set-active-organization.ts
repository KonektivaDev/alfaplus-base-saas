"use server";

import { redirect } from "next/navigation";
import {
  clearActiveOrganizationService,
  getInitialOrganizationService,
  setActiveOrganizationService,
} from "../services/organization-service";
import { revalidateOrganizationsCache } from "../db/organizations-cache";
import { matchError } from "@/lib/errors/errors";

export async function setActiveOrganization(organizationId: string) {
  const [error, result] = await setActiveOrganizationService(organizationId);

  if (!error) {
    revalidateOrganizationsCache(organizationId);

    return { success: result };
  }

  return matchError(error, {
    UNAUTHENTICATED: () => redirect("/login"),
    FORBIDDEN: () => ({
      error: { message: "You are not a member of this organization." },
    }),
    UNEXPECTED: () => ({
      error: { message: "Unexpected error." },
    }),
  });
}

export async function clearActiveOrganization() {
  const [error, result] = await clearActiveOrganizationService();
  if (!error) {
    return { success: result };
  }

  return matchError(error, {
    UNAUTHENTICATED: () => redirect("/login"),
    UNEXPECTED: () => ({
      error: { message: "Unexpected error." },
    }),
  });
}
