import {
  FlowToExecutionPlan,
  FlowToExecutionPlanError,
} from "@/lib/workflow/task/executionPlan";
import { AppNode } from "@/types/appNode";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { toast } from "sonner";
import useFlowValidation from "./useFlowValidation";

const useExecutionPlan = (workflowId: string) => {
  const { toObject } = useReactFlow();
  const { setInvalidInputs, clearErrors } = useFlowValidation();

  const handleError = useCallback(
    (error: any) => {
      switch (error.type) {
        case FlowToExecutionPlanError.NO_ENTRY_POINT:
          toast.error("No entry point found in the workflow");
          break;
        case FlowToExecutionPlanError.INVALID_INPUTS:
          toast.error("No entry point found in the workflow");
          setInvalidInputs(error.invalidElements);
          break;
        default:
          toast.error("An unexpected error occurred");
      }
    },
    [setInvalidInputs]
  );

  const generateExecutionPlan = useCallback(() => {
    const { nodes, edges } = toObject();
    const { executionPlan, error } = FlowToExecutionPlan(
      nodes as AppNode[],
      edges
    );

    if (error) {
      handleError(error);
      return null;
    }

    clearErrors();
    return executionPlan;
  }, [toObject, handleError, clearErrors]);
  return generateExecutionPlan;
};

export default useExecutionPlan;
