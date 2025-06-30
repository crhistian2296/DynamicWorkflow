"use client";

import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";

const ExecuteBtn = ({ workflowId }: { workflowId: string }) => {
  return (
    <Button variant={"outline"} className="flex items-center gap-2">
      <PlayIcon size={16} className="stroke-orange-400" />
      <span>Execute</span>
    </Button>
  );
};

export default ExecuteBtn;
