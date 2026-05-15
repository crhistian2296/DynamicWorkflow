import { ExecutionEnvironment } from "@/types/executor";
import { existsSync, readdirSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";

function resolveChromePath(): string | undefined {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  const cacheDir = join(homedir(), ".cache", "puppeteer", "chrome");
  if (!existsSync(cacheDir)) return undefined;
  const versions = readdirSync(cacheDir)
    .filter(
      (d) =>
        d.startsWith("win64-") ||
        d.startsWith("linux-") ||
        d.startsWith("mac-"),
    )
    .sort()
    .reverse();
  for (const version of versions) {
    const candidates = [
      join(cacheDir, version, "chrome-win64", "chrome.exe"),
      join(cacheDir, version, "chrome-linux64", "chrome"),
      join(
        cacheDir,
        version,
        "chrome-mac-x64",
        "Google Chrome for Testing.app",
        "Contents",
        "MacOS",
        "Google Chrome for Testing",
      ),
    ];
    const found = candidates.find(existsSync);
    if (found) return found;
  }
  return undefined;
}

export const LaunchBrowserExecutor = async (
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>,
): Promise<boolean> => {
  try {
    const websiteUrl = environment.getInput("Website url");
    if (!websiteUrl) {
      environment.log.error("Website URL is required");
      return false;
    }

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: resolveChromePath(),
    });
    environment.log.info(`Launched browser`);
    environment.setBrowser(browser);
    const page = await browser.newPage();
    await page.goto(websiteUrl);
    environment.setPage(page);
    environment.log.info(`Page loaded: ${websiteUrl}`);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};
