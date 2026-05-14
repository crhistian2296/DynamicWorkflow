"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const GetUserPurchaseHistory = async () => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const purchases = await prisma.userPurchase.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  return purchases;
};
