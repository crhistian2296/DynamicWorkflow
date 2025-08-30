import "server-only";
import prisma from "../prisma";

export async function ExecuteWorkflow(executionId: string) {
  const execution = prisma.workflowExecution.findUnique({
    where: { id: executionId },
    include: { workflow: true, phases: true },
  });
}
