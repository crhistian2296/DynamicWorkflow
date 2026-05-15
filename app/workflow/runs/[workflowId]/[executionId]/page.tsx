import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import Topbar from "@/app/workflow/_components/topbbar/Topbar";
import { auth } from "@clerk/nextjs/server";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import ExecutionViewer from "./_components/ExecutionViewer";

const ExecutinViewerPage = ({
  params,
}: {
  params: {
    executionId: string;
    workflowId: string;
  };
}) => {
  const { executionId, workflowId } = params;
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <Topbar
        workflowId={workflowId}
        title="Workflow run details"
        subtitle={`Execution ID: ${executionId}`}
        hideButtons
      />
      <section className="flex h-full overflow-auto">
        <Suspense
          fallback={
            <div>
              <Loader2 className="w-10 h-10 animate-spin stroke-primary" />
            </div>
          }
        >
          <ExecutionViewerWrapper executionId={executionId} />
        </Suspense>
      </section>
    </div>
  );
};

const ExecutionViewerWrapper = async ({
  executionId,
}: {
  executionId: string;
}) => {
  const { userId } = auth();
  if (!userId) return <div>Please log in to view this page.</div>;

  const workflowExecution = await GetWorkflowExecutionWithPhases(executionId);
  if (!workflowExecution) return <div>Workflow execution not found.</div>;
  return <ExecutionViewer initialData={workflowExecution} />;
};
export default ExecutinViewerPage;
