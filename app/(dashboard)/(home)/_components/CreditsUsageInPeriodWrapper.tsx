import getCreditUsageInPeriod from "@/actions/analytics/getCreditUsageInPeriod";
import { UiPeriod } from "@/types/analytics";
import CreditsUsageChart from "../../billing/_components/CreditsUsageChart";

const CreditsUsageInPeriodWrapper = async ({
  selectedPeriod,
}: {
  selectedPeriod: UiPeriod;
}) => {
  const data = await getCreditUsageInPeriod(selectedPeriod);

  // return <pre>{JSON.stringify(data, null, 4)}</pre>;
  return (
    <CreditsUsageChart
      data={data}
      title="Credits Usage in Period"
      description="This chart shows the total credits used in the selected period. It helps you understand your credit consumption patterns and manage your usage effectively."
    />
  );
};

export default CreditsUsageInPeriodWrapper;
