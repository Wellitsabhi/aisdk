import { UIMessage, streamText, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";
export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: google('gemini-2.5-flash'),    // since groq was only text based
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error in /api/chat:", error);
    return new Response("Failed to stream chat messages", { status: 500 });
  }
}
