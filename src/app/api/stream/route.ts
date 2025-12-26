import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const result = streamText({
      model: groq("openai/gpt-oss-20b"),
      prompt,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error in /api/stream:", error);
    return  new Response("Failed to stream text. Please try again.", { status: 500 });
  }
}
