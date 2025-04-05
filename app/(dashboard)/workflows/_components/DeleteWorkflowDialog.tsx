"use client";

import { DeleteWorkflow } from "@/actions/workflows/deleteWorlkflow";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  workflowName: string;
  workflowId: string;
}

const DeleteWorkflowDialog = ({ open, setOpen, workflowName, workflowId }: Props) => {
  const [confirmText, setConfirmText] = useState("");
  const deleteMutation = useMutation({
    mutationFn: DeleteWorkflow,
    onSuccess: () => {
      toast.success("Workflow deleted successfully", { id: workflowId });
      setConfirmText("");
    },
    onError: () => {
      toast.error("Something went wrong", { id: workflowId });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete workflow</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          If you delete this workflow, it will be permanently deleted. This action cannot be undone.
          <div className="flex flex-col py-4 gap-2">
            <p>
              If you are sure, enter <b>{workflowName}</b> to confirm.
            </p>
            <Input
              value={confirmText}
              onChange={(state) => setConfirmText(state.target.value)}
              placeholder="Confirm"
            />
          </div>
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmText("")}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={confirmText !== workflowName || deleteMutation.isPending}
            className="bg-destructive hover:bg-red-700"
            onClick={(e) => {
              e.preventDefault();
              deleteMutation.mutate(workflowId);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteWorkflowDialog;
