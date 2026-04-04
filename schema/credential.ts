import z from "zod";

export const createCredentialSchema = z.object({
  name: z.string().nonempty().max(30),
  value: z.string().nonempty().max(500),
});

export type createCredentialSchemaType = z.infer<typeof createCredentialSchema>;
