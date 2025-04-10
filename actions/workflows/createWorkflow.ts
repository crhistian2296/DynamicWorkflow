"use server";

import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/worflows";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createWorkflowSchema, createWorkflowSchemaType } from "../../schema/workflow";

export const CreateWorkflow = async (form: createWorkflowSchemaType) => {
  const { success, data } = createWorkflowSchema.safeParse(form);
  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const result = await prisma.workflow.create({
    data: {
      userId,
      status: WorkflowStatus.DRAFT,
      definition: "TODO",
      ...data,
    },
  });

  if (!result) {
    throw new Error("Failed to create workflow");
  }

  redirect(`/workflows/editor/${result.id}`);
};
