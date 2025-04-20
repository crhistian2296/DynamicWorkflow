import { TaskRegistry } from "@/lib/workflow/task/registry";
import { AppNodeData } from "@/types/appNode";
import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import NodeCard from "./NodeCard";
import NodeHeader from "./NodeHeader";
import { NodeInput, NodeInputs } from "./NodeInputs";

const NodeComponent = ({ id, selected, data }: NodeProps) => {
  const nodeData = data as AppNodeData;
  const task = TaskRegistry[nodeData.type];

  return (
    <NodeCard nodeId={id} isSelected={selected ?? false}>
      <NodeHeader taskType={nodeData.type} />
      <NodeInputs>
        {task.inputs.map((input) => (
          <NodeInput key={input.name} input={input} nodeId={id} />
        ))}
      </NodeInputs>
    </NodeCard>
  );
};

NodeComponent.displayName = "NodeComponent";
export default memo(NodeComponent);
