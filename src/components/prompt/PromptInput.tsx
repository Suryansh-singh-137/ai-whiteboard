"use client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useBoardStore } from "@/store/useBoardStore";
export default function PromptInput() {
  const prompt = useBoardStore((s) => s.prompt);
  const setPrompt = useBoardStore((s) => s.setPrompt);
  const status = useBoardStore((s) => s.status);
  const isDisabled = status === "exporting" || status === "loading";
}
