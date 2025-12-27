import { experimental_generateSpeech as generateSpeech } from "ai";
// import { groq } from "@ai-sdk/groq";
// import { google } from "@ai-sdk/google";
import { elevenlabs } from "@ai-sdk/elevenlabs";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    const { audio } = await generateSpeech({
      // model: google.speech("gemini-2.5-flash-tts"), //! '.speech' not exist for GoogleProvider
      // model: groq.speech("canopylabs/orpheus-v1-english"), //! '.speech' not exist for GroqProvider
      model: elevenlabs.speech("eleven_multilingual_v2"),
      text,
    });

    const fixed = new Uint8Array(audio.uint8Array);
    const blob = new Blob([fixed], { type: audio.mediaType || "audio/mpeg" });

    return new Response(blob, {
      headers: {
        "Content-Type": audio.mediaType || "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("Error generating speech:", error);
    return new Response("Failed to generate speech", { status: 500 });
  }
}
