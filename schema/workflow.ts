import { z } from "zod";

export const createWorkflowSchema = z.object({
  name: z.string().nonempty().max(50),
  description: z.string().max(80).optional(),
});

export const duplicateWorkflowSchema = createWorkflowSchema.extend({
  workflowId: z.string().nonempty(),
});

export type createWorkflowSchemaType = z.infer<typeof createWorkflowSchema>;
export type duplicateWorkflowSchemaType = z.infer<
  typeof duplicateWorkflowSchema
>;
