import { Suspense } from "react";
import CreateWorkflowDialog from "./_components/CreateWorkflowDialog";
import { UserWorkflows, UserWorkflowsSkeleton } from "./_components/Userworkflows";

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

export default page;
