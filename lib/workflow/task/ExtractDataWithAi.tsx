import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflows";
import { BrainIcon } from "lucide-react";

export const ExtractDataWithAiTask = {
  type: TaskType.EXTRACT_DATA_WITH_AI,
  label: "Extract Data with AI",
  icon: (props) => <BrainIcon className="stroke-pink-400" {...props} />,
  isEntryPoint: false,
  credits: 4,
  inputs: [
    {
      name: "Content",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Credentials",
      type: TaskParamType.CREDENTIAL,
      required: true,
    },
    {
      name: "Prompt",
      type: TaskParamType.STRING,
      required: true,
      variant: "textarea",
    },
  ],
  outputs: [
    {
      name: "Extracted Data",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;
