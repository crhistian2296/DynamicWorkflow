"use client";

import { DownloadInvoice } from "@/actions/billing/downloadInvoice";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

const InvoiceBtn = ({ id }: { id: string }) => {
  const mutation = useMutation({
    mutationFn: DownloadInvoice,
    onSuccess: (data) => {
      if (data) {
        window.open(data, "_blank");
      }
    },
    onError: (error) => {
      if (error instanceof Error) {
        console.error("Error downloading invoice:", error.message);
      } else {
        toast.error("Failed to download invoice");
        console.error("Error downloading invoice:", error);
      }
    },
  });

  return (
    <Button
      variant={"ghost"}
      size={"sm"}
      className="text-xs gap-2 text-muted-foreground px-1"
      disabled={mutation.isPending}
      onClick={() => mutation.mutate(id)}
    >
      Invoice
      {mutation.isPending && <Loader2Icon className="animate-spin" size={14} />}
    </Button>
  );
};

export default InvoiceBtn;
