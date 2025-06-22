import { TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflows";
import { ExtractTextFromHtmlTask } from "./ExtracTextFromHtml";
import { LaunchBrowserTask } from "./LaunchBrowser";
import { PageToHtmlTask } from "./PageToHtml";

type Registry = {
  [K in TaskType]: WorkflowTask & {
    type: K;
  };
};

export const TaskRegistry: Registry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_HTML: ExtractTextFromHtmlTask,
};
