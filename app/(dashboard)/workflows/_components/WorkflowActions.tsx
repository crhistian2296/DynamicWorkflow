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
import { MoreVerticalIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

interface WorkflowActionsProps {
  workflow: Workflow;
}

export function WorkflowActions({ workflow }: WorkflowActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    // TODO: Implement delete functionality
    // This would typically call a server action to delete the workflow
    console.log(`Delete workflow: ${workflow.id}`);

    // Close the dropdown after action
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-1 p-0">
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
          onClick={handleDelete}
        >
          <Trash2Icon className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
