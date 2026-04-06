import { symmetricDecrypt } from "@/lib/encryption";
import { getAppUrl } from "@/lib/helper/appUrl";
import prisma from "@/lib/prisma";
import { ExecutionEnvironment } from "@/types/executor";
import { ExtractDataWithAiTask } from "../task/ExtractDataWithAi";

export const ExtractDataWithAiExecutor = async (
  environment: ExecutionEnvironment<typeof ExtractDataWithAiTask>,
): Promise<boolean> => {
  try {
    const credentials = environment.getInput("API keys and AI local models");
    if (!credentials) environment.log.error("Credentials is required");

    const prompt = environment.getInput("Prompt");
    if (!prompt) environment.log.error("Prompt is required");

    const content = environment.getInput("Content");
    if (!content) environment.log.error("Content is required");

    let credential: { name: string; value: string } | null = null;
    let llm: string = "";
    const isLocalModel = credentials.endsWith("(local model)");
    const isApiKey = credentials.endsWith("(api key)");

    // Get credentials from DB if it's not a local model, otherwise assign the local model name to llm
    if (!isLocalModel) {
      credential = await prisma.credential.findUnique({
        where: {
          id: credentials,
        },
      });
    } else {
      // llm = credentials.replace(" (local model)", "").trim();
      const llmNameLength = credentials.length - " (local model)".length;
      llm = credentials.substring(0, llmNameLength).trim();
    }

    if (!credential && !llm) {
      environment.log.error("Credential not found");
      return false;
    }

    // Asign llm model name or decrypted credential (it can be an API key or a local model name)
    let plainCredentialValue;
    let credentialName;

    if (isApiKey) {
      plainCredentialValue = symmetricDecrypt(credential!.value).trim();
      credentialName = credential!.name;
    }

    if (isApiKey && (!plainCredentialValue || !credentialName)) {
      environment.log.error(
        "Failed to decrypt credential value or missing credential name",
      );
      return false;
    } else if (isLocalModel && !llm) {
      environment.log.error("Local model name is missing");
      return false;
    }

    let res: Response;
    let options: RequestInit;

    if (isLocalModel) {
      options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: llm,
          prompt,
          content,
        }),
      };
    } else if (isApiKey) {
      options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${plainCredentialValue}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          prompt,
          content,
        }),
      };
    }

    res = await fetch(getAppUrl("api/chat"), options!);

    if (!res.ok) {
      environment.log.error(
        `AI request failed: ${res.status} ${res.statusText}`,
      );
      return false;
    }

    const data = await res.json();
    // console.log(data.response);

    environment.setOutput(
      "Extracted Data",
      JSON.stringify(JSON.parse(data.response)),
    );

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};
