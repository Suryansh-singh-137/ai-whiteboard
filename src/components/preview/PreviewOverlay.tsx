"use client";
import { useBoardStore } from "@/store/useBoardStore";
import { Button } from "../ui/button";
import { AssetRecordType, createShapeId } from "tldraw";

export default function PreviewOverlay() {
  const aiImage = useBoardStore((s) => s.aiImage);
  const status = useBoardStore((s) => s.status);
  const setStatus = useBoardStore((s) => s.setStatus);
  const setAIImage = useBoardStore((s) => s.setAIImage);
  const editor = useBoardStore((s) => s.editor);
  console.log("STATUS:", status, "| AI IMAGE:", aiImage?.substring(0, 80));
  if (status !== "preview" || !aiImage) return null;
  const handleReject = () => {
    setAIImage(null);
    setStatus("idle");
  };
  const handleAccept = () => {
    if (!editor || !aiImage) return;

    // 1Delete existing shapes
    const ids = Array.from(editor.getCurrentPageShapeIds());
    if (ids.length) editor.deleteShapes(ids);

    // 2Create data URL
    const dataUrl = aiImage.startsWith("data:")
      ? aiImage
      : `data:image/png;base64,${aiImage}`;

    const img = new Image();
    img.src = dataUrl;

    img.onload = () => {
      const width = img.width || 800;
      const height = img.height || 600;

      const assetId = AssetRecordType.createId();
      const shapeId = createShapeId();

      //  Register asset properly
      editor.createAssets([
        {
          id: assetId,
          type: "image",
          typeName: "asset",
          props: {
            name: "enhanced.png",
            src: dataUrl,
            w: width,
            h: height,
            mimeType: "image/png",
            isAnimated: false,
          },
          meta: {},
        },
      ]);

      //  Create shape referencing asset
      editor.createShape({
        id: shapeId,
        type: "image",
        x: 0,
        y: 0,
        props: {
          assetId,
          w: width,
          h: height,
        },
      });

      setAIImage(null);
      setStatus("idle");
    };

    img.onerror = () => {
      console.error("Image failed to load. Data URL:", dataUrl?.substring(0, 100));
      setStatus("idle");
      alert("Failed to load the enhanced image. Please try again.");
    };
  };
  console.log("aiImage value:", aiImage?.substring(0, 80));
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70">
      <div className="flex max-w-4xl flex-col gap-4 rounded-lg bg-white p-6 shadow-lg">
        <img
          src={
            aiImage.startsWith("data:")
              ? aiImage
              : `data:image/png;base64,${aiImage}`
          }
          alt="Enhanced Preview"
          className="max-h-[70vh] rounded border"
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleReject}>
            Reject
          </Button>
          <Button onClick={handleAccept}>Accept</Button>
        </div>
      </div>
    </div>
  );
}
