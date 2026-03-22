"use client";

import TooltipWrapper from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Workflow } from "@prisma/client";
import { CopyIcon, MoreVerticalIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import DeleteWorkflowDialog from "./DeleteWorkflowDialog";
import DuplicateWorkflowDialog from "./DuplicateWorkflowDialog";

interface WorkflowActionsProps {
  workflow: Workflow;
}

export function WorkflowActions({ workflow }: WorkflowActionsProps) {
  const [state, setState] = useState({
    isOpen: false,
    showDeleteDialog: false,
    showDuplicateDialog: false,
  });

  const { showDeleteDialog, showDuplicateDialog } = state;
  const handleOpenDeleteDialog = (newValue: boolean) =>
    setState((prev) => ({ ...prev, showDeleteDialog: newValue }));
  const handleOpenDuplicateDialog = (newValue: boolean) =>
    setState((prev) => ({ ...prev, showDuplicateDialog: newValue }));

  return (
    <>
      <DeleteWorkflowDialog
        open={showDeleteDialog}
        setOpen={handleOpenDeleteDialog}
        workflowName={workflow.name}
        workflowId={workflow.id}
      />
      <DuplicateWorkflowDialog
        open={showDuplicateDialog}
        setOpen={handleOpenDuplicateDialog}
        workflowId={workflow.id}
      />
      <DropdownMenu
        open={state.isOpen}
        onOpenChange={(isOpen) => setState((prev) => ({ ...prev, isOpen }))}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="ml-1 w-[36px] h-[36px] p-0"
          >
            <TooltipWrapper text="More actions" delayDuration={0}>
              <div className="flex items-center justify-center w-full h-full p-2">
                <MoreVerticalIcon size={16} />
              </div>
            </TooltipWrapper>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-destructive focus:text-destructive cursor-pointer"
            onSelect={() =>
              setState((prev) => ({
                ...prev,
                showDeleteDialog: !prev.showDeleteDialog,
              }))
            }
          >
            <Trash2Icon className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() =>
              setState((prev) => ({
                ...prev,
                showDuplicateDialog: !prev.showDuplicateDialog,
              }))
            }
          >
            <CopyIcon className="mr-2 h-4 w-4" />
            Duplicate
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
