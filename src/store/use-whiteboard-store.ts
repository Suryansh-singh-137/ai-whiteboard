import { create } from "zustand";
import whiteboardTypes from "@/types/whiteboardTypes";
export const useWhiteboardStore = create<whiteboardTypes>((set) => ({
  // Initial state values of the zustand store
  userPrompt: "",
  canvasImage: null,
  generatedImage: null,
  isGenerating: false,
  isRecording: false,
  showPreview: false,
  error: null,

  // Setter functions for the whiteboard sriore
  setUserPrompt: (prompt: string) => set({ userPrompt: prompt }),
  setCanvasImage: (image: string | null) => set({ canvasImage: image }),
  setGeneratedImage: (image: string | null) => set({ generatedImage: image }),
  setIsGenerating: (generating: boolean) => set({ isGenerating: generating }),
  setIsRecording: (recording: boolean) => set({ isRecording: recording }),
  setShowPreview: (preview: boolean) => set({ showPreview: preview }),
  setError: (error: string | null) => set({ error: error }),

  // Reset function - clears everything o tge whitebpard
  reset: () =>
    set({
      userPrompt: "",
      canvasImage: null,
      generatedImage: null,
      isGenerating: false,
      isRecording: false,
      showPreview: false,
      error: null,
    }),
}));
