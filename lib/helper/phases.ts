import { ExecutionPhase } from "@prisma/client";

type Phase = Pick<ExecutionPhase, "creditsConsumed">;
export const GetPhasesTotalCost = (phases: Phase[]) => {
  return phases.reduce(
    (total, phase) => total + (phase.creditsConsumed || 0),
    0
  );
};
