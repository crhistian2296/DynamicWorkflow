import { ExecutionEnvironment } from "@/types/executor";
import chromium from "@sparticuz/chromium";
import { existsSync, mkdtempSync, readdirSync } from "fs";
import { homedir, tmpdir } from "os";
import { join } from "path";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";

function resolveLocalChromePath(): string | undefined {
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
    .sort((a, b) => {
      const versionOf = (s: string) => s.replace(/^[^-]+-/, "");
      const av = versionOf(a).split(".").map(Number);
      const bv = versionOf(b).split(".").map(Number);
      for (let i = 0; i < Math.max(av.length, bv.length); i++) {
        const diff = (bv[i] ?? 0) - (av[i] ?? 0);
        if (diff !== 0) return diff;
      }
      return 0;
    });
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
      join(
        cacheDir,
        version,
        "chrome-mac-arm64",
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

    const localPath = resolveLocalChromePath();
    const executablePath = localPath ?? (await chromium.executablePath());
    const baseArgs = localPath ? [] : chromium.args;
    // Use --user-data-dir as a Chrome arg (not the puppeteer option) so Puppeteer's
    // lock-file mechanism is bypassed. mkdtempSync guarantees a fresh directory with
    // no existing lock, preventing the "browser already running" error on dev-server
    // restarts where the previous Chrome process was not cleanly shut down.
    const userDataDir = mkdtempSync(join(tmpdir(), "pw_profile-"));
    const launchArgs = [
      ...baseArgs,
      `--user-data-dir=${userDataDir}`,
      "--no-first-run",
      "--disable-default-apps",
    ];

    const browser = await puppeteer.launch({
      args: launchArgs,
      executablePath,
      headless: true,
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
