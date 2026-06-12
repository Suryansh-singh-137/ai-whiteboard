"use client";
import { useBoardStore } from "@/store/useBoardStore";
import { exportCanvasToBase64 } from "@/lib/exportCanvas";

export async function enhanceImage() {
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
    if (!canvasImage) {
      alert("Draw something on the canvas first.");
      useBoardStore.getState().setStatus("idle");
      return;
    }

    // Convert base64 → Blob for Puter
    const base64Data = canvasImage.split(",")[1];
    const byteCharacters = atob(base64Data);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    const imageBlob = new Blob([byteArray], { type: "image/png" });

    // Step 1: Puter vision
    let imageGenPrompt = prompt;
    const puter = (window as any).puter;

    if (puter) {
      try {
        console.log("Sending to Puter vision...");
        const visionResponse = await puter.ai.chat(
          `You are an AI assistant for a creative whiteboard tool called Genora.
           A user sketched something on a digital whiteboard and wants it enhanced into a beautiful image.
           
           Their sketch intent: "${prompt}"
           
           Look at the sketch carefully. Based on the sketch shapes and the user's intent,
           write a single detailed image generation prompt (max 150 words).
           
           Rules:
           - Describe a photorealistic or beautifully illustrated version of what they sketched
           - Mention specific colors, lighting, style (realistic, illustrated, cinematic etc.)
           - White or transparent background preferred unless the scene requires otherwise
           - Do NOT mention the sketch itself — describe the final image directly
           - Only return the prompt text, nothing else, no explanation`,
          imageBlob,
          { model: "gpt-5.4-nano" },
        );

        const text =
          visionResponse?.message?.content?.[0]?.text ??
          visionResponse?.message?.content ??
          null;

        if (text && typeof text === "string") {
          imageGenPrompt = text.trim();
          console.log("Vision prompt:", imageGenPrompt);
        }
      } catch (visionError) {
        console.warn("Vision failed, using text prompt only:", visionError);
      }
    }

    // Step 2: Generate image
    const res = await fetch("/api/enhance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: imageGenPrompt }),
    });

    const data = await res.json();
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
  const isLoading = status === "loading";
  const isDisabled = status === "exporting" || isLoading;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        width: "100%",
        maxWidth: "560px",
        padding: "0 16px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "#ffffff",
          border: "1px solid #e4e4e7",
          borderRadius: "14px",
          padding: "8px 8px 8px 14px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#a1a1aa"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0 }}
        >
          <path d="M12 3l1.88 5.76a2 2 0 001.27 1.27L21 12l-5.85 1.97a2 2 0 00-1.27 1.27L12 21l-1.88-5.76a2 2 0 00-1.27-1.27L3 12l5.85-1.97a2 2 0 001.27-1.27L12 3z" />
        </svg>
        <input
          placeholder="Describe what to generate..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isDisabled}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isDisabled && prompt.trim())
              enhanceImage();
          }}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: "14px",
            color: "#18181b",
            fontFamily: "inherit",
          }}
        />
        <button
          disabled={isDisabled || prompt.trim() === ""}
          onClick={enhanceImage}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: isLoading ? "#f4f4f5" : "#18181b",
            color: isLoading ? "#71717a" : "#ffffff",
            border: "none",
            borderRadius: "10px",
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: 500,
            cursor:
              isDisabled || prompt.trim() === "" ? "not-allowed" : "pointer",
            flexShrink: 0,
            opacity: isDisabled && !isLoading ? 0.5 : 1,
            transition: "all 0.15s ease",
          }}
        >
          {isLoading ? (
            <>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ animation: "spin 1s linear infinite" }}
              >
                <path d="M21 12a9 9 0 00-9-9" strokeLinecap="round" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              Enhance
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
