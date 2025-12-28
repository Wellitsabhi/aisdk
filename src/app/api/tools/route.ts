import { UIMessage, InferUITools, UIDataTypes, streamText, convertToModelMessages, tool, stepCountIs } from "ai";
import { groq } from "@ai-sdk/groq";
import {z} from "zod";

const tools = {     
    getWeather: tool({
        description: "Get the weather for a location",
        inputSchema: z.object({
            city: z.string().describe("The city to get the weather for")
        }),
        execute: async ({city})=>{
             const c = city.toLowerCase()
            if(c === "jaipur"){
                return "33C and cloudy"
            } else if (c === "goa"){
                return "35C and Raining outside"
            } else {
                return "unkown"
            }
        }
    })
}

export type ChatTools  = InferUITools<typeof tools>;
export type ChatMessage  = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();
    
    const result = streamText({
      model: groq("openai/gpt-oss-20b"),
      messages:  await convertToModelMessages(messages),
      tools,
      stopWhen: stepCountIs(2),
    });

    return result.toUIMessageStreamResponse();

  } catch (error) {
    console.error("Error in /api/chat:", error);
    return new Response("Failed to stream chat messages", { status: 500 });
  }
}
