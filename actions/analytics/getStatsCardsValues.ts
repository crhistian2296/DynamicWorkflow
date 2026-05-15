"use server";

import { PeriodToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { UiPeriod } from "@/types/analytics";
import { WorkflowExecutionStatus } from "@/types/workflows";
import { auth } from "@clerk/nextjs/server";

const { COMPLETED, FAILED } = WorkflowExecutionStatus;

const GetStatsCardsValues = async (period: UiPeriod) => {
  const { userId } = await auth.protect();
  if (!userId) throw new Error("Unauthorized");

  const dateRange = PeriodToDateRange(period);

  const executions = await prisma.workflowExecution.findMany({
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
    select: {
      creditsConsumed: true,
      phases: {
        where: {
          creditsConsumed: {
            not: null,
          },
        },
      },
    },
  });

  const stats = {
    workflowExecutions: executions.length,
    totalCreditsConsumed: executions.reduce(
      (acc, exec) => acc + (exec.creditsConsumed || 0),
      0,
    ),
    phaseExecutions: executions.reduce(
      (acc, exec) => acc + (exec.phases?.length || 0),
      0,
    ),
  };

  return stats;
};

export default GetStatsCardsValues;
