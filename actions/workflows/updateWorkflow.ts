"use server";

import { waitFor } from "@/lib/helper/waitFor";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function UpdateWorkflow({ id, definition }: { id: string; definition: string }) {
  await waitFor(4000); // Simulate a delay for the sake of example
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const workflow = await prisma.workflow.findUnique({
    where: { id, userId },
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  if (workflow.status !== "DRAFT") {
    throw new Error("Workflow is not a draft");
  }

  await prisma.workflow.update({
    where: { id, userId },
    data: {
      definition,
    },
  });
}
