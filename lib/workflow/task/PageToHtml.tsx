import { TaskParamType, TaskType } from "@/types/task";
import { CodeIcon, LucideProps } from "lucide-react";

export const PageToHtml = {
  type: TaskType.PAGE_TO_HTML,
  label: "Get the Html from a page",
  icon: (props: LucideProps) => <CodeIcon className="stroke-pink-400" {...props} />,
  isEntryPoint: false,
  inputs: [
    {
      name: "Web page",
      type: TaskParamType.STRING,
      required: true,
    },
  ],
};
