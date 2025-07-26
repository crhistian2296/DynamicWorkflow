"use client";

import useFlowValidation from "@/components/hooks/useFlowValidation";
import { cn } from "@/lib/utils";
import { useReactFlow } from "@xyflow/react";
import { ReactNode } from "react";

const NodeCard = ({
  children,
  nodeId,
  isSelected,
}: {
  nodeId: string;
  children: ReactNode;
  isSelected: boolean;
}) => {
  const { getNode, setCenter } = useReactFlow();
  const { invalidInputs } = useFlowValidation();
  const hasInvalidInputs = invalidInputs.some((node) => node.nodeId === nodeId);

  const handleDoubleClick = () => {
    const node = getNode(nodeId);
    if (!node) return;

    const { position, measured } = node;
    if (!position || !measured) return;

    let { x, y } = position;
    if (!x === undefined || !y === undefined) return;

    const { width, height } = measured;
    if (!width || !height) return;

    // center the node
    x = x + width / 2;
    y = y + width / 2;

    setCenter(x, y, {
      zoom: 1,
      duration: 500,
    });
  };

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className={cn(
        "rounded-md cursor-pointer bg-background border-2 border-separate w-[420px] text-xs gap-1 flex flex-col",
        isSelected && "border-primary",
        hasInvalidInputs && "border-destructive border-2"
      )}
    >
      {children}
    </div>
  );
};

export default NodeCard;
