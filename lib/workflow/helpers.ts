import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "./task/registry";

export function CalculateWorkflowCost(node: AppNode[]) {
  return node.reduce((acc, node) => {
    return acc + TaskRegistry[node.data.type].credits;
  }, 0);
}
