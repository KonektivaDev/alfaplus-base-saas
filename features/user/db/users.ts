import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/prisma";
import { revalidateUsersCache } from "./users-cache";

export async function saveUser(
  id: string,
  data: Prisma.UserUncheckedUpdateInput,
) {
  const user = await db.$transaction(async (tx) => {
    const after = await tx.user.update({
      where: { id },
      data,
    });

    return after;
  });

  revalidateUsersCache(id);

  return user;
}
