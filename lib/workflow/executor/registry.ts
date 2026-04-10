import { ExecutionEnvironment } from "@/types/executor";
import { TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflows";
import { AddPropertyFromJsonExecutor } from "./AddPropertyFromJsonExecutor";
import { ClickElementExecutor } from "./ClickElementExecutor";
import { DeliverViaWebHookExecutor } from "./DeliverViaWebhookExecutor";
import { ExtractDataWithAiExecutor } from "./ExtrackDataWithAiExecutor";
import { ExtractTextFromElementExecutor } from "./ExtractTextFromElementExecutor";
import { FillInputExecutor } from "./FillInputExecutor";
import { LaunchBrowserExecutor } from "./LaunchBrowserExecutor";
import { NavigateToUrlExecutor } from "./NavigateToUrlExecutor";
import { PageToHtmlExecutor } from "./PageToHtmlExecutor";
import { ReadPropertyFromJsonExecutor } from "./ReadPropertyFromJsonExecutor";
import { ScrollToElementExecutor } from "./ScrollToElementExecutor";
import { WaitForElementExecutor } from "./WaitForElement";

type ExecutorFn<T extends WorkflowTask> = (
  environment: ExecutionEnvironment<T>,
) => Promise<boolean>;

type RegistryType = {
  [k in TaskType]: ExecutorFn<WorkflowTask & { type: k }>;
};

export const ExecutorRegistry: RegistryType = {
  LAUNCH_BROWSER: LaunchBrowserExecutor,
  PAGE_TO_HTML: PageToHtmlExecutor,
  EXTRACT_TEXT_FROM_HTML: ExtractTextFromElementExecutor,
  FILL_INPUT: FillInputExecutor,
  CLICK_ELEMENT: ClickElementExecutor,
  WAIT_FOR_ELEMENT: WaitForElementExecutor,
  DELIVER_VIA_WEBHOOK: DeliverViaWebHookExecutor,
  EXTRACT_DATA_WITH_AI: ExtractDataWithAiExecutor,
  READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonExecutor,
  ADD_PROPERTY_FROM_JSON: AddPropertyFromJsonExecutor,
  NAVIGATE_TO_URL: NavigateToUrlExecutor,
  SCROLL_TO_ELEMENT: ScrollToElementExecutor,
};
