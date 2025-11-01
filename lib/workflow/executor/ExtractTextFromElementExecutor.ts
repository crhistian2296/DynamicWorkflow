import { ExtractTextFromHtmlTask } from "@/lib/workflow/task/ExtracTextFromHtml";
import { ExecutionEnvironment } from "@/types/executor";
import * as cheerio from "cheerio";

export const ExtractTextFromElementExecutor = async (
  environment: ExecutionEnvironment<typeof ExtractTextFromHtmlTask>
): Promise<boolean> => {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("Selector not defined");
      return false;
    }

    const html = environment.getInput("Html");
    if (!html) {
      environment.log.error("No HTML provided");
      return false;
    }

    const $ = cheerio.load(html);
    const element = $(selector);

    if (!element) {
      environment.log.error("Element not found");
      return false;
    }

    const extractedText = $.text(element);
    if (!extractedText || extractedText.trim() === "") {
      environment.log.error("Element has no text");
      return false;
    }

    environment.setOutput("Extracted Text", extractedText);

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};
