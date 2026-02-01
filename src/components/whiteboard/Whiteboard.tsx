"use client";

import { Tldraw, useEditor } from "tldraw";
import "@tldraw/tldraw/tldraw.css";
import { exportCanvasToBase64 } from "@/lib/exportCanvas";
import { useBoardStore } from "@/store/useBoardStore";

function BoardContent() {
  const editor = useEditor();
  const setCanvasImage = useBoardStore((s) => s.setCanvasImage);
  const setStatus = useBoardStore((s) => s.setStatus);

  const handleExport = async () => {
    if (!editor) return;

    setStatus("exporting");
    const image = await exportCanvasToBase64(editor);
    setCanvasImage(image);
    setStatus("idle");

    console.log("Canvas exported");
  };

  return (
    <>
      <button
        onClick={handleExport}
        className="absolute top-4 right-4 z-50 bg-black text-white px-4 py-2 rounded"
      >
        Export
      </button>
    </>
  );
}

export default function Whiteboard() {
  return (
    <div className="relative h-full w-full">
      <Tldraw>
        <BoardContent />
      </Tldraw>
    </div>
  );
}
