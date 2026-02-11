import { getGlobalTag, getIdTag } from "@/lib/data-cache";
import { revalidateTag } from "next/cache";

export function getUsersGlobalTag() {
  return getGlobalTag("user");
}

export function getUserIdTag(id: string) {
  return getIdTag("user", id);
}

export function revalidateUsersCache(id: string) {
  revalidateTag(getUsersGlobalTag(), { expire: 0 });
  revalidateTag(getUserIdTag(id), { expire: 0 });
}
