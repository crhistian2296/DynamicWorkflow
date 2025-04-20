export enum TaskType {
  LAUNCH_BROWSER = "LAUNCH_BROWSER",
}

export enum TaskParamType {
  STRING = "STRING",
  NUMBER = "NUMBER",
  BOOLEAN = "BOOLEAN",
}

export interface TaskParam {
  name: string;
  type: TaskParamType;
  required?: boolean;
  hideHandle?: boolean;
  helperText?: string;
  value?: string;
  [key: string]: any;
}
