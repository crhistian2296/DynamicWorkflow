import { ExecutionEnvironment } from "@/types/executor";
import { DeliverViaWebHookTask } from "../task/DeliverViaWebHook";

export const DeliverViaWebHookExecutor = async (
  environment: ExecutionEnvironment<typeof DeliverViaWebHookTask>,
): Promise<boolean> => {
  try {
    const targetUrl = environment.getInput("Target URL");
    if (!targetUrl) environment.log.error("Target URL is required");

    const payload = environment.getInput("Payload");
    if (!payload) environment.log.error("Payload is required");

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      environment.log.error(
        `Failed to deliver payload. Status: ${response.status}`,
      );
      return false;
    }

    const data = await response.json();
    environment.log.info(
      `Payload delivered successfully. Response: ${JSON.stringify(data)}`,
    );

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};
