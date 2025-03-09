import { GetWorkflowsForUser } from "@/actions/workflows/getWorkflowsForUser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, InboxIcon } from "lucide-react";
import { Suspense } from "react";
import CreateWorkflowDialog from "./_components/createWorkflowDialog";

const page = () => {
  return (
    <div className="flex-1 flex flex-col g-full">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">Manage your workflows</p>
        </div>
        <CreateWorkflowDialog />
      </div>

      <div className="h-full py-6">
        <Suspense fallback={<UserWorkflowsSkeleton />}>
          <UserWorkflows></UserWorkflows>
        </Suspense>
      </div>
    </div>
  );
};

const UserWorkflowsSkeleton = () => {
  const arr = [1, 2, 3, 4, 5];
  return (
    <div className="space-y-2">
      {arr.map((i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  );
};

const UserWorkflows = async () => {
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

    return <div className="space-y">UserWorkflow</div>;
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

export default page;
