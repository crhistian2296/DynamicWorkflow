import { cn } from "@/lib/utils";
import { TaskParam } from "@/types/task";
import { Handle, Position } from "@xyflow/react";
import { ReactNode } from "react";
import NodeParamField from "./NodeParamField";

export const NodeInputs = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col divide-y gap-2">{children}</div>;
};

export const NodeInput = ({ input }: { input: TaskParam }) => {
  return (
    <div className="flex justify-start relative p-3 bg-secondary w-full">
      {/* <pre>{JSON.stringify(input, null, 4)}</pre> */}
      <NodeParamField param={input} />
      {!input.hideHandle && (
        <Handle
          id={input.name}
          type={"target"}
          position={Position.Left}
          className={cn("!bg-muted-foreground !border-2 !border-background !-left-2 !w-4 !h-4")}
        />
      )}
    </div>
  );
};
