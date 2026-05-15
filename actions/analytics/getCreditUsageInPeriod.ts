"use server";

import { PeriodToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { UiPeriod } from "@/types/analytics";
import { ExecutionPhaseStatus } from "@/types/workflows";
import { auth } from "@clerk/nextjs/server";
import { eachDayOfInterval, formatDate } from "date-fns";

export type Stats = Record<string, { success: number; failed: number }>;

const { COMPLETED, FAILED } = ExecutionPhaseStatus;

async function GetCreditUsageInPeriod(selectedPeriod: UiPeriod) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const dateRange = PeriodToDateRange(selectedPeriod);
  const executionPhases = await prisma.executionPhase.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
      status: {
        in: [COMPLETED, FAILED],
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

  executionPhases.forEach((phase) => {
    const date = formatDate(phase.startedAt!, dateFormat);
    if (phase.status === ExecutionPhaseStatus.COMPLETED) {
      stats[date].success += phase.creditsConsumed || 0;
    } else if (phase.status === ExecutionPhaseStatus.FAILED) {
      stats[date].failed += phase.creditsConsumed || 0;
    }
  });

  const result = Object.entries(stats).map(([date, counts]) => ({
    date,
    ...counts,
  }));

  return result;
}

export default GetCreditUsageInPeriod;
