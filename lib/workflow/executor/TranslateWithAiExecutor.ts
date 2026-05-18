import { ExecutionEnvironment } from "@/types/executor";
import nim from "@api/nim";
import { TranslateWithAiTask } from "../task/TranslateWithAi";

export const TranslateWithAiExecutor = async (
  environment: ExecutionEnvironment<typeof TranslateWithAiTask>,
): Promise<boolean> => {
  try {
    const text = environment.getInput("Text");
    if (!text) {
      environment.log.error("Text input is required");
      return false;
    }

    const sourceLang = environment.getInput("Source Language");
    if (!sourceLang) {
      environment.log.error("Source Language input is required");
      return false;
    }

    const targetLang = environment.getInput("Target Language");
    if (!targetLang) {
      environment.log.error("Target Language input is required");
      return false;
    }

    const apiKey = process.env.NIM_API_KEY;
    if (!apiKey) {
      environment.log.error("NIM_API_KEY environment variable is not set");
      return false;
    }

    nim.auth(apiKey);

    const response = await nim.create_chat_completion_v1_chat_completions_post({
      model: "nvidia/riva-translate-4b-instruct-v1.1",
      messages: [
        {
          role: "user",
          content: `Translate the following text from ${sourceLang} to ${targetLang}. Return only the translated text, without explanations or notes.\n\n${text}`,
        },
      ],
      temperature: 0,
      max_tokens: 1024,
      stream: false,
    });

    const result = response.data as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const translated = result?.choices?.[0]?.message?.content;

    if (!translated) {
      environment.log.error("No translation returned from the API");
      return false;
    }

    environment.setOutput("Translated Text", translated.trim());

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};
