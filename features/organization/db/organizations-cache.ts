import { getGlobalTag, getIdTag } from "@/lib/data-cache";
import { revalidateTag } from "next/cache";

export function getOrganizationsGlobalTag() {
  return getGlobalTag("organization");
}

export function getOrganizationIdTag(id: string) {
  return getIdTag("organization", id);
}

export function revalidateOrganizationsCache(id: string) {
  revalidateTag(getOrganizationsGlobalTag(), { expire: 0 });
  revalidateTag(getOrganizationIdTag(id), { expire: 0 });
}
