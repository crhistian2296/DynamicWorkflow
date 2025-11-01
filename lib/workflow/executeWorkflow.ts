import { AppNode } from "@/types/appNode";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import { TaskParamType } from "@/types/task";
import { WorkflowExecutionStatus } from "@/types/workflows";
import { ExecutionPhase, Workflow, WorkflowExecution } from "@prisma/client";
import { Edge } from "@xyflow/react";
import { revalidatePath } from "next/cache";
import { Browser, Page } from "puppeteer";
import "server-only";
import { LogCollector } from "../../types/log";
import { ExecutionPhaseStatus } from "../../types/workflows";
import { createLogCollector } from "../log";
import prisma from "../prisma";
import { ExecutorRegistry } from "./executor/registry";
import { TaskRegistry } from "./task/registry";

export async function ExecuteWorkflow(executionId: string) {
  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId },
    include: { workflow: true, phases: true },
  });

  if (!execution) throw new Error("Execution not found");

  const edges = JSON.parse(execution.definition).edges as Edge[];

  const environment: Environment = {
    phases: {},
  };

  await initializeWorkflowExecution(executionId, execution.workflowId);
  await initializePhasesStatus(execution);

  let creditsConsumed = 0;
  let executionFailed = false;
  for (const phase of execution.phases) {
    const phaseExecution = await executeWorkflowPhase(
      phase,
      environment,
      edges
    );
    if (!phaseExecution.success) {
      executionFailed = true;
      break;
    }
  }

  await finalizeWorkflowExecution(
    executionId,
    execution.workflowId,
    executionFailed,
    creditsConsumed
  );

  await cleanupEnvironment(environment);
  revalidatePath("workflow/runs");
}

async function initializeWorkflowExecution(
  executionId: string,
  workflowId: string
) {
  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      startedAt: new Date(),
      status: WorkflowExecutionStatus.RUNNING,
    },
  });

  await prisma.workflow.update({
    where: {
      id: workflowId,
    },
    data: {
      lastRunAt: new Date(),
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
      lastRunId: executionId,
    },
  });
}

// Replace 'typeof execution' with the appropriate type from Prisma
async function initializePhasesStatus(
  execution: WorkflowExecution & {
    workflow: Workflow;
    phases: ExecutionPhase[];
  }
) {
  await prisma.executionPhase.updateMany({
    where: {
      id: {
        in: execution.phases.map((phase: any) => phase.id),
      },
    },
    data: {
      status: WorkflowExecutionStatus.PENDING,
    },
  });
}

async function finalizeWorkflowExecution(
  executionId: string,
  workflowId: string,
  executionFailed: boolean,
  creditsConsumed: number
) {
  const finalStatus = executionFailed
    ? WorkflowExecutionStatus.FAILED
    : WorkflowExecutionStatus.COMPLETED;

  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      creditsConsumed,
    },
  });

  await prisma.workflow
    .update({
      where: {
        id: workflowId,
        lastRunId: executionId,
      },
      data: {
        lastRunStatus: finalStatus,
      },
    })
    .catch((e) => {
      if (e instanceof Error) {
        throw new Error(`Error updating workflow: ${e.message}`);
      }
    });
}

async function executeWorkflowPhase(
  phase: ExecutionPhase,
  environment: Environment,
  edges: Edge[]
) {
  const logCollector = createLogCollector();
  const startedAt = new Date();
  const node = JSON.parse(phase.node) as AppNode;
  setUpEnvironmentForPhase(node, environment, edges as Edge[]);

  await prisma.executionPhase.update({
    where: { id: phase.id },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
      inputs: JSON.stringify(environment.phases[node.id]?.inputs),
    },
  });

  const creditsRequired = TaskRegistry[node.data.type]?.credits || 0;
  console.log(
    `Executing phase ${phase.id} - Task: ${node.data.type} with ${creditsRequired} credits required`
  );

  const success = await executePhase(phase, node, environment, logCollector);
  const outputs = environment.phases[node.id]?.outputs;
  await finalizePhase(phase.id, success, outputs, logCollector);
  return { success };
}

async function finalizePhase(
  phaseId: string,
  success: boolean,
  outputs: Record<string, string>,
  logCollector: LogCollector
) {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;
  await prisma.executionPhase.update({
    where: { id: phaseId },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      outputs: JSON.stringify(outputs),
      logs: {
        createMany: {
          data: logCollector.getAll().map((log) => ({
            message: log.message,
            timestamp: log.timestamp,
            logLevel: log.level,
          })),
        },
      },
    },
  });
}

async function executePhase(
  phase: ExecutionPhase,
  node: AppNode,
  environment: Environment,
  logCollector: LogCollector
): Promise<boolean> {
  const runFn =
    ExecutorRegistry[node.data.type as keyof typeof ExecutorRegistry];
  if (!runFn) {
    return false;
  }
  const executionEnvironment: ExecutionEnvironment<any> =
    createExecutionEnvironment(node, environment, logCollector);

  return await runFn(executionEnvironment);
}

function setUpEnvironmentForPhase(
  node: AppNode,
  environment: Environment,
  edges: Edge[]
) {
  environment.phases[node.id] = { inputs: {}, outputs: {} };
  const inputs = TaskRegistry[node.data.type].inputs;
  for (const input of inputs) {
    if (input.type === TaskParamType.BROWSER_INSTANCE) continue;
    const inputValue = node.data.inputs[input.name];
    if (inputValue) {
      environment.phases[node.id].inputs[input.name] = inputValue;
      continue;
    }

    // If input is not found in node inputs, check if it's connected to another node
    const connectedEdge = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === input.name
    );

    if (!connectedEdge) {
      console.error(`Missing edge for input ${input.name} node id: ${node.id}`);
      continue;
    }

    const outputValue =
      environment.phases[connectedEdge.source]?.outputs[
        connectedEdge.sourceHandle!
      ];
    environment.phases[node.id].inputs[input.name] = outputValue;
  }
}

function createExecutionEnvironment(
  node: AppNode,
  environment: Environment,
  logCollector: LogCollector
): ExecutionEnvironment<any> {
  return {
    getInput: (name: string) => environment.phases[node.id]?.inputs[name],
    setOutput: (name: string, value: string) =>
      (environment.phases[node.id].outputs[name] = value),
    getBrowser: () => environment.browser,
    setBrowser: (browser: Browser) => {
      environment.browser = browser;
    },
    getPage: () => environment.page,
    setPage: (page: Page) => {
      environment.page = page;
    },
    log: logCollector,
  };
}

async function cleanupEnvironment(environment: Environment) {
  if (!environment.browser) return;

  try {
    if (environment.page) {
      await environment.page.close();
    }
    if (environment.browser) {
      await environment.browser.close();
    }
  } catch (error) {
    console.error("Error during environment cleanup:", error);
  }
}
