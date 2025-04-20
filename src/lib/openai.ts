import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getChatCompletion(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  temperature: number = 0.7
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
      messages: messages,
      temperature,
    });
    return response.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to fetch response from OpenAI");
  }
}
