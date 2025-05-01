import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { TaskType } from "@/types/task";
import { AccordionContent } from "@radix-ui/react-accordion";

const TaskMenu = () => {
  return (
    <aside className="w-[340px] min-w-[340px] border-r-2 border-separate h-full p-2 px-4 overflow-auto">
      <Accordion type="multiple" className="w-full" defaultValue={["extraction"]}>
        <AccordionItem value="extraction">
          <AccordionTrigger className="font-bold">Data extraction</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1 pb-3">
            <TaskMenuBtn taskType={TaskType.PAGE_TO_HTML} />
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
      className="flex justify-start items-center border w-full gap-2"
      draggable
      onDragStart={(event) => {
        ondragstart(event, taskType);
      }}
    >
      <task.icon size={20} />
      {task.label}
    </Button>
  );
};

export default TaskMenu;
