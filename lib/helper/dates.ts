import { intervalToDuration } from "date-fns";

export const DatesDatesToDurationString = (
  start: Date | null | undefined,
  end: Date | null | undefined
) => {
  if (!start || !end) return null;

  const timeElapsed = end.getTime() - start.getTime();
  if (timeElapsed < 0) return "Invalid duration";
  if (timeElapsed < 1000) return `${timeElapsed}ms`;

  const duration = intervalToDuration({ start: 0, end: timeElapsed });
  const { minutes, seconds } = duration;
  return `${minutes || 0}m ${seconds || 0}s`;
  // const seconds = Math.floor((duration / 1000) % 60);
  // const minutes = Math.floor((duration / (1000 * 60)) % 60);
  // const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  // return `${hours}h ${minutes}m ${seconds}s`;
};
