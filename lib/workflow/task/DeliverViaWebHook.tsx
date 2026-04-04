import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflows";
import { Send } from "lucide-react";

export const DeliverViaWebHookTask = {
  type: TaskType.DELIVER_VIA_WEBHOOK,
  label: "Deliver via Webhook",
  icon: (props) => <Send className="stroke-lime-700" {...props} />,
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "Target URL",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Payload",
      type: TaskParamType.STRING,
      required: true,
    },
  ],
  outputs: [],
} satisfies WorkflowTask;
