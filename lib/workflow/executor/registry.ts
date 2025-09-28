import { LaunchBrowserExecutor } from "./LaunchBrowserExecutor";

export const ExecutorRegistry = {
  LAUNCH_BROWSER: LaunchBrowserExecutor,
  PAGE_TO_HTML: () => Promise.resolve(true),
  EXTRACT_CONTENT: () => Promise.resolve(true),
};
