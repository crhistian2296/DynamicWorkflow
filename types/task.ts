export enum TaskType {
  LAUNCH_BROWSER = "LAUNCH_BROWSER",
  PAGE_TO_HTML = "PAGE_TO_HTML",
  EXTRACT_TEXT_FROM_HTML = "EXTRACT_TEXT_FROM_HTML", 
}

export enum TaskParamType {
  STRING = "STRING",
  BROWSER_INSTANCE = "BROWSER_INSTANCE",
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
