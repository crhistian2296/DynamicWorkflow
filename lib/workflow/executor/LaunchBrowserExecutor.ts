import { waitFor } from "@/lib/helper/waitFor";
import { Enviroment } from "@/types/executor";
import puppeteer from "puppeteer";

export const LaunchBrowserExecutor = async (
  enviroment: Enviroment
): Promise<boolean> => {
  try {
    console.log("@@ENV", enviroment);
    const browser = await puppeteer.launch({ headless: false });
    await waitFor(5000);
    await browser.close();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
