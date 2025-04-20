import { TaskParam } from "@/types/task";

const NodeParamField = ({ param }: { param: TaskParam }) => {
  return <div>{param.type}</div>;
};

export default NodeParamField;
