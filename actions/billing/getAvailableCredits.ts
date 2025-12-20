"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetAvailableCredits() {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const userBalance = await prisma.userBalance.findUnique({
    where: { userId },
  });

  if (!userBalance) {
    return undefined; // Default credits for new users
  }

  return userBalance.credits;
}
