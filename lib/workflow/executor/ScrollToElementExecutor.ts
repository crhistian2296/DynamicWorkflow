import { ExecutionEnvironment } from "@/types/executor";
import { ScrollToElementTask } from "../task/ScrollToElement";

export const ScrollToElementExecutor = async (
  environment: ExecutionEnvironment<typeof ScrollToElementTask>,
): Promise<boolean> => {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("Selector is required");
      return false;
    }
    await environment.getPage()!.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (!element)
        throw new Error(`Element with selector "${selector}" not found`);

      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }, selector);

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};
