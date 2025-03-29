"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import React from "react";

interface TooltipWrapperProps {
  text: string;
  children: React.ReactNode;
  delayDuration?: number;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

/**
 * A reusable wrapper component that adds a tooltip to any element
 */
const TooltipWrapper = ({
  text,
  children,
  delayDuration = 0,
  side = "top",
  align = "center",
}: TooltipWrapperProps) => {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align}>
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipWrapper;
