import { Skeleton } from "@/components/ui/skeleton";
import { UiPeriod } from "@/types/analytics";
import { Suspense } from "react";
import CreditsUsageInPeriodWrapper from "./_components/CreditsUsageInPeriodWrapper";
import ExecutionsStatsWrapper from "./_components/ExecutionsStatsWrapper";
import PeriodSelectorWrapper from "./_components/PeriodSelectorWrapper";
import { StatsCards } from "./_components/StatsCard";

async function HomePage({ searchParams }: { searchParams?: Promise<UiPeriod> }) {
  const resolvedParams = await searchParams;
  const currentDate = new Date();
  const period: UiPeriod =
    resolvedParams?.year && resolvedParams?.month
      ? { year: resolvedParams.year, month: resolvedParams.month }
      : {
          year: currentDate.getFullYear().toString(),
          month: (currentDate.getMonth() + 1).toString().padStart(2, "0"),
        };

  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Home</h1>
        <Suspense fallback={<Skeleton className="w-[200px] h-10" />}>
          <PeriodSelectorWrapper selectedPeriod={period} />
        </Suspense>
      </div>
      <div className="h-full py-6 flex flex-col gap-4">
        <Suspense fallback={<StatsCardsSkeleton />}>
          <StatsCards selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <ExecutionsStatsWrapper selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <CreditsUsageInPeriodWrapper selectedPeriod={period} />
        </Suspense>
      </div>
    </div>
  );
}

function StatsCardsSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-3 w-full">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="w-full h-[113.6px]" />
      ))}
    </div>
  );
}

export default HomePage;
