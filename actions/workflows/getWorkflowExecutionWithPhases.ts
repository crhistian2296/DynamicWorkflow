"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const GetWorkflowExecutionWithPhases = async (executionId: string) => {
  const { userId } = auth();

  if (!userId) throw new Error("User not authenticated");

  // Assuming you have a prisma client set up
  return prisma.workflowExecution.findUnique({
    where: {
      id: executionId, // Replace with the actual executionId you want to fetch
      userId, // Ensure the execution belongs to the authenticated user
    },
    include: {
      phases: {
        orderBy: {
          number: "asc",
        },
      },
    },
  });
};
