import { Workflow } from "@prisma/client";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useViewport,
} from "@xyflow/react";

import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect } from "react";
import NodeComponent from "./nodes/NodeComponent";

const nodeTypes = {
  FlowScrapeNode: NodeComponent,
};

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = {
  padding: 1,
};

const FlowEditor = ({ workflow }: { workflow: Workflow }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgsChange] = useEdgesState([]);
  const { x, y, zoom } = useViewport();
  const { setViewport, screenToFlowPosition } = useReactFlow();

  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.definition);
      if (!flow) return;

      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);

      if (!x || !y || !zoom) return;

      setViewport({
        x,
        y,
        zoom,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error parsing workflow definition: " + error.message);
      }
      throw new Error("Error parsing workflow definition: Unknown error");
    }
  }, [workflow.definition, setNodes, setEdges, setViewport, x, y, zoom]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const taskType = event.dataTransfer.getData("application/reactflow");
      if (typeof taskType === undefined || !taskType) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = CreateFlowNode(taskType as TaskType, position);
      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes, screenToFlowPosition]
  );

  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgsChange}
        nodeTypes={nodeTypes}
        snapToGrid
        snapGrid={snapGrid}
        fitView
        fitViewOptions={fitViewOptions}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  );
};

export default FlowEditor;
