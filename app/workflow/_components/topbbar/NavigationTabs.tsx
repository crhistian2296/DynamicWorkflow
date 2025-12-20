"use client";

import { Tabs, TabsList } from "@/components/ui/tabs";
import Link from "next/link";

const NavigationTabs = ({ workflowId }: { workflowId: string }) => {
  return (
    <Tabs className="w-[400px]">
      <TabsList className="grid grid-cols-2 w-full ">
        <Link href={`/workflow/editor/${workflowId}`}>Editor</Link>
        <Link href={`/workflow/runs/${workflowId}`}>Runs</Link>
      </TabsList>
    </Tabs>
  );
};

export default NavigationTabs;
