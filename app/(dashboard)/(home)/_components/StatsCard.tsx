"use client";

import GetStatsCardsValues from "@/actions/analytics/getStatsCardsValues";
import ReactCountUpWrapper from "@/components/ReactCountUpWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UiPeriod } from "@/types/analytics";
import { useQuery } from "@tanstack/react-query";
import { CirclePlayIcon, CoinsIcon, LucideIcon, Waypoints } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
}

export function StatsCards({ selectedPeriod }: { selectedPeriod: UiPeriod }) {
  const { data } = useQuery({
    queryKey: ["stats-cards-values", selectedPeriod],
    queryFn: async () => GetStatsCardsValues(selectedPeriod),
    enabled: !!selectedPeriod,
    refetchInterval: 10000, // Refetch stats cards values every 10 seconds in case there are new workflow executions
  });

  return (
    <div className="grid gap-3 lg:gap-5 lg:grid-cols-3">
      <StatsCard
        title="Workflow executions"
        value={data?.workflowExecutions ?? 0}
        icon={CirclePlayIcon}
      />
      <StatsCard
        title="Phase executions"
        value={data?.phaseExecutions ?? 0}
        icon={Waypoints}
      />
      <StatsCard
        title="Credits consumed"
        value={data?.totalCreditsConsumed ?? 0}
        icon={CoinsIcon}
      />
    </div>
  );
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
}: StatsCardProps) {
  return (
    <Card className="relative overflow-hidden w-full h-[120px]">
      <CardHeader className="flex pb-2">
        <CardTitle>{title}</CardTitle>
        <Icon
          size={120}
          className="text-muted-foreground absolute -bottom-4 -right-8 stroke-primary opacity-10"
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">
          <ReactCountUpWrapper value={value}></ReactCountUpWrapper>
        </div>
      </CardContent>
    </Card>
  );
}
