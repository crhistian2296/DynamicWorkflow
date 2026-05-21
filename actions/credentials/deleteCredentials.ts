"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function DeleteCredential(id: string) {
  const { userId } = await auth.protect();
  if (!userId) throw new Error("Unauthorized");

  await prisma.credential.delete({
    where: {
      id,
      userId,
    },
  });
  revalidatePath("/credentials");
}
