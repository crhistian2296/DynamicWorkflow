import TooltipWrapper from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const Topbar = () => {
  const router = useRouter();

  return (
    <header className="flex p-2 border-p-2 border-separate justify-between w-full h-[60px] sticky top-0 bg-background z-10">
      <div className="flex flex-1 gap-1">
        <TooltipWrapper text="Back">
          <Button variant={"ghost"} size={"icon"} onClick={() => router.back()}>
            <ChevronLeftIcon size={20} />
          </Button>
        </TooltipWrapper>
      </div>
    </header>
  );
};

export default Topbar;
