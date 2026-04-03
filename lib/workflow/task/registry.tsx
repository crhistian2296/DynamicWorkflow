import { TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflows";
import { ClickElementTask } from "./ClickElement";
import { DeliverViaWebHookTask } from "./DeliverViaWebHook";
import { ExtractTextFromHtmlTask } from "./ExtracTextFromHtml";
import { FillInputTask } from "./FillInput";
import { LaunchBrowserTask } from "./LaunchBrowser";
import { PageToHtmlTask } from "./PageToHtml";
import { WaitForElementTask } from "./WaitForElement";

type Registry = {
  [K in TaskType]: WorkflowTask & {
    type: K;
  };
};

export const TaskRegistry: Registry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_HTML: ExtractTextFromHtmlTask,
  FILL_INPUT: FillInputTask,
  CLICK_ELEMENT: ClickElementTask,
  WAIT_FOR_ELEMENT: WaitForElementTask,
  DELIVER_VIA_WEBHOOK: DeliverViaWebHookTask,
};
