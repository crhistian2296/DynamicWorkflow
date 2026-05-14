import { ExecutionEnvironment } from "@/types/executor";
import { AddPropertyFromJsonTask } from "../task/AddPropertyFromJson";

export const AddPropertyFromJsonExecutor = async (
  environment: ExecutionEnvironment<typeof AddPropertyFromJsonTask>,
): Promise<boolean> => {
  try {
    const json = environment.getInput("JSON");
    if (!json) environment.log.error("JSON is required");
    const propertyName = environment.getInput("Property name");
    if (!propertyName) environment.log.error("Property name is required");
    const propertyValue = environment.getInput("Property value");
    if (!propertyValue) environment.log.error("Property value is required");

    const parsedJson = JSON.parse(json);

    // console.log("Parsed JSON type:", typeof parsedJson);
    // console.log("raw JSON:", json);
    // console.log("Parsed JSON:", parsedJson);
    // console.log(
    //   `Extracted ${propertyName} ${parsedJson[propertyName]}:`,
    //   propertyValue,
    // );
    const updatedJson = { ...parsedJson, [propertyName]: propertyValue };

    environment.setOutput("Updated JSON", JSON.stringify(updatedJson));
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};
