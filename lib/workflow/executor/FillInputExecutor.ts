import { ExecutionEnvironment } from "@/types/executor";
import { FillInputTask } from "../task/FillInput";

export const FillInputExecutor = async (
  environment: ExecutionEnvironment<typeof FillInputTask>,
): Promise<boolean> => {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) environment.log.error("Selector is required");

    const value = environment.getInput("Value");
    if (!value) environment.log.error("Value is required");

    if (!selector || !value) return false;

    await environment.getPage()!.type(selector, value);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};
