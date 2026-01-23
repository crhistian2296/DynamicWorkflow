"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavigationTabs = ({ workflowId }: { workflowId: string }) => {
  const pathname = usePathname();
  const activeValue = pathname?.split("/")[2];
  console.log("@@ACTIVE TAB:", activeValue);

  return (
    <Tabs value={activeValue} className="w-[400px]">
      <TabsList className="grid grid-cols-2 w-full ">
        <Link href={`/workflow/editor/${workflowId}`}>
          <TabsTrigger className="w-full" value="editor">
            Editor
          </TabsTrigger>
        </Link>
        <Link href={`/workflow/runs/${workflowId}`}>
          <TabsTrigger className="w-full" value="runs">
            Runs
          </TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  );
};

export default NavigationTabs;
