"use server";

import { PeriodToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { UiPeriod } from "@/types/analytics";
import { WorkflowExecutionStatus } from "@/types/workflows";
import { auth } from "@clerk/nextjs/server";
import { eachDayOfInterval, formatDate } from "date-fns";

export type Stats = Record<string, { success: number; failed: number }>;

async function GetWorkflowExecutionStats(selectedPeriod: UiPeriod) {
  const { userId } = await auth.protect();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const dateRange = PeriodToDateRange(selectedPeriod);
  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
    },
  });

  const dateFormat = "yyyy-MM-dd";

  const stats: Stats = eachDayOfInterval({
    start: dateRange.startDate,
    end: dateRange.endDate,
  })
    .map((date) => formatDate(date, dateFormat))
    .reduce((acc, date) => {
      acc[date] = {
        success: 0,
        failed: 0,
      };
      return acc;
    }, {} as Stats);

  executions.forEach((execution) => {
    const date = formatDate(execution.startedAt!, dateFormat);
    if (execution.status === WorkflowExecutionStatus.COMPLETED) {
      stats[date].success += 1;
    } else if (execution.status === WorkflowExecutionStatus.FAILED) {
      stats[date].failed += 1;
    }
  });

  const result = Object.entries(stats).map(([date, counts]) => ({
    date,
    ...counts,
  }));

  return result;
}

export default GetWorkflowExecutionStats;
