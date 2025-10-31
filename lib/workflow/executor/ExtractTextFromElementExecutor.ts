import { ExtractTextFromHtmlTask } from "@/lib/workflow/task/ExtracTextFromHtml";
import { ExecutionEnvironment } from "@/types/executor";
import * as cheerio from "cheerio";

export const ExtractTextFromElementExecutor = async (
  environment: ExecutionEnvironment<typeof ExtractTextFromHtmlTask>
): Promise<boolean> => {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      console.error("Selector not defined");
      return false;
    }

    const html = environment.getInput("Html");
    if (!html) {
      console.error("No HTML provided");
      return false;
    }

    const $ = cheerio.load(html);
    const element = $(selector);

    if (!element) {
      console.error("Element not no found");
      return false;
    }

    const extractedText = $.text(element);
    if (!extractedText || extractedText.trim() === "") {
      console.error("Element has no text");
      return false;
    }

    environment.setOutput("Extracted Text", extractedText);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
