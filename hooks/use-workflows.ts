import { GetWorkflowsForUser } from "@/actions/workflows/getWorkflowsForUser";
import { useQuery } from "@tanstack/react-query";

export function useWorkflows() {
  return useQuery({
    queryKey: ["workflows"],
    queryFn: async () => {
      try {
        const result = await GetWorkflowsForUser();
        return result;
      } catch (error) {
        throw error;
      }
    },
  });
}
