"use server";

import prisma from "@/lib/prisma";
import { FlowToExecutionPlan } from "@/lib/workflow/task/executionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
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
  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId,
      trigger: "manual",
      status: "PENDING",
      startedAt: new Date(),
      phases: {
        create: executionPlan.flatMap((phase) => {
          return phase.nodes.flatMap((node) => {
            return {
              userId,
              status: "CREATED",
              number: phase.phase,
              node: JSON.stringify(node),
              name: TaskRegistry[node.data.type]?.label,
            };
          });
        }),
      },
    },
    select: {
      id: true,
      phases: true,
    },
  });
  if (!execution) throw new Error("Execution could not be created");
};
