"use client";
import { useBoardStore } from "@/store/useBoardStore";
import { Button } from "../ui/button";
export default function PreviewOverlay() {
  const aiImage = useBoardStore((s) => s.aiImage);
  const status = useBoardStore((s) => s.status);
  const setStatus = useBoardStore((s) => s.setStatus);
  const setAIImage = useBoardStore((s) => s.setAIImage);
  if (status !== "preview" || !aiImage) return null;
  const handleReject = () => {
    setAIImage(null);
    setStatus("idle");
  };
  const handleAccept = () => {
    setStatus("idle");
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70">
      <div className="flex max-w-4xl flex-col gap-4 rounded-lg bg-white p-6 shadow-lg">
        <img
          src={aiImage}
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
