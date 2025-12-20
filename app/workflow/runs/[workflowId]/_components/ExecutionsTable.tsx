"use client";

import { GetWorkflowExecutions } from "@/actions/workflows/getWorkflowExecutions";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

type InitialData = Awaited<ReturnType<typeof GetWorkflowExecutions>>;

const ExecutionsTable = ({
  workflowId,
  initialData,
}: {
  workflowId: string;
  initialData: InitialData;
}) => {
  const query = useQuery({
    queryKey: ["executions", workflowId],
    initialData,
    queryFn: () => GetWorkflowExecutions(workflowId),
    refetchInterval: 5 * 1000, // Refetch every 5 seconds
    staleTime: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const executions = useMemo(() => query.data, [query.data]);

  return <pre>{JSON.stringify(executions, null, 2)}</pre>;
};

export default ExecutionsTable;
