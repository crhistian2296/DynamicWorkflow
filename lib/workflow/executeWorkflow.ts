import { revalidatePath } from "next/cache";
import "server-only";
import prisma from "../prisma";

export async function ExecuteWorkflow(executionId: string) {
  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId },
    include: { workflow: true, phases: true },
  });

  if (!execution) throw new Error("Execution not found");

  // TODO: setup execution environment

  // TODO: initialize workflow execution

  // TODO: initialize phases status

  let executionFailed = false;
  for (const phase of execution.phases) {
    // TODO: execute each phase
  }

  // TODO: finalize execution
  // TODO:cleanup execution environment

  revalidatePath("workflow/runs");
}
