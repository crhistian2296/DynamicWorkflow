import prisma from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionPlan,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
} from "@/types/workflows";
import CronExpressionParser from "cron-parser";
import { timingSafeEqual } from "crypto";

function isValidSecret(token: string) {
  const API_SECRET = process.env.API_SECRET_TOKEN;
  if (!API_SECRET) {
    console.warn("API_SECRET_TOKEN is not set in environment variables");
    return false;
  }

  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(API_SECRET));
  } catch (error) {
    console.error("Error comparing tokens");
    return false;
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith(`Bearer `)) {
    return new Response("Unauthorized 1", { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  if (!isValidSecret(token)) {
    return new Response("Unauthorized 2", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const workflowId = searchParams.get("workflowId");

  if (!workflowId)
    return new Response("Bad Request: Missing workflowId", { status: 400 });

  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId || undefined },
  });

  if (!workflow) return new Response("Workflow not found", { status: 404 });

  const executionPlan = JSON.parse(
    workflow.executionPlan!,
  ) as WorkflowExecutionPlan;

  if (!executionPlan)
    return new Response("Invalid execution plan", { status: 400 });

  try {
    const cron = CronExpressionParser.parse(workflow.cron!, { tz: "UTC" });
    const nextRun = cron.next().toDate();

    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId: workflow.id,
        userId: workflow.userId,
        definition: workflow.definition,
        status: WorkflowExecutionStatus.PENDING,
        startedAt: new Date(),
        trigger: WorkflowExecutionTrigger.CRON,
        phases: {
          create: executionPlan.flatMap((phase) => {
            return phase.nodes.flatMap((node) => {
              return {
                userId: workflow.userId,
                status: ExecutionPhaseStatus.CREATED,
                number: phase.phase,
                node: JSON.stringify(node),
                name: TaskRegistry[node.data.type]?.label,
              };
            });
          }),
        },
      },
    });

    await ExecuteWorkflow(execution.id, nextRun);

    return new Response(null, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
