"use client";

import { RunWorkflow } from "@/actions/workflows/runWorkflow";
import useExecutionPlan from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { PlayIcon } from "lucide-react";
import { toast } from "sonner";

const ExecuteBtn = ({ workflowId }: { workflowId: string }) => {
  const generate = useExecutionPlan(workflowId);
  const { toObject } = useReactFlow();
  const mutation = useMutation({
    mutationFn: RunWorkflow,
    onError: (error) => {
      if (error.message?.startsWith("NEXT_REDIRECT")) return;
      toast.error(`Error executing workflow: ${error.message}`, {
        id: "flow-execution-error",
      });
    },
    onSettled: () => {
      toast.success("Workflow execution started successfully", {
        id: workflowId,
      });
    },
  });
  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        toast.loading("Starting workflow execution...", { id: workflowId });
        const executionPlan = generate();
        if (!executionPlan) {
          // Client-side validation failed
          return;
        }

        mutation.mutate({
          workflowId,
          flowDefinition: JSON.stringify(toObject()),
        });
      }}
    >
      <PlayIcon size={16} className="stroke-orange-400" />
      <span>Execute</span>
    </Button>
  );
};

export default ExecuteBtn;
