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

    const response = await fetch(
      "https://api.getimg.ai/v1/stable-diffusion/image-to-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GETIMG_API_KEY}`,
        },
        body: JSON.stringify({
          model: "stable-diffusion-v1-5",
          prompt,
          image: base64Image,
          strength: 0.6,
          guidance: 7.5,
          steps: 30,
          response_format: "b64",
          output_format: "png",
        }),
      },
    );

    const data = await response.json();

    console.log("Status:", response.status);
    console.log("Response:", data);

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: 500 });
    }

    // According to docs, response returns:
    // { url: "...", seed: ..., cost: ... }
    // OR if response_format=b64, it returns base64 directly

    return NextResponse.json({
      enhancedImage: `data:image/png;base64,${data.image}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to enhance image" },
      { status: 500 },
    );
  }
}
