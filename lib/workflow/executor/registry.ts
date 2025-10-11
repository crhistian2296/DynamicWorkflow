import { LaunchBrowserExecutor } from "./LaunchBrowserExecutor";

// type ExecutorFn = (environment: ExecutionEnvironment<T>) => Promise<boolean>;

// type RegistryType = {
//   [k in TaskType]: ExecutorFn;
// };

export const ExecutorRegistry = {
  LAUNCH_BROWSER: LaunchBrowserExecutor,
  PAGE_TO_HTML: () => Promise.resolve(true),
  EXTRACT_CONTENT: () => Promise.resolve(true),
};
