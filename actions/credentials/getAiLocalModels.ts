"use server";

import { ModelsCollection } from "@/types/aiLocalModels";

export async function GetAiLocalModels() {
  try {
    const response = await fetch(`${process.env.OLLAMA_ENDPOINT}/api/tags`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch AI local models: ${response.statusText}`,
      );
    }

    const data: ModelsCollection = await response.json();
    // console.log("Fetched AI local models:", data);
    return data.models; // Assuming the API returns an object with a 'models' array
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default GetAiLocalModels;
