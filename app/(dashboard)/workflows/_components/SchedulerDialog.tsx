"use client";

import { removeWorkflowSchedule } from "@/actions/workflows/removeWorkflowSchedule";
import { UpdateWorkflowCron } from "@/actions/workflows/updateWorkflowCron";
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
import { useMutation } from "@tanstack/react-query";
import CronExpressionParser from "cron-parser";
import cronstrue from "cronstrue";
import { CalendarIcon, ClockIcon, TriangleAlertIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function SchedulerDialog({
  workflowId,
  cronValue,
}: {
  workflowId: string;
  cronValue?: string | null;
}) {
  const initialValidCron = cronValue && cronValue.length > 0;
  const initialReadableCron = initialValidCron
    ? cronstrue.toString(cronValue!)
    : "";

  const [cron, setCron] = useState(cronValue ?? "");
  const [validCron, setValidCron] = useState(initialValidCron);
  const [readableCron, setReadableCron] = useState(initialReadableCron);

  const mutation = useMutation({
    mutationFn: UpdateWorkflowCron,
    onSuccess: () => {
      toast.success("scheduler updated successfully", {
        id: "update-scheduler",
      });
    },
    onError: () => {
      toast.error("Error updating scheduler", { id: "update-scheduler" });
    },
  });

  const removeScheduleMutation = useMutation({
    mutationFn: removeWorkflowSchedule,
    onSuccess: () => {
      toast.success("scheduler removed successfully", {
        id: "remove-scheduler",
      });
    },
    onError: () => {
      toast.error("Error removing scheduler", { id: "remove-scheduler" });
    },
  });

  useEffect(() => {
    try {
      CronExpressionParser.parse(cron, { tz: "UTC" });
      const humanCronStr = cronstrue.toString(cron);
      setReadableCron(humanCronStr);
      setValidCron(true);
    } catch (error) {
      setValidCron(false);
      setReadableCron("");
    }
  }, [cron]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          size="sm"
          type="button"
          className={cn(
            "text-sm p-0 h-auto text-primary",
            !validCron && "text-orange-500",
          )}
        >
          <div className="flex items-center gap-1 text-xs">
            {!validCron && (
              <>
                <TriangleAlertIcon className="h-4 w-4 mr-1" /> Set schedule
              </>
            )}
            {validCron && (
              <>
                <ClockIcon className="h-4 w-4 text-primary" />
                {readableCron}
              </>
            )}
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
          {/* Cron Input */}
          <Input
            placeholder="Enter cron expression"
            value={cron}
            onChange={(e) => setCron(e.target.value)}
          />
          {/* Cron Validation */}
          <div
            className={cn(
              "rounded-md py-2 px-3 border text-sm",
              !validCron
                ? "border-destructive text-destructive"
                : "border-primary text-primary",
            )}
          >
            {!validCron
              ? "Please enter a valid cron expression."
              : readableCron}
          </div>
          {true && (
            <DialogClose asChild>
              <div>
                <Button
                  className="w-full text-destructive border-destructive hover:text-destructive"
                  variant={"outline"}
                  disabled={
                    mutation.isPending || removeScheduleMutation.isPending
                  }
                  onClick={() => {
                    toast.loading("Removing scheduler...", {
                      id: "remove-scheduler",
                    });
                    removeScheduleMutation.mutate(workflowId);
                    setCron("");
                  }}
                >
                  Remove Schedule
                </Button>
              </div>
            </DialogClose>
          )}
        </div>
        <DialogFooter className={cn("w-full xs:gap-0 gap-2 px-6")}>
          <DialogClose asChild>
            <Button
              className="w-full"
              variant={"secondary"}
              type="button"
              onClick={() => setCron(cronValue ?? "")}
            >
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className={cn("w-full")}
              disabled={mutation.isPending || !validCron}
              variant={"default"}
              type="button"
              onClick={() => {
                toast.loading("Updating scheduler...", {
                  id: "update-scheduler",
                });
                mutation.mutate({ id: workflowId, cron });
              }}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SchedulerDialog;
