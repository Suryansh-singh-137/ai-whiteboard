interface WhiteboardTypes {
  userPrompt: string;
  setUserPrompt: (prompt: string) => void;
  canvasImage: string | null;
  setCanvasImage: (image: string | null) => void;
  generatedImage: string | null;
  setGeneratedImage: (image: string | null) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  showPreview: boolean;
  setShowPreview: (preview: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  reset: () => void;
}
export default WhiteboardTypes;
