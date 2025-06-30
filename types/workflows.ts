import { LucideProps } from "lucide-react";
import { AppNode } from "./appNode";
import { TaskParam, TaskType } from "./task";
export enum WorkflowStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export type WorkflowTask = {
  label: string;
  icon: React.FC<LucideProps>;
  type: TaskType;
  isEntryPoint?: boolean;
  inputs: TaskParam[];
  outputs: TaskParam[];
  credits: number;
};

export type WordflowExecutionPlan = {
  phase: number;
  nodes: AppNode[];
};
