"use client";

import { ReactNode } from "react";

const NodeCard = ({ children, nodeId }: { nodeId: string; children: ReactNode }) => {
  return <div>{children}</div>;
};

export default NodeCard;
