"use client";

import { UnpublishWorkflow } from "@/actions/workflows/unpublishWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { DownloadIcon } from "lucide-react";
import { toast } from "sonner";

const UnpublishBtn = ({ workflowId }: { workflowId: string }) => {
  const mutation = useMutation({
    mutationFn: UnpublishWorkflow,
    onSuccess: () =>
      toast.success("Workflow unpublished successfully", { id: workflowId }),
    onError: (error) => {
      toast.error("Error unpublishing workflow", {
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
        toast.loading("Unpublishing workflow...", { id: workflowId });
        mutation.mutate({
          id: workflowId,
        });
      }}
    >
      <DownloadIcon size={16} className="stroke-orange-500" />
      <span>Unpublish</span>
    </Button>
  );
};

export default UnpublishBtn;
