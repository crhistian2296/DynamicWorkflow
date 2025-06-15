import { Workflow } from "@prisma/client";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  getOutgoers,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useViewport,
} from "@xyflow/react";

import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect } from "react";
import { DeletableEdge } from "./edges/DeletableEdge";
import NodeComponent from "./nodes/NodeComponent";

const nodeTypes = {
  FlowScrapeNode: NodeComponent,
};

const edgeTypes = {
  default: DeletableEdge,
};

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = {
  padding: 1,
};

const FlowEditor = ({ workflow }: { workflow: Workflow }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgsChange] = useEdgesState<Edge>([]);
  const { x, y, zoom } = useViewport();
  const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();

  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.definition);
      if (!flow) return;

      setNodes(flow.nodes ?? []);
      setEdges(flow.edges ?? []);

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

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
      if (!connection.targetHandle) return;

      const node = nodes.find((n) => n.id === connection.target);
      if (!node) return;

      const nodeInputs = node.data.inputs;
      // updateNodeData(node.id, {
      //   inputs: { ...nodeInputs, [connection.targetHandle]: "" },
      // });

      delete nodeInputs[connection.targetHandle];
      updateNodeData(node.id, {
        inputs: nodeInputs,
      });
    },
    [setEdges, nodes, updateNodeData]
  );

  const isValidConnection = useCallback(
    (connection: Edge | Connection) => {
      try {
        // No self-connections
        if (connection.source === connection.target)
          throw new Error("Self-connections are not allowed");

        // Same task type connections
        const source = nodes.find((n) => n.id === connection.source);
        const target = nodes.find((n) => n.id === connection.target);
        if (!source || !target) throw new Error("Source or target node not found");
        const souceTaskType = TaskRegistry[source.data.type];
        const targetTaskType = TaskRegistry[target.data.type];

        const output = souceTaskType.outputs.find(
          (output: any) => output.name === connection.sourceHandle
        );
        const input = targetTaskType.inputs.find(
          (input: any) => input.name === connection.targetHandle
        );

        if (input?.type !== output?.type)
          throw new Error(
            `${source.data.type} output type ${output?.type} does not match ${target.data.type} input type ${input?.type}`
          );

        // Prevent cycle connections
        const hasCycle = (node: AppNode, visited = new Set()) => {
          if (visited.has(node.id)) return false;

          visited.add(node.id);

          for (const outgoer of getOutgoers(node, nodes, edges)) {
            if (outgoer.id === connection.source) return true;
            if (hasCycle(outgoer, visited)) return true;
          }
        };

        if (hasCycle(target))
          throw new Error(`Cycle detected from ${target.data.type} to ${source.data.type}`);
        return true;
      } catch (error) {
        if (error instanceof Error) console.error("Invalid connection error:", error.message);
        return false;
      }
    },
    [nodes]
  );

  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgsChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid
        snapGrid={snapGrid}
        fitView
        fitViewOptions={fitViewOptions}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  );
};

export default FlowEditor;
