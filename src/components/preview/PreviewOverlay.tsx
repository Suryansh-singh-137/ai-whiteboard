"use client";
import { useBoardStore } from "@/store/useBoardStore";
import { AssetRecordType, createShapeId } from "tldraw";

export default function PreviewOverlay() {
  const aiImage = useBoardStore((s) => s.aiImage);
  const status = useBoardStore((s) => s.status);
  const setStatus = useBoardStore((s) => s.setStatus);
  const setAIImage = useBoardStore((s) => s.setAIImage);
  const editor = useBoardStore((s) => s.editor);

  if (status !== "preview" || !aiImage) return null;

  const imageSrc = aiImage.startsWith("data:")
    ? aiImage
    : `data:image/png;base64,${aiImage}`;

  const handleReject = () => {
    setAIImage(null);
    setStatus("idle");
  };

  const handleAccept = () => {
    if (!editor || !aiImage) return;
    const ids = Array.from(editor.getCurrentPageShapeIds());
    if (ids.length) editor.deleteShapes(ids);
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const width = img.width || 800;
      const height = img.height || 600;
      const assetId = AssetRecordType.createId();
      const shapeId = createShapeId();
      editor.createAssets([
        {
          id: assetId,
          type: "image",
          typeName: "asset",
          props: {
            name: "enhanced.png",
            src: imageSrc,
            w: width,
            h: height,
            mimeType: "image/png",
            isAnimated: false,
          },
          meta: {},
        },
      ]);
      editor.createShape({
        id: shapeId,
        type: "image",
        x: 0,
        y: 0,
        props: { assetId, w: width, h: height },
      });
      setAIImage(null);
      setStatus("idle");
    };
    img.onerror = () => {
      setStatus("idle");
      alert("Failed to load image.");
    };
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          overflow: "hidden",
          maxWidth: "800px",
          width: "100%",
          boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid #f4f4f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#22c55e",
              }}
            />
            <span
              style={{ fontSize: "13px", fontWeight: 500, color: "#18181b" }}
            >
              Preview ready
            </span>
          </div>
          <button
            onClick={handleReject}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#a1a1aa",
              fontSize: "20px",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
        <div style={{ background: "#fafafa", padding: "16px" }}>
          <img
            src={imageSrc}
            alt="Generated"
            style={{
              width: "100%",
              borderRadius: "8px",
              display: "block",
              maxHeight: "60vh",
              objectFit: "contain",
            }}
          />
        </div>
        <div
          style={{
            padding: "14px 20px",
            display: "flex",
            gap: "8px",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={handleReject}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
              background: "transparent",
              border: "1px solid #e4e4e7",
              color: "#71717a",
              cursor: "pointer",
            }}
          >
            Discard
          </button>
          <button
            onClick={handleAccept}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
              background: "#18181b",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Add to canvas →
          </button>
        </div>
      </div>
    </div>
  );
}
