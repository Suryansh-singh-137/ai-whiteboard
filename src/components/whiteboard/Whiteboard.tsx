"use client";
import { Tldraw, useEditor, DefaultToolbar } from "tldraw";
import "tldraw/tldraw.css";
import { useBoardStore } from "@/store/useBoardStore";
import { useEffect } from "react";

function BoardContent() {
  const editor = useEditor();
  const setEditor = useBoardStore((s) => s.setEditor);
  useEffect(() => {
    if (editor) setEditor(editor);
  }, [editor, setEditor]);
  return null;
}

export default function Whiteboard() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Tldraw
        components={{
          Toolbar: () => (
            <div
              style={{
                position: "absolute",
                top: "12px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 500,
              }}
            >
              <DefaultToolbar />
            </div>
          ),
          MainMenu: () => null,
          PageMenu: () => null,
          MenuPanel: () => null,
        }}
      >
        <BoardContent />
      </Tldraw>
    </div>
  );
}
