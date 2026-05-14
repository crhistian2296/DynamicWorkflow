import GetCreditUsageInPeriod from "@/actions/analytics/getCreditUsageInPeriod";
import { UiPeriod } from "@/types/analytics";
import CreditsUsageChart from "./CreditsUsageChart";

const CreditUsageCard = async () => {
  const month = (new Date().getMonth() + 1).toString().padStart(2, "0");
  const year = new Date().getFullYear().toString();
  const period: UiPeriod = {
    month,
    year,
  };
  const data = await GetCreditUsageInPeriod(period);

  return (
    <CreditsUsageChart
      data={data}
      title="Credits consumed"
      description="Credits consumed in the selected period"
    />
  );
};

export default CreditUsageCard;
