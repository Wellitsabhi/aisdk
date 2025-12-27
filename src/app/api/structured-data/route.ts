import {streamObject} from "ai";
import { groq } from "@ai-sdk/groq";
import { recipeSchema } from "./schema";

export async function POST(req: Request) {
    try {
        const {dish} = await req.json();
        const result =  streamObject({
            model: groq("openai/gpt-oss-20b"),
            schema: recipeSchema,
            prompt: `Generate a  recipe for  ${dish}`,
          });
    
        return result.toTextStreamResponse();
    } catch (error) {
        console.error("Error in /api/structured-data:", error);
        return new Response("Failed to stream structured data. Please try again.", { status: 500 });
        
    }
}