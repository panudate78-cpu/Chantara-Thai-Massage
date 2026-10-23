/**
 * Client-side photo preparation.
 *
 * Phone photos are often 4–8 MB and 4000px wide. Before upload we rotate using
 * the EXIF orientation, strip metadata and render the three responsive sizes
 * plus a JPEG fallback the public site uses in <picture>. The owner gets
 * "automatically optimised images" without ever thinking about it.
 */
import type { PreparedVariantPayload } from "./api";

const WEBP_WIDTHS = [480, 960, 1600] as const;
const JPEG_WIDTH = 960;
const MAX_INPUT_BYTES = 12 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export type PreparedImage = {
  width: number;
  height: number;
  variants: PreparedVariantPayload[];
  previewUrl: string;
};

export class ImagePrepareError extends Error {}

function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if ("createImageBitmap" in window) {
    return createImageBitmap(file, { imageOrientation: "from-image" }).catch(() => loadImageElement(file));
  }
  return loadImageElement(file);
}

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new ImagePrepareError("That file doesn't look like a photo. Please try another."));
    };
    image.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new ImagePrepareError("Your browser could not optimise this photo."));
          return;
        }
        resolve(blob);
      },
      type,
      quality
    );
  });
}

async function blobToBase64(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function render(
  source: ImageBitmap | HTMLImageElement,
  width: number
): { canvas: HTMLCanvasElement; height: number } {
  const sourceWidth = "width" in source ? source.width : 0;
  const sourceHeight = "height" in source ? source.height : 0;
  const targetWidth = Math.min(width, sourceWidth);
  const targetHeight = Math.max(1, Math.round((sourceHeight / sourceWidth) * targetWidth));
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const context = canvas.getContext("2d");
  if (!context) throw new ImagePrepareError("Your browser could not process this photo.");
  context.imageSmoothingQuality = "high";
  context.drawImage(source as CanvasImageSource, 0, 0, targetWidth, targetHeight);
  return { canvas, height: targetHeight };
}

export async function prepareImage(file: File): Promise<PreparedImage> {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new ImagePrepareError("Please choose a JPEG, PNG or WebP photo.");
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new ImagePrepareError("That photo is larger than 12 MB. Please choose a smaller one.");
  }

  const source = await loadBitmap(file);
  const sourceWidth = source.width;
  const sourceHeight = source.height;
  if (!sourceWidth || !sourceHeight) {
    throw new ImagePrepareError("That photo could not be read. Please try another.");
  }

  const variants: PreparedVariantPayload[] = [];
  let largestWidth = 0;

  try {
    for (const width of WEBP_WIDTHS) {
      if (width > sourceWidth && variants.length > 0) break;
      const { canvas } = render(source, width);
      const quality = width >= 1600 ? 0.78 : 0.82;
      const blob = await canvasToBlob(canvas, "image/webp", quality);
      if (blob.type !== "image/webp") {
        throw new ImagePrepareError(
          "Your browser can't create optimised images. Please try a recent version of Chrome, Safari or Firefox."
        );
      }
      variants.push({
        name: `webp${width}`,
        width: canvas.width,
        data: await blobToBase64(blob),
      });
      largestWidth = Math.max(largestWidth, canvas.width);
    }

    const { canvas: jpegCanvas } = render(source, JPEG_WIDTH);
    const jpeg = await canvasToBlob(jpegCanvas, "image/jpeg", 0.82);
    variants.push({
      name: "jpeg960",
      width: jpegCanvas.width,
      data: await blobToBase64(jpeg),
    });

    const aspect = sourceHeight / sourceWidth;
    return {
      width: largestWidth,
      height: Math.round(largestWidth * aspect),
      variants,
      previewUrl: URL.createObjectURL(file),
    };
  } finally {
    if ("close" in source) source.close();
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
