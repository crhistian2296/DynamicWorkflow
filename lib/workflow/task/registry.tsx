import { TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflows";
import { AddPropertyFromJsonTask } from "./AddPropertyFromJson";
import { ClickElementTask } from "./ClickElement";
import { DeliverViaWebHookTask } from "./DeliverViaWebHook";
import { ExtractDataWithAiTask } from "./ExtractDataWithAi";
import { ExtractTextFromHtmlTask } from "./ExtracTextFromHtml";
import { FillInputTask } from "./FillInput";
import { LaunchBrowserTask } from "./LaunchBrowser";
import { NavigateToUrlTask } from "./NavigateToUrl";
import { PageToHtmlTask } from "./PageToHtml";
import { ReadPropertyFromJsonTask } from "./ReadPropertyFromJson";
import { ScrollToElementTask } from "./ScrollToElement";
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
  EXTRACT_DATA_WITH_AI: ExtractDataWithAiTask,
  READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonTask,
  ADD_PROPERTY_FROM_JSON: AddPropertyFromJsonTask,
  NAVIGATE_TO_URL: NavigateToUrlTask,
  SCROLL_TO_ELEMENT: ScrollToElementTask,
};
