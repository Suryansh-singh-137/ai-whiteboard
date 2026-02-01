import { Editor } from "tldraw";

export async function exportCanvasToBase64(editor: Editor) {
  const shapeIds = Array.from(editor.getCurrentPageShapeIds());
  if (shapeIds.length === 0) return null;

  const result = await editor.getSvgString(shapeIds, {
    background: true,
    padding: 32,
  });

  if (!result) return null;

  const { svg, width, height } = result;

  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  return new Promise<string>((resolve) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      resolve(canvas.toDataURL("image/png"));
    };

    img.src = url;
  });
}
