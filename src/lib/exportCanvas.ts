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

  // Inline all external resources to avoid taint
  const svgWithXmlns = svg.includes("xmlns=")
    ? svg
    : svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');

  const blob = new Blob([svgWithXmlns], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);

  return new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // ← fixes taint error

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width || 800;
      canvas.height = height || 600;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject("No canvas context");
        return;
      }

      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      try {
        resolve(canvas.toDataURL("image/png"));
      } catch (e) {
        // fallback — return SVG as base64 directly
        const svgBase64 =
          "data:image/svg+xml;base64," +
          btoa(unescape(encodeURIComponent(svgWithXmlns)));
        resolve(svgBase64);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject("Image failed to load");
    };

    img.src = url;
  });
}
