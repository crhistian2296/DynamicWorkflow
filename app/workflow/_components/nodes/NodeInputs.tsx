import { cn } from "@/lib/utils";
import { TaskParam } from "@/types/task";
import { Handle, Position, useEdges } from "@xyflow/react";
import { ReactNode } from "react";
import NodeParamField from "./NodeParamField";
import { ColorForHandle } from "./common";
import useFlowValidation from "@/components/hooks/useFlowValidation";

export const NodeInputs = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col divide-y gap-2">{children}</div>;
};

export const NodeInput = ({
  input,
  nodeId,
}: {
  input: TaskParam;
  nodeId: string;
}) => {
  const { invalidInputs } = useFlowValidation();
  const edges = useEdges();
  const hasErrors = invalidInputs.some(
    (node) => node.nodeId === nodeId && node.inputs.includes(input.name)
  );

  const isConccented = edges.some(
    (edge) => edge.target === nodeId && edge.targetHandle === input.name
  );
  return (
    <div
      className={cn(
        "flex justify-start relative p-3 bg-secondary w-full",
        hasErrors && "bg-destructive/30"
      )}
    >
      {/* <pre>{JSON.stringify(input, null, 4)}</pre> */}
      <NodeParamField param={input} nodeId={nodeId} disabled={isConccented} />
      {!input.hideHandle && (
        <Handle
          id={input.name}
          isConnectable={!isConccented}
          type={"target"}
          position={Position.Left}
          className={cn(
            "!bg-muted-foreground !border-2 !border-background !-left-2 !w-4 !h-4",
            ColorForHandle[input.type]
          )}
        />
      )}
    </div>
  );
};
