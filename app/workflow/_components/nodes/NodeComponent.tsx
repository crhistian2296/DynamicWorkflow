import { AppNodeData } from "@/types/appNode";
import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import NodeCard from "./NodeCard";
import NodeHeader from "./NodeHeader";

const NodeComponent = ({ id, selected, data }: NodeProps) => {
  const nodeData = data as AppNodeData;

  return (
    <NodeCard nodeId={id} isSelected={selected ?? false}>
      <NodeHeader taskType={nodeData.type} />
    </NodeCard>
  );
};

NodeComponent.displayName = "NodeComponent";
export default memo(NodeComponent);
