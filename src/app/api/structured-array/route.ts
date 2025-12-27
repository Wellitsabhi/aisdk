import { streamObject } from "ai";
import { groq } from "@ai-sdk/groq";
import { pokemonSchema } from "./schema";

export async function POST(req: Request) {
  try {
    const { type } = await req.json();

    const result = streamObject({
      model: groq("openai/gpt-oss-20b"),
      output: "array",
      schema: pokemonSchema,
      prompt: `Generate a list of 5 ${type} type pokemon`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error generating pokemon:", error);
    return new Response("Failed to generate pokemon", { status: 500 });
  }
}
