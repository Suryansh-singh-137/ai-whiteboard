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

    // Step 1: Send drawing + prompt to HuggingFace vision model
    // Model: Salesforce BLIP2 — free, stable, accepts image + question
    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/Salesforce/blip2-opt-2.7b",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: {
            image: base64Image,
            question: `The user wants: "${prompt}". Describe this sketch as a detailed image generation prompt in under 200 words.`,
          },
        }),
      },
    );

    console.log("HF status:", hfResponse.status);

    // If model is loading (cold start), HF returns 503
    if (hfResponse.status === 503) {
      return NextResponse.json(
        { error: "Model is loading, please try again in 20 seconds" },
        { status: 503 },
      );
    }

    const hfData = await hfResponse.json();
    console.log("HF response:", hfData);

    // BLIP2 returns: [{ generated_text: "..." }]
    const imageGenPrompt =
      hfData?.[0]?.generated_text ?? hfData?.answer ?? prompt;
    console.log("Image gen prompt:", imageGenPrompt);

    // Step 2: Send prompt to Pollinations (free, no key needed)
    const encodedPrompt = encodeURIComponent(imageGenPrompt);
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;

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
