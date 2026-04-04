import { symmetricDecrypt } from "@/lib/encryption";
import { getAppUrl } from "@/lib/helper/appUrl";
import prisma from "@/lib/prisma";
import { ExecutionEnvironment } from "@/types/executor";
import { ExtractDataWithAiTask } from "../task/ExtractDataWithAi";

export const ExtractDataWithAiExecutor = async (
  environment: ExecutionEnvironment<typeof ExtractDataWithAiTask>,
): Promise<boolean> => {
  try {
    const credentials = environment.getInput("Credentials");
    if (!credentials) environment.log.error("Credentials is required");

    const prompt = environment.getInput("Prompt");
    if (!prompt) environment.log.error("Prompt is required");

    const content = environment.getInput("Content");
    if (!content) environment.log.error("Content is required");

    // Get credentials from DB
    const credential = await prisma.credential.findUnique({
      where: {
        id: credentials,
      },
    });

    if (!credential) {
      environment.log.error("Credential not found");
      return false;
    }

    const plainCredentialValue = symmetricDecrypt(credential.value).trim();
    const credentialName = credential.name;
    if (!plainCredentialValue || !credentialName) {
      environment.log.error(
        "Failed to decrypt credential value or missing credential name",
      );
      return false;
    }

    // console.log("Decrypted Credential Value:", plainCredentialValue);
    // console.log("Credential Name:", credentialName);

    const res = await fetch(getAppUrl("api/chat"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: plainCredentialValue,
        prompt: `${prompt}\n\nContent:\n${content}`,
      }),
    });

    if (!res.ok) {
      environment.log.error(
        `AI request failed: ${res.status} ${res.statusText}`,
      );
      return false;
    }

    const data = await res.json();
    console.log(data.response);

    environment.setOutput(
      "Extracted Data",
      JSON.stringify(data.response, null, 4),
    );

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};
