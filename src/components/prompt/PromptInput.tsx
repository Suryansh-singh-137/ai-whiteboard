"use client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useBoardStore } from "@/store/useBoardStore";
import { log } from "console";
export async function enhanceImage() {
  console.log("Enhance button clicked");
  const { prompt, canvasImage } = useBoardStore.getState();

  try {
    if (!canvasImage) {
      alert("Please export the canvas first.");
      return;
    }

    useBoardStore.getState().setStatus("loading");
    const res = await fetch("/api/enhance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: canvasImage,
        prompt,
      }),
    });
    const data = await res.json();
    useBoardStore.getState().setAIImage(data.enhancedImage);
    useBoardStore.getState().setStatus("preview");
  } catch (error) {
    alert("Failed to enhance image. Please try again.");
  }
}
export default function PromptInput() {
  const prompt = useBoardStore((s) => s.prompt);
  const setPrompt = useBoardStore((s) => s.setPrompt);
  const status = useBoardStore((s) => s.status);
  const isDisabled = status === "exporting" || status === "loading";
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background p-4">
      <div className="mx-auto flex max-w-3xl gap-2">
        <Input
          placeholder="Describe what this diagram represents..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isDisabled}
        />
        <Button
          disabled={isDisabled || prompt.trim() === ""}
          onClick={enhanceImage}
        >
          Enhance
        </Button>
      </div>
    </div>
  );
}
