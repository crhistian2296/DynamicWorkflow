"use-client";

import { CoinsIcon, HomeIcon, Layers2Icon, ShieldCheckIcon } from "lucide-react";
import Logo from "./Logo";

const routes = [
  {
    href: "",
    lable: "Home",
    icon: HomeIcon,
  },
  {
    href: "workflows",
    lable: "Workflows",
    icon: Layers2Icon,
  },
  {
    href: "credentials",
    lable: "Credentials",
    icon: ShieldCheckIcon,
  },
  {
    href: "billing",
    lable: "Billing",
    icon: CoinsIcon,
  },
];

const DesktopSidebar = () => {
  return (
    <div className="hidden relative md:block min-w-[280px] max-w-[280px] h-screen overflow-hidden w-full bg-primary/5 dark:bg-secondary/30 dark:text-foreground text-muted-foreground border-r-2 border-separare">
      <div className="flex items-center justify-center gap-2 border-b-[1px] border-separate p-4">
        <Logo />
      </div>
    </div>
  );
};

export default DesktopSidebar;
