import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { image, prompt } = await req.json();

    if (!image || !prompt) {
      return NextResponse.json(
        { error: "Image and prompt are required" },
        { status: 400 },
      );
    }

    // Strip the base64 prefix before sending to Gemini
    const base64Image = image.replace(/^data:image\/png;base64,/, "");

    // Step 1: Send drawing + prompt to Gemini vision
    // Ask it to generate a detailed image generation prompt
    const geminiResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "image/png",
                data: base64Image,
              },
            },
            {
              text: `The user drew this sketch and wants: "${prompt}".
              Based on the drawing and their intent, write a single detailed 
              image generation prompt (max 200 words). Only return the prompt, 
              nothing else.`,
            },
          ],
        },
      ],
    });

    const imageGenPrompt = geminiResponse.text ?? prompt;
    console.log("Generated prompt:", imageGenPrompt);

    // Step 2: Send that prompt to Pollinations (free, no API key needed)
    const encodedPrompt = encodeURIComponent(imageGenPrompt);
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;

    // Fetch the image and convert to base64 to send back to frontend
    const imageResponse = await fetch(pollinationsUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString("base64");

    return NextResponse.json({
      enhancedImage: `data:image/png;base64,${imageBase64}`,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to enhance image" },
      { status: 500 },
    );
  }
}
