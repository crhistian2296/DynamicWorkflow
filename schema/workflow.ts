import { z } from "zod";

export const createWorkflowSchema = z.object({
  name: z.string().nonempty().max(50),
  description: z.string().max(80).optional(),
});
