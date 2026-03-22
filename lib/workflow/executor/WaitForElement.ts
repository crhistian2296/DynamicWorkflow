import { waitFor } from "@/lib/helper/waitFor";
import { ExecutionEnvironment } from "@/types/executor";
import { WaitForElementTask } from "../task/WaitForElement";

export const WaitForElementExecutor = async (
  environment: ExecutionEnvironment<typeof WaitForElementTask>,
): Promise<boolean> => {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) environment.log.error("Selector is required");

    const visibility = environment.getInput("Visibility");
    if (!visibility) environment.log.error("Visibility is required");

    await waitFor(1000);

    await environment.getPage()!.waitForSelector(selector, {
      visible: visibility === "visible",
      hidden: visibility === "hidden",
    });
    environment.log.info(`Element ${selector} is now ${visibility}`);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};
