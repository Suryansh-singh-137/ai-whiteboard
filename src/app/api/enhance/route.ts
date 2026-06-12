import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    const encodedPrompt = encodeURIComponent(prompt);
    const pollinationsUrl = `https://gen.pollinations.ai/image/${encodedPrompt}?model=flux&width=1024&height=1024&nologo=true`;

    const imageResponse = await fetch(pollinationsUrl, {
      headers: { Authorization: `Bearer ${process.env.POLLINATIONS_API_KEY}` },
    });

    if (!imageResponse.ok) {
      const errText = await imageResponse.text();
      console.error("Pollinations error:", imageResponse.status, errText);
      return NextResponse.json(
        { error: "Image generation failed" },
        { status: 500 },
      );
    }

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
