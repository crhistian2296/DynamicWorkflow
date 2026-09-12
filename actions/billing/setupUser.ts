"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const SetupUser = async () => {
  const { isAuthenticated, userId } = await auth();
  console.debug("isAuthenticated:", isAuthenticated, "userId:", userId);

  if (!isAuthenticated || !userId) {
    throw new Error("User not authenticated");
  }

  const balance = await prisma.userBalance.findUnique({
    where: {
      userId,
    },
  });

  if (!balance) {
    await prisma.userBalance.create({
      data: {
        userId,
        credits: 500,
      },
    });
  }

  redirect("/");
};

export default SetupUser;
