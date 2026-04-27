"use client";
import GetWorkflowExecutionStats from "@/actions/analytics/getWorkflowExecutionStats";
import ExecutionStatusChart from "./ExecutionStatusChart";

const ExecutionsStats = ({
  data,
}: {
  data: Awaited<ReturnType<typeof GetWorkflowExecutionStats>>;
}) => {
  return <ExecutionStatusChart data={data} />;
};

export default ExecutionsStats;
