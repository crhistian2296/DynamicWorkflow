import GetPeriods from "@/actions/analytics/getPeriods";
import { UiPeriod } from "@/types/analytics";
import PeriodSelector from "./PeriodSelector";

const PeriodSelectorWrapper = async ({
  selectedPeriod,
}: {
  selectedPeriod: UiPeriod;
}) => {
  const periods = await GetPeriods();
  return (
    <>
      <PeriodSelector periods={periods} selectedPeriod={selectedPeriod} />
    </>
  );
};

export default PeriodSelectorWrapper;
