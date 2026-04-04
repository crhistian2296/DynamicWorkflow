"use client";

import { DeleteCredential } from "@/actions/credentials/deleteCredentials";
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
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  credentialId: string;
}

const DeleteCredentialDialog = ({
  open,
  setOpen,
  name,
  credentialId,
}: Props) => {
  const queryClient = useQueryClient();
  const [confirmText, setConfirmText] = useState("");
  const deleteMutation = useMutation({
    mutationFn: DeleteCredential,
    onSuccess: () => {
      toast.success("Credential deleted successfully", { id: credentialId });
      queryClient.invalidateQueries({ queryKey: ["credentials"] });
      setConfirmText("");
    },
    onError: () => {
      toast.error("Something went wrong", { id: credentialId });
    },
    onSettled: () => {
      setOpen(false);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"}>Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete credential</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          If you delete this credential, it will be permanently deleted. This
          action cannot be undone.
          <div className="flex flex-col py-4 gap-2">
            <p>
              If you are sure, enter <b>{name}</b> to confirm.
            </p>
            <Input
              value={confirmText}
              onChange={(state) => setConfirmText(state.target.value)}
              placeholder="Confirm"
            />
          </div>
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmText("")}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={confirmText !== name || deleteMutation.isPending}
            className="bg-destructive hover:bg-red-700"
            onClick={(e) => {
              e.preventDefault();
              deleteMutation.mutate(credentialId);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCredentialDialog;
