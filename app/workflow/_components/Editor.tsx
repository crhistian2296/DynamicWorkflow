"use client";

import { FlowValidationContextProvider } from "@/components/context/FlowValidationContext";
import { Workflow } from "@prisma/client";
import { ReactFlowProvider } from "@xyflow/react";
import FlowEditor from "./FlowEditor";
import TaskMenu from "./topbbar/TaskMenu";
import Topbar from "./topbbar/Topbar";

const Editor = ({ workflow }: { workflow: Workflow }) => {
  return (
    <FlowValidationContextProvider>
      <ReactFlowProvider>
        <div className="flex flex-col h-full w-full overflow-hidden">
          <Topbar
            title="Workflow Editor"
            subtitle="test"
            workflowId={workflow.id}
            isPublished={workflow.status === "PUBLISHED"}
          />
          <section className="flex h-full overflow-auto">
            <TaskMenu />
            <FlowEditor workflow={workflow} />
          </section>
        </div>
      </ReactFlowProvider>
    </FlowValidationContextProvider>
  );
};

export default Editor;
