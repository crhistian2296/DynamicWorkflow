"use client";

import { GetWorkflowsForUser } from "@/actions/workflows/getWorkflowsForUser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, InboxIcon } from "lucide-react";
import CreateWorkflowDialog from "./CreateWorkflowDialog";
import { WorkflowCard } from "./WorkflowCard";

export const UserWorkflowsSkeleton = () => {
  const arr = [1, 2, 3, 4, 5];
  return (
    <div className="space-y-2">
      {arr.map((i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  );
};

export const UserWorkflows = async () => {
  try {
    const workflows = await GetWorkflowsForUser();

    if (workflows.length === 0) {
      return (
        <div className="flex flex-col gap-4 h-full items-center justify-center">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
            <InboxIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold">No workflows created yet</p>
            <p className="text-sm text-muted-foregroud">
              Click the button below to create your first workflow
            </p>
          </div>
          <CreateWorkflowDialog triggerText="Create your first workflow" />
        </div>
      );
    }

    return (
      <div className="space-y">
        <div className="grid grid-cols-1 gap-4">
          {workflows.map((workflow) => (
            <WorkflowCard key={workflow.id} workflow={workflow} />
          ))}
        </div>
      </div>
    );
  } catch (error: any) {
    return (
      <Alert variant={"destructive"}>
        <AlertCircle className="w-4 h-4 mr-2" />
        <AlertTitle>No workflows found</AlertTitle>
        <AlertDescription>
          {error.message || "An error occurred while fetching workflows"}
        </AlertDescription>
      </Alert>
    );
  }
};
