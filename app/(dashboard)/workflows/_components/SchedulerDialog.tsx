"use client";

import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CalendarIcon, TriangleAlertIcon } from "lucide-react";

function SchedulerDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          size="sm"
          type="button"
          className={cn("text-sm p-0 h-auto")}
        >
          <div className="flex items-center gap-1">
            <TriangleAlertIcon className="h-4 w-4 mr-1" />
            Set schedule
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0 rounded-lg">
        <CustomDialogHeader
          title="Schedule workflow execution"
          icon={CalendarIcon}
        />
        <div className="p-6 space-y-4">
          <p className="text-muted-foreground text-sm">
            Specify a cron expression to schedule periodic workflow execution.
            All times are in UTC. For example, &quot;0 0 * * *&quot; will run
            the workflow every day at midnight UTC.
          </p>
          <Input placeholder="Enter cron expression" />
        </div>
        <DialogFooter className={cn("w-full xs:gap-0 gap-2 px-6")}>
          <DialogClose asChild>
            <Button className="w-full" variant={"secondary"} type="button">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button className={cn("w-full")} variant={"default"} type="button">
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SchedulerDialog;
