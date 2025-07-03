import { AppNode } from "@/types/appNode";
import { WorkflowExecutionPlan } from "@/types/workflows";
import { Edge } from "@xyflow/react";
import { TaskRegistry } from "./registry";

type FlowToExecutionPlan = {
  executionPlan?: WorkflowExecutionPlan;
};
export function FlowToExecutionPlan(nodes: AppNode[], edges: Edge): FlowToExecutionPlan {
  const entryPoint = nodes.find((node) => TaskRegistry[node.data.type]?.isEntryPoint);
  if (!entryPoint) throw new Error("TODO: HANDLE NO ENTRY POINT");

  const executionPlan: WorkflowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint],
    },
  ];
  return {
    executionPlan,
  };
}
