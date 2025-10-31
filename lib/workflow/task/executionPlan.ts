import { AppNode, AppNodeMissingInputs } from "@/types/appNode";
import {
  WorkflowExecutionPlan,
  WorkflowExecutionPlanPhase,
} from "@/types/workflows";
import { Edge } from "@xyflow/react";
import { TaskRegistry } from "./registry";

export enum FlowToExecutionPlanError {
  "NO_ENTRY_POINT",
  "INVALID_INPUTS",
}

type FlowToExecutionPlan = {
  executionPlan?: WorkflowExecutionPlan;
  error?: {
    type: FlowToExecutionPlanError;
    invalidElements?: AppNodeMissingInputs[];
    message?: string;
  };
};

export function FlowToExecutionPlan(
  nodes: AppNode[],
  edges: Edge[]
): FlowToExecutionPlan {
  const entryPoint = nodes.find(
    (node) => TaskRegistry[node.data.type]?.isEntryPoint
  );
  if (!entryPoint)
    return {
      error: {
        type: FlowToExecutionPlanError.NO_ENTRY_POINT,
        message: "No entry point found in the workflow",
      },
    };

  const inputsWithErrors: AppNodeMissingInputs[] = [];
  const planned = new Set<string>();

  const invalidInputs = getInvalidInputs(entryPoint, edges, planned);

  if (invalidInputs.length > 0) {
    inputsWithErrors.push({
      nodeId: entryPoint.id,
      inputs: invalidInputs,
    });
  }

  // Initialize the execution plan with the entry point and add
  const executionPlan: WorkflowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint],
    },
  ];

  planned.add(entryPoint.id);

  for (
    let phase = 2;
    phase <= nodes.length && planned.size < nodes.length;
    phase++
  ) {
    const nextPhase: WorkflowExecutionPlanPhase = { phase, nodes: [] };

    for (const currentNode of nodes) {
      if (planned.has(currentNode.id)) {
        // Node already planned, skip
        continue;
      }
      const invalidInputs = getInvalidInputs(currentNode, edges, planned);
      if (invalidInputs.length > 0) {
        const incomers = getIncomers(currentNode, nodes, edges);
        if (incomers.every((incomer) => planned.has(incomer.id))) {
          // If all incomers are planned and there are still invalid inputs
          // this means that this particular node has invalid inputs
          // which means that the workflow is not valid
          console.error(
            `Node ${currentNode.id} has invalid inputs: ${invalidInputs}`
          );
          inputsWithErrors.push({
            nodeId: currentNode.id,
            inputs: invalidInputs,
          });
        } else {
          // let's skip this node for now
          continue;
        }
      }
      nextPhase.nodes.push(currentNode);
    }
    // Add the next phase to the execution plan
    console.log(`Phase ${phase}`, nextPhase);
    for (const node of nextPhase.nodes) {
      planned.add(node.id);
    }
    executionPlan.push(nextPhase);
  }

  if (inputsWithErrors.length > 0) {
    return {
      error: {
        type: FlowToExecutionPlanError.INVALID_INPUTS,
        invalidElements: inputsWithErrors,
      },
    };
  }

  return {
    executionPlan,
  };
}

function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>) {
  const invalidInputs: string[] = [];
  const inputs = TaskRegistry[node.data.type]?.inputs;

  for (const input of inputs) {
    if (node.data.inputs[input.name] === undefined)
      throw new Error(
        `Input "${input.name}" is not defined in node ${node.id}`
      );
    const inputValue = node.data?.inputs[input.name];
    const inputValueProvided = inputValue?.length > 0;
    if (inputValueProvided) continue; // Input is provided, no issue

    // If a value is not provided, check if it has incomers
    const incomingEdges = edges.filter((edge) => edge.target === node.id);
    const inputLinkedToOutput = incomingEdges.find(
      (edge) => edge.targetHandle === input.name
    );

    const requiredInputProvidedByVisitedOutput =
      input.required &&
      inputLinkedToOutput &&
      planned.has(inputLinkedToOutput.source);

    if (requiredInputProvidedByVisitedOutput) {
      // the input is required and we have a valid value for it
      // provided by a task that is already planned
      continue;
    } else if (!input.required) {
      // If the input is not required but there is an ouptput linked to it,
      // then we need to check if the output is already planned
      if (!inputLinkedToOutput) continue; // No edge, no issue
      if (inputLinkedToOutput && planned.has(inputLinkedToOutput.source)) {
        // The output is providing a value for this input
        continue;
      }
    }
    invalidInputs.push(input.name);
  }
  return invalidInputs;
}

function getIncomers(node: AppNode, nodes: AppNode[], edges: Edge[]) {
  if (!node) return [];
  const incomers = new Set();
  for (const edge of edges) {
    if (edge.target === node.id) {
      incomers.add(edge.source);
    }
  }
  return nodes.filter((n) => incomers.has(n.id));
}
