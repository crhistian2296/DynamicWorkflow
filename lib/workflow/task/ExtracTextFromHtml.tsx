import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflows";
import { LucideProps, TextIcon } from "lucide-react";

export const ExtractTextFromHtmlTask = {
  type: TaskType.EXTRACT_TEXT_FROM_HTML,
  label: "Extract text from Html",
  icon: (props: LucideProps) => <TextIcon className="stroke-orange-400" {...props} />,
  isEntryPoint: false,
  credits: 2,
  inputs: [
    {
      name: "Html",
      type: TaskParamType.STRING,
      required: true,
      variant: "textarea",
    },
    {
      name: "Selector",
      type: TaskParamType.STRING,
      required: true,
    },
  ],
  outputs: [
    {
      name: "Extracted Text",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;
