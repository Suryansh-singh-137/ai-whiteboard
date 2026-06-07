"use client";

import { Tldraw, useEditor } from "tldraw";
import "tldraw/tldraw.css";
import { exportCanvasToBase64 } from "@/lib/exportCanvas";
import { useBoardStore } from "@/store/useBoardStore";
import { useEffect } from "react";

function BoardContent() {
  const editor = useEditor();
  const setCanvasImage = useBoardStore((s) => s.setCanvasImage);
  const setStatus = useBoardStore((s) => s.setStatus);
  const setEditor = useBoardStore((s) => s.setEditor);
  useEffect(() => {
    if (editor) {
      setEditor(editor);
    }
  }, [editor, setEditor]);
  const handleExport = async () => {
    console.log("Export button clicked");

    if (!editor) return;

    setStatus("exporting");
    const image = await exportCanvasToBase64(editor);

    // console.log("Export result:", image);

    setCanvasImage(image);
    setStatus("idle");

    // console.log("Canvas exported");
  };

  return (
    <>
      <button
        onClick={handleExport}
        style={{
          position: "fixed",
          top: 60,
          left: 20,
          zIndex: 9999,
          background: "red",
          color: "white",
          padding: "12px",
        }}
      >
        EXPORT TEST
      </button>
    </>
  );
}

export default function Whiteboard() {
  console.log("BoardContent mounted");

  return (
    <div className="relative h-full w-full">
      <Tldraw>
        <BoardContent />
      </Tldraw>
    </div>
  );
}
