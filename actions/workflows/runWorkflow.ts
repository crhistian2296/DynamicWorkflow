"use server";

import prisma from "@/lib/prisma";
import { FlowToExecutionPlan } from "@/lib/workflow/task/executionPlan";
import { WorkflowExecutionPlan } from "@/types/workflows";
import { auth } from "@clerk/nextjs/server";

export const RunWorkflow = async (form: {
  workflowId: string;
  flowDefinition?: string;
}) => {
  const { userId } = auth();
  if (!userId) throw new Error("User not authenticated");
  const { workflowId, flowDefinition } = form;
  if (!workflowId) throw new Error("Workflow ID is required");

  const worflow = prisma.workflow.findUnique({
    where: { id: workflowId, userId },
  });

  let executionPlan: WorkflowExecutionPlan;

  if (!worflow) throw new Error("Workflow not found");
  if (!flowDefinition) throw new Error("Flow definition is required");

  const flow = JSON.parse(flowDefinition);
  const result = FlowToExecutionPlan(flow.nodes, flow.edges);

  if (result.error) throw new Error("Flow validation failed: " + result.error);
  if (!result.executionPlan)
    throw new Error("Execution plan could not be generated");

  executionPlan = result.executionPlan;
  console.log("Execution plan generated:", executionPlan);
};
