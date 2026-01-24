// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes intelligently
 * Combines clsx for conditional classes + twMerge to remove conflicts
 *
 * Example:
 * cn("bg-blue-500", "text-white", isActive && "bg-red-500")
 * Result: "bg-red-500 text-white" (bg-blue removed due to conflict)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert HTML Canvas to Base64 image string
 * Used to export whiteboard drawings
 *
 * @param canvas - The HTML canvas element
 * @returns Promise that resolves to base64 data URL
 *
 * Example output: "data:image/png;base64,iVBORw0KGgoAAAANS..."
 */
export async function canvasToBase64(
  canvas: HTMLCanvasElement,
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const base64 = canvas.toDataURL("image/png");
      resolve(base64);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Extract only the base64 data from a data URL
 * Removes the "data:image/png;base64," prefix
 *
 * @param dataUrl - Full data URL string
 * @returns Just the base64 encoded data
 *
 * Example:
 * Input: "data:image/png;base64,ABC123..."
 * Output: "ABC123..."
 */
export function extractBase64Data(dataUrl: string): string {
  const parts = dataUrl.split(",");
  return parts[1] || dataUrl; // Return second part, or original if no comma found
}

/**
 * Check if image data is valid
 * Validates that we have actual image data before sending to API
 *
 * @param data - Image data string to validate
 * @returns true if valid, false otherwise
 */
export function isValidImageData(data: string | null): boolean {
  if (!data) return false;

  // Check if it's a data URL or has substantial content
  return data.startsWith("data:image") || data.length > 100;
}

/**
 * Debounce function - delays execution until user stops triggering
 * Useful for voice input: wait until user stops speaking
 *
 * @param func - Function to debounce
 * @param wait - Milliseconds to wait
 * @returns Debounced function
 *
 * Example:
 * const debouncedSave = debounce(saveData, 2000);
 * User types... types... types... (waits 2s) → NOW saveData runs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    // Clear previous timer
    if (timeout) clearTimeout(timeout);

    // Start new timer
    timeout = setTimeout(later, wait);
  };
}

/**
 * Format file size to human readable string
 * Optional helper for showing image sizes
 *
 * @param bytes - Size in bytes
 * @returns Formatted string like "2.5 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
