"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const GetWorkflowPhaseDetails = async (phaseId: string) => {
  const { userId } = await auth.protect();
  if (!userId) throw new Error("Unauthorized");

  return prisma.executionPhase.findUnique({
    where: {
      id: phaseId,
      execution: { userId },
    },
    include: {
      logs: {
        orderBy: {
          timestamp: "asc",
        },
      },
    },
  });
};
