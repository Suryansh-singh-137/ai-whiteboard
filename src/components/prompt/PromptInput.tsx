"use client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useBoardStore } from "@/store/useBoardStore";
import { exportCanvasToBase64 } from "@/lib/exportCanvas";

export async function enhanceImage() {
  console.log("Enhance button clicked");
  const { prompt, editor } = useBoardStore.getState();

  if (!editor) {
    alert("Canvas not ready.");
    return;
  }

  if (!prompt.trim()) {
    alert("Please enter a prompt.");
    return;
  }

  try {
    useBoardStore.getState().setStatus("loading");

    const canvasImage = await exportCanvasToBase64(editor);
    console.log("Canvas exported:", canvasImage?.substring(0, 50));

    if (!canvasImage) {
      alert("Draw something on the canvas first.");
      useBoardStore.getState().setStatus("idle");
      return;
    }

    const res = await fetch("/api/enhance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: canvasImage, prompt }),
    });

    const data = await res.json();
    console.log("API response:", data);

    useBoardStore.getState().setAIImage(data.enhancedImage);
    useBoardStore.getState().setStatus("preview");
  } catch (error) {
    console.error("Enhance error:", error);
    alert("Failed to enhance image. Please try again.");
    useBoardStore.getState().setStatus("idle");
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