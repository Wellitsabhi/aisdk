import {
  UIMessage,
  UIDataTypes,
  streamText,
  tool,
  convertToModelMessages,
  stepCountIs,
  InferUITools,
  experimental_generateImage as generateImage,
  generateText,
} from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

const tools = {
  generateImage: tool({
    description: "Generate an image",
    inputSchema: z.object({
      prompt: z.string(),
    }),
    execute: async ({ prompt }) => {
      const result = await generateText({
        model: google("gemini-2.5-flash-image"),
        prompt,
      });

      if (!result.files || result.files.length === 0) {
        throw new Error("No image generated");
      }

      const imageFile = result.files[0];

      return imageFile.base64;
    },
    toModelOutput: () => ({
      type: "content",
      value: [{ type: "text", text: "generated image" }],
    }),
  }),
};


export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();

    const result = streamText({
      model: google("gemini-2.5-flash"),
      messages: await convertToModelMessages(messages),
      tools,
      stopWhen: stepCountIs(2),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming chat completion:", error);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
