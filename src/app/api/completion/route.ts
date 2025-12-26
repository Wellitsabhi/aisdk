import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

export async function POST(req: Request) {

  try {
    const {prompt} = await req.json();
  const { text } = await generateText({
    model: groq("openai/gpt-oss-20b"),
    prompt,
  });
  return Response.json({ text });
  } catch (error) {
    console.error("Error in /api/completion:", error);
    return Response.json(
      { error: "Failed to generate text. Please try again." },
      { status: 500 }
    );
  }
  
}
