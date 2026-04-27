"use client";

import GetWorkflowExecutionStats from "@/actions/analytics/getWorkflowExecutionStats";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Layers2Icon } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

type ChartDataType = Awaited<ReturnType<typeof GetWorkflowExecutionStats>>;
const chartConfig = {
  success: {
    label: "Success",
    color: "hsl(var(--chart-2))", // Tailwind's green-400
    // color: "#4ade80", // Tailwind's green-400
  },
  failed: {
    label: "Failed",
    color: "hsl(var(--chart-3))", // Tailwind's red-400
    // color: "#f87171", // Tailwind's red-400
  },
};

const ExecutionStatusChart = ({ data }: { data: ChartDataType }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <Layers2Icon className="w-6 h-6 text-primary" />
          Workflow Execution Status
        </CardTitle>
        <CardDescription>
          Daily execution status of your workflows, including success and
          failure rates.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* <pre>{JSON.stringify(data, null, 4)}</pre> */}
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            data={data}
            height={200}
            accessibilityLayer
            margin={{ top: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="date"
              minTickGap={32}
              tickLine={false}
              tickMargin={8}
              tickFormatter={(date) => {
                const d = new Date(date);
                return d.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip
              content={<ChartTooltipContent className="w-[250px]" />}
            />
            <Area
              dataKey="failed"
              min={0}
              opacity={0.6}
              type={"bump"}
              stroke={chartConfig.failed.color}
              fill={chartConfig.failed.color}
              stackId={"a"}
            />
            <Area
              dataKey="success"
              min={0}
              opacity={0.6}
              type={"bump"}
              stroke={chartConfig.success.color}
              fill={chartConfig.success.color}
              stackId={"a"}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ExecutionStatusChart;
