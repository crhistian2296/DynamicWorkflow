import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflows";
import { GlobeIcon, LucideProps } from "lucide-react";

export const LaunchBrowserTask = {
  type: TaskType.LAUNCH_BROWSER,
  label: "Launch Browser",
  icon: (props: LucideProps) => <GlobeIcon className="stroke-pink-400" {...props} />,
  isEntryPoint: true,
  credits: 5,
  inputs: [
    {
      name: "Website url",
      type: TaskParamType.STRING,
      helperText: "The url of the website to scrape",
      required: true,
      hideHandle: true,
    },
  ],
  outputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE,
    },
  ],
} satisfies WorkflowTask;
