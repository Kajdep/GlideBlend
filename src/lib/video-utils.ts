/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Calculates the dHash (Difference Hash) for a given image data.
 * @param imageData The image data from a canvas.
 * @returns A 64-bit hash as a BigInt.
 */
export function calculateDHash(imageData: ImageData): bigint {
  const { data, width, height } = imageData;
  const grayscale = new Uint8Array(width * height);

  // Convert to grayscale
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Standard grayscale conversion
    grayscale[i / 4] = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  }

  let hash = 0n;
  // Compare adjacent pixels horizontally
  // For a 9x8 image, we get 8 comparisons per row, 8 rows = 64 bits.
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const left = grayscale[y * 9 + x];
      const right = grayscale[y * 9 + x + 1];
      if (left > right) {
        hash |= 1n << BigInt(y * 8 + x);
      }
    }
  }

  return hash;
}

/**
 * Calculates the Hamming distance between two 64-bit hashes.
 */
export function hammingDistance(h1: bigint, h2: bigint): number {
  let x = h1 ^ h2;
  let distance = 0;
  while (x > 0n) {
    if (x & 1n) distance++;
    x >>= 1n;
  }
  return distance;
}

/**
 * Resizes an image to 9x8 for dHash.
 */
export function resizeForHash(canvas: HTMLCanvasElement, video: HTMLVideoElement): ImageData {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  
  canvas.width = 9;
  canvas.height = 8;
  ctx.drawImage(video, 0, 0, 9, 8);
  return ctx.getImageData(0, 0, 9, 8);
}

/**
 * Formats seconds to a timestamp string (HH:MM:SS.mmm).
 */
export function formatTimestamp(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 1000);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
}
