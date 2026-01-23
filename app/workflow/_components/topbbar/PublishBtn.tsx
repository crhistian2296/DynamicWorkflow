"use client";

import { PublishWorkflow } from "@/actions/workflows/publishWorkflow";
import useExecutionPlan from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { UploadIcon } from "lucide-react";
import { toast } from "sonner";

const PublishBtn = ({ workflowId }: { workflowId: string }) => {
  const generate = useExecutionPlan(workflowId);
  const { toObject } = useReactFlow();
  const mutation = useMutation({
    mutationFn: PublishWorkflow,
    onSuccess: () =>
      toast.success("Workflow published successfully", { id: workflowId }),
    onError: (error) => {
      toast.error("Error publishing workflow", {
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
        const executionPlan = generate();
        if (!executionPlan) {
          // Client-side validation failed
          return;
        }

        toast.loading("Publishing workflow...", { id: workflowId });
        mutation.mutate({
          id: workflowId,
          flowDefinition: JSON.stringify(toObject()),
        });
      }}
    >
      <UploadIcon size={16} className="stroke-green-400" />
      <span>Publish</span>
    </Button>
  );
};

export default PublishBtn;
