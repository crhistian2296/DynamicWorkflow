import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import NodeCard from "./NodeCard";

const NodeComponent = memo(({ id }: NodeProps) => <NodeCard nodeId={id}>AppNode</NodeCard>);

export default NodeComponent;
NodeComponent.displayName = "NodeComponent";
