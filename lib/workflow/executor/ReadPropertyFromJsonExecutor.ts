import { ExecutionEnvironment } from "@/types/executor";
import { ReadPropertyFromJsonTask } from "../task/ReadPropertyFromJson";

export const ReadPropertyFromJsonExecutor = async (
  environment: ExecutionEnvironment<typeof ReadPropertyFromJsonTask>,
): Promise<boolean> => {
  try {
    const json = environment.getInput("JSON");
    const propertyName = environment.getInput("Property name");
    if (!json) environment.log.error("JSON is required");
    if (!propertyName) environment.log.error("Property name is required");

    const parsedJson = JSON.parse(json);
    const propertyValue = parsedJson[propertyName];

    console.log("Parsed JSON type:", typeof parsedJson);
    console.log("raw JSON:", json);
    console.log("Parsed JSON:", parsedJson);
    console.log(
      `Extracted ${propertyName} ${parsedJson[propertyName]}:`,
      propertyValue,
    );

    if (propertyValue === undefined) {
      environment.log.error(`Property "${propertyName}" not found in JSON`);
      return false;
    }

    environment.setOutput("Property value", propertyValue);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};
