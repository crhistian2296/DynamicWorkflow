import { AppNode } from "@/types/appNode";
import { TaskParam, TaskParamType } from "@/types/task";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import StringParam from "./params/StringParam";

const NodeParamField = ({ param, nodeId }: { param: TaskParam; nodeId: string }) => {
  const { updateNodeData, getNode } = useReactFlow();
  const node = getNode(nodeId) as AppNode;
  const value = node?.data?.inputs?.[param.name];

  const updateNodeParamValue = useCallback(
    (newValue: string) => {
      updateNodeData(nodeId, {
        inputs: {
          ...node?.data?.inputs,
          [param.name]: newValue,
        },
      });
    },
    [nodeId, node?.data?.inputs, param.name, updateNodeData]
  );

  switch (param.type) {
    case TaskParamType.STRING:
      return (
        <StringParam param={param} value={value} updateNodeParamValue={updateNodeParamValue} />
      );
    default:
      return (
        <div className="w-full">
          <p className="text-xs text-muted-foreground">Not implemented yet: {param.type}</p>
        </div>
      );
  }
};

export default NodeParamField;
