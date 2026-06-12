"use client";
import PreviewOverlay from "@/components/preview/PreviewOverlay";
import Whiteboard from "../components/whiteboard/Whiteboard";
import PromptInput from "@/components/prompt/PromptInput";

export default function Home() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: "14px",
          left: "16px",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          pointerEvents: "none",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="#18181b" />
          <path
            d="M10 22 Q13 14 16 10 Q19 14 22 22"
            stroke="white"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="16" cy="7.5" r="2" fill="white" />
          <line
            x1="10"
            y1="22"
            x2="22"
            y2="22"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        <span
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#18181b",
            letterSpacing: "0px",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          genora
        </span>
      </div>
      <div style={{ width: "100%", height: "100%" }}>
        <Whiteboard />
      </div>
      <PromptInput />
      <PreviewOverlay />
    </div>
  );
}
