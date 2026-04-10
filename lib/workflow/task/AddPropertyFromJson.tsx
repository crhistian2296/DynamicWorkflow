import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflows";
import { DatabaseIcon } from "lucide-react";

export const AddPropertyFromJsonTask = {
  type: TaskType.ADD_PROPERTY_FROM_JSON,
  label: "Add Property From JSON",
  icon: (props) => <DatabaseIcon className="stroke-orange-400" {...props} />,
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "JSON",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Property name",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Property value",
      type: TaskParamType.STRING,
      required: true,
    },
  ],
  outputs: [
    {
      name: "Updated JSON",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;
