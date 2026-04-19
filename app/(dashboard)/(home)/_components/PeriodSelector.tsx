"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Period, UiPeriod } from "@/types/analytics";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  periods: Period[];
  selectedPeriod: UiPeriod;
}

const PeriodSelector = ({ periods, selectedPeriod }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  return (
    <Select
      value={`${selectedPeriod.year}-${selectedPeriod.month}`}
      onValueChange={(value) => {
        const [year, month] = value.split("-");
        const params = new URLSearchParams(searchParams);
        params.set("year", year);
        params.set("month", month);
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        router.push(newUrl);
      }}
    >
      <SelectTrigger className="w-[200px] capitalize">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {periods.map((period) => (
          <SelectItem
            key={period.value}
            value={period.value}
            className="capitalize"
          >
            {period.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PeriodSelector;
