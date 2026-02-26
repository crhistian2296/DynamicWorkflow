"use server";

import { waitFor } from "@/lib/helper/waitFor";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { CronExpressionParser } from "cron-parser";

export async function UpdateWorkflow({
  id,
  cron,
}: {
  id: string;
  cron: string;
}) {
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
  try {
    const interval = CronExpressionParser.parse(cron, { tz: "UTC" });

    return await prisma.workflow.update({
      where: { id, userId },
      data: {
        cron,
        nextRunAt: interval.next().toDate(),
      },
    });
  } catch (error) {
    console.error("Invalid cron:", (error as Error).message);
    throw new Error("Invalid cron expression");
  }
}
