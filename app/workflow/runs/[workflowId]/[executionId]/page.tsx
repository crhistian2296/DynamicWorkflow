import Topbar from "@/app/workflow/_components/topbbar/Topbar";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

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
      <section className="flex h-rfull overflow-auto">
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
  return <div>Wrapper</div>;
};
export default ExecutinViewerPage;
