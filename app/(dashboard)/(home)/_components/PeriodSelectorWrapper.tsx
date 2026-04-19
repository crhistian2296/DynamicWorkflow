import GetPeriods from "@/actions/analytics/getPeriods";
import GetStatsCardsValues from "@/actions/analytics/getStatsCardsValues";
import { UiPeriod } from "@/types/analytics";
import PeriodSelector from "./PeriodSelector";

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
      <pre>{JSON.stringify(dateRange, null, 2)}</pre>
    </>
  );
};

async function StatsCards({ selectedPeriod }: { selectedPeriod: UiPeriod }) {}

export default PeriodSelectorWrapper;
