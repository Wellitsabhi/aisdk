import { UIMessage, streamText, convertToModelMessages } from "ai";
import { groq } from "@ai-sdk/groq";
export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();
    
    const result = streamText({
      model: groq("openai/gpt-oss-20b"),
      //  messages: await convertToModelMessages(messages),
      messages: [
        {
          role: "system",
          content:
            "You are a helpful coding assistant that provides concise answers.PLease limit responses to 3 lines. Focus on practical examples.",
          },
          ...await convertToModelMessages(messages),
      ],
    });

    result.usage.then((usage) => {
      console.log({
        messageCount: messages.length,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
      });
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error in /api/chat:", error);
    return new Response("Failed to stream chat messages", { status: 500 });
  }
}
