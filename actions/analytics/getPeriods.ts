"use server";

import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { auth } from "@clerk/nextjs/server";

const GetPeriods = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const years = await prisma.workflowExecution.aggregate({
    where: { userId },
    _min: { startedAt: true },
  });

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // getMonth is 0-indexed

  // The very first execution determines the minimum year we can show in the selector. If there are no executions, we default to the current year.
  const minYear = years._min.startedAt
    ? new Date(years._min.startedAt).getFullYear()
    : currentYear;
  const periods: Period[] = [];

  for (let year = minYear; year <= currentYear; year++) {
    for (let month = 0; month < currentMonth; month++) {
      periods.push({
        label: `${new Date(year, month).toLocaleString("default", {
          month: "long",
        })} ${year}`,
        value: `${year}-${(month + 1).toString().padStart(2, "0")}`,
      });
    }
  }

  return periods;
};

export default GetPeriods;
