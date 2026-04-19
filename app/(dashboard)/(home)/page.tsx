import { Skeleton } from "@/components/ui/skeleton";
import { UiPeriod } from "@/types/analytics";
import { Suspense } from "react";
import PeriodSelectorWrapper from "./_components/PeriodSelectorWrapper";

function HomePage({ searchParams }: { searchParams?: UiPeriod }) {
  const currentDate = new Date();
  const period =
    searchParams?.year && searchParams?.month
      ? { year: searchParams.year, month: searchParams.month }
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
      {/* <StatsCard title="Workflow executions" value={123} icon={SomeIcon} /> */}
    </div>
  );
}

export default HomePage;
