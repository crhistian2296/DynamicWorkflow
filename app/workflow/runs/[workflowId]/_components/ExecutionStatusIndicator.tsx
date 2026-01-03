import { cn } from "@/lib/utils";
import { WorkflowExecutionStatus } from "@/types/workflows";

const indicatorColors: Record<WorkflowExecutionStatus, string> = {
  [WorkflowExecutionStatus.PENDING]: "bg-slate-400",
  [WorkflowExecutionStatus.RUNNING]: "bg-yellow-400",
  [WorkflowExecutionStatus.COMPLETED]: "bg-emerald-400",
  [WorkflowExecutionStatus.FAILED]: "bg-red-600",
};

const ExecutionStatusIndicator = ({
  status,
}: {
  status: WorkflowExecutionStatus;
}) => {
  return (
    <div className={cn("w-2 h-2 rounded-full", indicatorColors[status])}></div>
  );
};

export default ExecutionStatusIndicator;
