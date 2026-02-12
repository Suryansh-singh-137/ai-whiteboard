"use client";
import Whiteboard from "../components/whiteboard/Whiteboard";
import PromptInput from "@/components/prompt/PromptInput";
export default function Home() {
  return (
    <div className="h-screen w-screen">
      <Whiteboard />
      <PromptInput />
    </div>
  );
}
