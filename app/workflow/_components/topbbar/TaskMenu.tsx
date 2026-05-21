import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { TaskType } from "@/types/task";
import { AccordionContent } from "@radix-ui/react-accordion";
import { CoinsIcon } from "lucide-react";

const TaskMenu = () => {
  return (
    <aside className="w-[340px] min-w-[340px] border-r-2 border-separate h-full p-2 px-4 overflow-auto">
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={[
          "interaction",
          "extraction",
          "storage",
          "timing",
          "results",
        ]}
      >
        <AccordionItem value="interaction">
          <AccordionTrigger className="font-bold">
            User interaction
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1 pb-3">
            <TaskMenuBtn taskType={TaskType.NAVIGATE_TO_URL} />
            <TaskMenuBtn taskType={TaskType.FILL_INPUT} />
            <TaskMenuBtn taskType={TaskType.CLICK_ELEMENT} />
            <TaskMenuBtn taskType={TaskType.SCROLL_TO_ELEMENT} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="extraction">
          <AccordionTrigger className="font-bold">
            Data extraction
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1 pb-3">
            <TaskMenuBtn taskType={TaskType.PAGE_TO_HTML} />
            <TaskMenuBtn taskType={TaskType.EXTRACT_TEXT_FROM_HTML} />
            <TaskMenuBtn taskType={TaskType.EXTRACT_DATA_WITH_AI} />
            <TaskMenuBtn taskType={TaskType.TRANSLATE_WITH_AI} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="storage">
          <AccordionTrigger className="font-bold">Storage</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1 pb-3">
            <TaskMenuBtn taskType={TaskType.READ_PROPERTY_FROM_JSON} />
            <TaskMenuBtn taskType={TaskType.ADD_PROPERTY_FROM_JSON} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="timing">
          <AccordionTrigger className="font-bold">
            Timing and flow control
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1 pb-3">
            <TaskMenuBtn taskType={TaskType.WAIT_FOR_ELEMENT} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="results">
          <AccordionTrigger className="font-bold">
            Results delivery
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1 pb-3">
            <TaskMenuBtn taskType={TaskType.DELIVER_VIA_WEBHOOK} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
};

const TaskMenuBtn = ({ taskType }: { taskType: TaskType }) => {
  const task = TaskRegistry[taskType];

  const ondragstart = (event: React.DragEvent, type: TaskType) => {
    event.dataTransfer.setData("application/reactflow", type);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Button
      variant={"secondary"}
      className="flex justify-between items-center border w-full gap-2"
      draggable
      onDragStart={(event) => {
        ondragstart(event, taskType);
      }}
    >
      <task.icon size={20} />
      {task.label}
      <Badge className="gap-1 flex items-center" variant={"outline"}>
        <CoinsIcon size={16} />
        {task.credits}
      </Badge>
    </Button>
  );
};

export default TaskMenu;
