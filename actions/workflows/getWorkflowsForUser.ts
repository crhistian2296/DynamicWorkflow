"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// import prisma from '@/lib/prisma';

export const GetWorkflowsForUser = async () => {
  const { userId } = auth();

  if (!userId) throw new Error("User not authenticated");

  return prisma.workflow.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};
