import {
  UIMessage,
  UIDataTypes,
  streamText,
  tool,
  convertToModelMessages,
  stepCountIs,
  InferUITools,
} from "ai";
import { groq } from "@ai-sdk/groq";
import { z } from "zod";

const tools = {
  getLocation: tool({
    description:
      "Use this tool when a user name is mentioned to find their city before any weather lookup",
    inputSchema: z.object({
      name: z.string().describe("The name of the user"),
    }),
    execute: async ({ name }) => {
      if (name === "Bruce Wayne") {
        return "jaipur";
      } else if (name === "Clark Kent") {
        return "goa";
      } else {
        return "Unknown";
      }
    },
  }),
  getWeather: tool({
    description: "Get the weather for a location",
    inputSchema: z.object({
      city: z.string().describe("The city to get the weather for"),
    }),
    execute: async ({ city }) => {
      const c = city.toLowerCase();
      if (c === "jaipur") {
        return "33C and cloudy";
      } else if (c === "goa") {
        return "35C and Raining outside";
      } else {
        return "unkown";
      }
    },
  }),
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();

    const result = streamText({
      model: groq("openai/gpt-oss-20b"),
      messages: await convertToModelMessages(messages),
      stopWhen: stepCountIs(3),
      tools,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming chat completion:", error);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
