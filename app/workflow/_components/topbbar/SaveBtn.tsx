import { UpdateWorkflow } from "@/actions/workflows/updateWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { LoaderCircleIcon, SaveIcon } from "lucide-react";
import { toast } from "sonner";

const SaveBtn = ({ workflowId }: { workflowId: string }) => {
  const { toObject } = useReactFlow();
  const saveMutation = useMutation({
    mutationFn: UpdateWorkflow,
    onSuccess: () => {
      toast.success("Workflow saved successfully", { id: "save-workflow" });
    },
    onError: (error) => {
      toast.error("Error saving workflow", { id: "save-workflow" });
    },
  });

  return (
    <Button
      variant={"outline"}
      disabled={saveMutation.isPending}
      onClick={() => {
        const workflowDefinition = JSON.stringify(toObject());
        console.log(workflowDefinition);
        toast.loading("Saving workflow...", { id: "save-workflow" });
        saveMutation.mutate({ id: workflowId, definition: workflowDefinition });
      }}
    >
      <span>Save</span>
      <span className="relative overflow-hidden h-5 w-5">
        <SaveIcon
          className={`absolute inset-0.5 h-5 w-5 transition-opacity duration-300 ease-in-out ${
            !saveMutation.isPending ? "opacity-100" : "opacity-0"
          }`}
        />
        <LoaderCircleIcon
          className={`animate-spin absolute inset-0.5 h-5 w-5 transition-all duration-500 ease-in-out ${
            saveMutation.isPending ? "opacity-100" : "opacity-0"
          }`}
        />
      </span>
    </Button>
  );
};

export default SaveBtn;
