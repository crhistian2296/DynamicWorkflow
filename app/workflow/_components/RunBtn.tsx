"use client";

import { RunWorkflow } from "@/actions/workflows/runWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { PlayIcon } from "lucide-react";
import { toast } from "sonner";

export const RunBtn = ({ workflowId }: { workflowId: string }) => {
  const mutation = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: () => {
      toast.success("Workflow execution started successfully", {
        id: workflowId,
      });
    },
    onError: () => {
      toast.error("Failed to start workflow execution", { id: workflowId });
    },
  });
  return (
    <Button
      variant={"link"}
      className="flex w-[36px] h-[36px] rounded-md bg-muted-50 hover:bg-muted/100 border"
      onClick={() => {
        toast.loading("Starting workflow execution...", { id: workflowId });
        mutation.mutate({ workflowId });
      }}
    >
      <PlayIcon size={16} className="" />
    </Button>
  );
};
