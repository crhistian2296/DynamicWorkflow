import GetPeriods from "@/actions/analytics/getPeriods";
import GetStatsCardsValues from "@/actions/analytics/getStatsCardsValues";
import { waitFor } from "@/lib/helper/waitFor";
import { UiPeriod } from "@/types/analytics";
import { CirclePlayIcon, CoinsIcon, Waypoints } from "lucide-react";
import PeriodSelector from "./PeriodSelector";
import StatsCard from "./StatsCard";

const PeriodSelectorWrapper = async ({
  selectedPeriod,
}: {
  selectedPeriod: UiPeriod;
}) => {
  const periods = await GetPeriods();
  const dateRange = await GetStatsCardsValues(selectedPeriod);
  return (
    <>
      <PeriodSelector periods={periods} selectedPeriod={selectedPeriod} />
      {/* <pre>{JSON.stringify(dateRange, null, 2)}</pre> */}
    </>
  );
};

export async function StatsCards({
  selectedPeriod,
}: {
  selectedPeriod: UiPeriod;
}) {
  await waitFor(5000);
  const data = await GetStatsCardsValues(selectedPeriod);

  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3 min-h-[120px]">
      <StatsCard
        title="Workflow executions"
        value={data.workflowExecutions}
        icon={CirclePlayIcon}
      />
      <StatsCard
        title="Phase executions"
        value={data.phaseExecutions}
        icon={Waypoints}
      />
      <StatsCard
        title="Credits consumed"
        value={data.totalCreditsConsumed}
        icon={CoinsIcon}
      />
    </div>
  );
}

export default PeriodSelectorWrapper;
