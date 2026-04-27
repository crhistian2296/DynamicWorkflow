import GetWorkflowExecutionStats from "@/actions/analytics/getWorkflowExecutionStats";
import { UiPeriod } from "@/types/analytics";
import ExecutionsStats from "./ExecutionsStats";

const ExecutionsStatsWrapper = async ({
  selectedPeriod,
}: {
  selectedPeriod: UiPeriod;
}) => {
  const data = await GetWorkflowExecutionStats(selectedPeriod);
  return <ExecutionsStats data={data} />;
};

export default ExecutionsStatsWrapper;
