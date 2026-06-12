import { create } from "zustand";
import { Editor } from "tldraw";

export type BoardStatus = "idle" | "exporting" | "loading" | "preview";

interface BoardState {
  prompt: string;
  canvasImage: string | null;
  aiImage: string | null;
  status: BoardStatus;
  editor: Editor | null;

  setPrompt: (prompt: string) => void;
  setCanvasImage: (image: string | null) => void;
  setAIImage: (image: string | null) => void;
  setStatus: (status: BoardStatus) => void;
  reset: () => void;
  setEditor: (editor: Editor) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  prompt: "",
  canvasImage: null,
  aiImage: null,
  status: "idle",
  editor: null,

  setPrompt: (prompt) => set({ prompt }),

  setCanvasImage: (image) =>
    set({
      canvasImage: image,
    }),

  setAIImage: (image) =>
    set({
      aiImage: image,
    }),

  setStatus: (status) =>
    set({
      status,
    }),

  reset: () =>
    set({
      prompt: "",
      canvasImage: null,
      aiImage: null,
      status: "idle",
      editor: null,
    }),

  setEditor: (editor) =>
    set({
      editor,
    }),
}));
