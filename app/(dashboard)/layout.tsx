"use client";

import BreadcrumbHeader from "@/components/BreadcrumbHeader";
import DesktopSidebar from "@/components/Sidebar";
import { ModeToggle } from "@/components/ThemeModeToggle";
import { Separator } from "@/components/ui/separator";
import { UserButton, useUser } from "@clerk/nextjs";

const layout = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn } = useUser();
  return (
    <div className="flex h-screen">
      <DesktopSidebar />
      <div className="flex flex-col flex-1 min-h-screen">
        <header className="flex items-center justify-between px-6 py-4 h-[50px] containter">
          <BreadcrumbHeader />
          <div className="gap-1 flex items-center">
            <ModeToggle />
            <div className="flex flex-col items-center justify-center h-full ml-2">
              {isSignedIn && <UserButton />}
            </div>
          </div>
        </header>

        <Separator />

        <div className="overflow-auto flex justify-center">
          <div className="flex-1 container py-4 text-accent-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default layout;
