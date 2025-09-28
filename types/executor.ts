import { Browser } from "puppeteer";

export type Enviroment = {
  browser?: Browser;
  // Phases with phaseId as key
  phases: {
    [key: string]: {
      inputs: Record<string, string>;
      outputs: Record<string, string>;
    };
  };
};
