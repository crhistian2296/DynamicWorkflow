"use client";

import useExecutionPlan from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";

const ExecuteBtn = ({ workflowId }: { workflowId: string }) => {
  const generate = useExecutionPlan(workflowId);
  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2"
      onClick={() => {
        const executionPlan = generate();
        console.table(executionPlan);
      }}
    >
      <PlayIcon size={16} className="stroke-orange-400" />
      <span>Execute</span>
    </Button>
  );
};

export default ExecuteBtn;
