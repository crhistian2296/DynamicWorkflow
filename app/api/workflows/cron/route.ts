import { getAppUrl } from "@/lib/helper/appUrl";
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflows";

export async function GET(req: Request) {
  const now = new Date();
  const workflows = await prisma.workflow.findMany({
    select: {
      id: true,
    },
    where: {
      status: WorkflowStatus.PUBLISHED,
      cron: { not: null },
      nextRunAt: {
        lte: now,
      },
    },
  });

  console.log("@@WORKFLOW TO RUN", workflows.length);
  for (const workflow of workflows) {
    console.log("@@WORKFLOW TO RUN ID", workflow.id);
    triggerWorkflow(workflow.id);
  }

  return new Response(
    JSON.stringify({ workflowsTriggered: workflows.length }),
    { status: 200 },
  );
}

function triggerWorkflow(workflowId: string) {
  const triggerApiUrl = `${getAppUrl(`api/workflows/execute?workflowId=${workflowId}`)}`;
  console.log("@@TRIGGER URL:", triggerApiUrl);

  fetch(triggerApiUrl, {
    headers: {
      Authorization: `Bearer ${process.env.API_SECRET_TOKEN}`,
    },
    cache: "no-store",
    signal: AbortSignal.timeout(5000), // Set a timeout for the request
  }).catch((error) => {
    console.error(`Error triggering workflow ${workflowId}:`, error);
  });
}
