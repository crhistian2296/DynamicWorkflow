import { waitFor } from "@/lib/helper/waitFor";
import { ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";

export const LaunchBrowserExecutor = async (
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> => {
  try {
    console.log("@@ENV", JSON.stringify(environment, null, 4));
    const websiteUrl = environment.getInput("Website url");
    console.log("@@WEB URL", websiteUrl);
    const browser = await puppeteer.launch({ headless: false });
    await waitFor(5000);
    await browser.close();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
