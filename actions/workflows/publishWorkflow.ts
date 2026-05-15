"use server";

import prisma from "@/lib/prisma";
import { CalculateWorkflowCost } from "@/lib/workflow/helpers";
import { FlowToExecutionPlan } from "@/lib/workflow/task/executionPlan";
import { WorkflowStatus } from "@/types/workflows";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const PublishWorkflow = async ({
  id,
  flowDefinition,
}: {
  id: string;
  flowDefinition: string;
}) => {
  const { userId } = auth();
  if (!userId) throw new Error("User not authenticated");

  const workflow = await prisma.workflow.findUnique({
    where: { id, userId },
  });
  if (!workflow) throw new Error("Workflow not found");
  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error("Only draft workflows can be published");
  }

  const flow = JSON.parse(flowDefinition);

  const result = FlowToExecutionPlan(flow.nodes, flow.edges);

  if (result.error)
    throw new Error(`Flow definition not valid: ${result.error.message}`);
  if (!result.executionPlan) throw new Error("No execution plan generated");

  const creditsCost = CalculateWorkflowCost(flow.nodes);
  await prisma.workflow.update({
    where: {
      id,
      userId,
    },
    data: {
      definition: flowDefinition,
      executionPlan: JSON.stringify(result.executionPlan),
      creditsCost,
      status: WorkflowStatus.PUBLISHED,
    },
  });
  revalidatePath(`/workflow/editor/${id}`);
};
