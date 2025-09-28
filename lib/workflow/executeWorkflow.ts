import { AppNode } from "@/types/appNode";
import { Enviroment } from "@/types/executor";
import { WorkflowExecutionStatus } from "@/types/workflows";
import { ExecutionPhase, Workflow, WorkflowExecution } from "@prisma/client";
import { revalidatePath } from "next/cache";
import "server-only";
import { ExecutionPhaseStatus } from "../../types/workflows";
import prisma from "../prisma";
import { ExecutorRegistry } from "./executor/registry";
import { TaskRegistry } from "./task/registry";

export async function ExecuteWorkflow(executionId: string) {
  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId },
    include: { workflow: true, phases: true },
  });

  if (!execution) throw new Error("Execution not found");

  // TODO: setup execution environment
  const enviroment: Enviroment = {
    phases: {},
  };

  // TODO: initialize workflow execution
  await initializeWorkflowExecution(executionId, execution.workflowId);

  // TODO: initialize phases status
  await initializePhasesStatus(execution);
  let creditsConsumed = 0;
  let executionFailed = false;
  for (const phase of execution.phases) {
    // TODO: execute each phase
    const phaseExecution = await executeWorkflowPhase(phase, enviroment);
    if (!phaseExecution.success) {
      executionFailed = true;
      break;
    }
  }

  // TODO: finalize execution
  await finalizeWorkflowExecution(
    executionId,
    execution.workflowId,
    executionFailed,
    creditsConsumed
  );
  // TODO:cleanup execution environment

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
  enviroment?: Enviroment
) {
  const startedAt = new Date();
  const node = JSON.parse(phase.node) as AppNode;

  await prisma.executionPhase.update({
    where: { id: phase.id },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
    },
  });

  const creditsRequired = TaskRegistry[node.data.type]?.credits || 0;
  console.log(
    `Executing phase ${phase.id} - Task: ${node.data.type} with ${creditsRequired} credits required`
  );

  const success = await executePhase(phase, node, enviroment || { phases: {} });
  await finalizePhase(phase.id, success);
  return { success };
}

async function finalizePhase(phaseId: string, success: boolean) {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;
  await prisma.executionPhase.update({
    where: { id: phaseId },
    data: {
      status: finalStatus,
      completedAt: new Date(),
    },
  });
}

async function executePhase(
  phase: ExecutionPhase,
  node: AppNode,
  enviroment: Enviroment
): Promise<boolean> {
  const runFn =
    ExecutorRegistry[node.data.type as keyof typeof ExecutorRegistry];
  if (!runFn) {
    return false;
  }
  return await runFn(enviroment);
}
