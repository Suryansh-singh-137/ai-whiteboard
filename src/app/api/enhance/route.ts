import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { image, prompt } = await req.json();

    if (!image || !prompt) {
      return NextResponse.json(
        { error: "Image and prompt are required" },
        { status: 400 },
      );
    }

    const base64Image = image.replace(/^data:image\/png;base64,/, "");

    // Step 1: Send drawing + prompt to Gemini vision via OpenRouter
    // Goal: get a detailed image generation prompt back
    const geminiResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "nvidia/nemotron-3.5-content-safety:free",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/png;base64,${base64Image}`,
                  },
                },
                {
                  type: "text",
                  text: `The user drew this sketch and wants: "${prompt}".
                Based on the drawing and their intent, write a single detailed 
                image generation prompt (max 200 words). Only return the prompt, 
                nothing else.`,
                },
              ],
            },
          ],
        }),
      },
    );

    const geminiData = await geminiResponse.json();
    console.log("OpenRouter response:", geminiData);

    if (!geminiResponse.ok) {
      console.error("OpenRouter error:", geminiData);
      return NextResponse.json({ error: geminiData }, { status: 500 });
    }

    const imageGenPrompt = geminiData.choices[0].message.content ?? prompt;
    console.log("Generated image prompt:", imageGenPrompt);

    // Step 2: Send that prompt to Pollinations (free, no key needed)
    const encodedPrompt = encodeURIComponent(imageGenPrompt);
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;

    // Fetch image and convert to base64
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
