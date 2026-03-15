"use client";

import { DuplicateWorkflow } from "@/actions/workflows/duplicateWorkflow";
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  duplicateWorkflowSchema,
  duplicateWorkflowSchemaType,
} from "@/schema/workflow";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Layers2Icon, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

const DuplicateWorkflowDialog = ({ workflowId }: { workflowId?: string }) => {
  const [open, setOpen] = useState(false);
  const form = useForm<duplicateWorkflowSchemaType>({
    resolver: zodResolver(duplicateWorkflowSchema),
    defaultValues: { workflowId },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: DuplicateWorkflow,
    onSuccess: () => {
      toast.success("Workflow duplicated successfully", {
        id: "duplicate-workflow",
      });
    },
    onError: () => {
      toast.error("Failed to duplicate workflow", { id: "duplicate-workflow" });
    },
  });

  const onSubmit = useCallback(
    (values: duplicateWorkflowSchemaType) => {
      toast.loading("Duplicating workflow...", { id: "duplicate-workflow" });
      mutate(values);
    },
    [mutate],
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset();
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button>{"duplicate workflow"}</Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          icon={Layers2Icon}
          title="duplicate a new workflow"
          subtitle="Start building your workflow"
        />
        <div className="p-6">
          <FormProvider {...form}>
            <form
              className="space-y-8 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex gap-1 items-center">
                        Name
                        <p className="text-xs text-primary">(required)</p>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Choose a descriptive and unique name for your workflow
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex gap-1 items-center">
                        Name
                        <p className="text-xs text-muted-foreground">
                          (optional)
                        </p>
                      </FormLabel>
                      <FormControl>
                        <Textarea className="resize-none" {...field} />
                      </FormControl>
                      <FormDescription>
                        Provide a brief description of your workflow does.
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "duplicate workflow"
                )}
              </Button>
            </form>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DuplicateWorkflowDialog;
