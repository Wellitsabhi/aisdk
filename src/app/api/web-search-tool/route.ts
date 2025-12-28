import {
  UIMessage,
  InferUITools,
  UIDataTypes,
  streamText,
  convertToModelMessages,
  stepCountIs,
} from "ai";
import { groq } from "@ai-sdk/groq";
import { google } from "@ai-sdk/google";

const tools = {
  //   web_search_preview: openai.tools.webSearchPreview({}),
  //   web_search: anthropic.tools.webSearch_20250305({
  // maxUses: 1,
  //   }),
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();

    const result = streamText({
      model: groq("groq/compound"),
    //   model: google("gemini-2.5-flash"),
    //   messages: [
    //     {
    //       role: "system",
    //       content:
    //         "If the question requires current or live information, call web_search before answering.",
    //     },
    //     ...(await convertToModelMessages(messages)),
    //   ],
        messages: await convertToModelMessages(messages),
      tools,
      stopWhen: stepCountIs(2),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error in /api/chat:", error);
    return new Response("Failed to stream chat messages", { status: 500 });
  }
}
