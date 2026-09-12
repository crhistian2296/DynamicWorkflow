"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { useRouter } from "next/navigation";

const SetupUser = async () => {
  const router = useRouter();
  const { isAuthenticated, userId } = await auth();
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

  router.push("/");
};

export default SetupUser;
