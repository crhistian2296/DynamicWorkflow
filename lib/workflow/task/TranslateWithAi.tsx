import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflows";
import { LanguagesIcon } from "lucide-react";

export const TranslateWithAiTask = {
  type: TaskType.TRANSLATE_WITH_AI,
  label: "Translate with AI",
  icon: (props) => <LanguagesIcon className="stroke-blue-400" {...props} />,
  isEntryPoint: false,
  credits: 2,
  inputs: [
    {
      name: "Text",
      type: TaskParamType.STRING,
      required: true,
      variant: "textarea",
    },
    {
      name: "Source Language",
      type: TaskParamType.STRING,
      required: true,
      helperText: "e.g. English, Spanish, French",
    },
    {
      name: "Target Language",
      type: TaskParamType.STRING,
      required: true,
      helperText: "e.g. English, Spanish, French",
    },
  ],
  outputs: [
    {
      name: "Translated Text",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;
