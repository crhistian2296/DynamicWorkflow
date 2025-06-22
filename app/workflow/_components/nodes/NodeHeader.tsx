import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";
import { useReactFlow } from "@xyflow/react";
import { CoinsIcon, CopyIcon, GripVerticalIcon, TrashIcon } from "lucide-react";

const NodeHeader = ({ taskType, nodeId }: { taskType: TaskType; nodeId: string }) => {
  const task = TaskRegistry[taskType];
  const { deleteElements, getNode, addNodes } = useReactFlow();

  return (
    <div className="flex items-center gap-2 p-2">
      <task.icon size={16} />
      <div className="flex justify-between items-center w-full">
        <p className="text-xs font-bold uppercase text-muted-foreground">{task.label}</p>
        <div className="flex gap-1 items-center">
          {task.isEntryPoint && <Badge>Entry point</Badge>}
          <Badge className="gap-2 flex items-center text-xs">
            <CoinsIcon size={16} />
            {task.credits}
          </Badge>
          {!task.isEntryPoint && (
            <>
              <Button
                variant={"ghost"}
                size={"icon"}
                className="cursor-pointer"
                onClick={() => {
                  deleteElements({ nodes: [{ id: nodeId }] });
                }}
              >
                <TrashIcon size={12} />
              </Button>
              <Button
                variant={"ghost"}
                size={"icon"}
                className="cursor-pointer"
                onClick={() => {
                  const node = getNode(nodeId) as AppNode;
                  const nodeHeight = node.measured?.height ?? 100; // Default height if not measured

                  // Create a new node below the current one, adjusting the Y position to avoid overlap
                  const newX = node.position.x;
                  const newY = node.position.y + nodeHeight + 50; // Adjust Y position to avoid overlap
                  const newNode = CreateFlowNode(node.data.type, {
                    x: newX,
                    y: newY,
                  });
                  addNodes([newNode]);
                }}
              >
                <CopyIcon size={12} />
              </Button>
            </>
          )}
          <Button variant={"ghost"} size={"icon"} className="drag-handle cursor-grab">
            <GripVerticalIcon size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NodeHeader;
