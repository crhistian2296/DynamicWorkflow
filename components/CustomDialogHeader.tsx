"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { DialogHeader, DialogTitle } from "./ui/dialog";
import { Separator } from "./ui/separator";

interface Props {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;

  titleClassName?: string;
  subtitleClassName?: string;
  iconClassName?: string;
}

const CustomDialogHeader = ({
  title,
  subtitle,
  icon: Icon,
  titleClassName,
  subtitleClassName,
  iconClassName,
}: Props) => {
  return (
    <DialogHeader className="py-6">
      <DialogTitle asChild>
        <div className="flex flex-col items-center gap-2 mb-2">
          {Icon && <Icon className={cn("stroke-primary", iconClassName)} />}
          {title && <p className={cn("text-xl text-primary", titleClassName)}>{title}</p>}
          {subtitle && (
            <p className={cn("text-sm text-muted-foreground", subtitleClassName)}>{subtitle}</p>
          )}
        </div>
      </DialogTitle>
      <Separator />
    </DialogHeader>
  );
};

export default CustomDialogHeader;
