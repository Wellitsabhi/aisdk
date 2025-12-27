import {  generateImage } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
    try {
    const { prompt } = await req.json();

    const { image } = await generateImage({
      model: google.imageModel("gemini-2.5-flash-image"),    //! google image models don't work with 'generateImage' yet
      prompt,
      size: "1024x1024",
      providerOptions: {
        google: { style: "vivid", quality: "hd" },
      },
    });

    return Response.json(image.base64);
  } catch (error) {
    console.error("Error generating image:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
