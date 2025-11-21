// Client-side glyph sampling to generate point clouds for '#', '*', '<>'.
// Normalizes points into -1..1 range and pads arrays to equal length.
export type ShapeKey = "hash" | "asterisk" | "angle";

interface SampleOptions {
  font?: string;
  resolution?: number; // canvas size
  step?: number; // pixel sampling stride
  threshold?: number; // alpha threshold
}

function sampleGlyph(
  glyph: string,
  {
    font = "bold 240px monospace",
    resolution = 300,
    step = 4,
    threshold = 20,
  }: SampleOptions = {},
): Float32Array {
  if (typeof window === "undefined") return new Float32Array();
  const canvas = document.createElement("canvas");
  canvas.width = resolution;
  canvas.height = resolution;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new Float32Array();
  ctx.clearRect(0, 0, resolution, resolution);
  ctx.fillStyle = "#fff";
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(glyph, resolution / 2, resolution / 2);
  const img = ctx.getImageData(0, 0, resolution, resolution).data;
  const pts: number[] = [];
  for (let y = 0; y < resolution; y += step) {
    for (let x = 0; x < resolution; x += step) {
      const idx = (y * resolution + x) * 4 + 3; // alpha channel
      if (img[idx] > threshold) {
        // Normalize to -1..1
        const nx = (x / resolution) * 2 - 1;
        const ny = (y / resolution) * 2 - 1;
        pts.push(nx, -ny, 0); // invert y for conventional coordinates
      }
    }
  }
  return new Float32Array(pts);
}

// Generate and cache shapes once per client session.
let cached: Record<ShapeKey, Float32Array> | null = null;

function generateShapes(): Record<ShapeKey, Float32Array> {
  if (cached) return cached;
  const hash = sampleGlyph("#");
  const asterisk = sampleGlyph("*");
  const angle = sampleGlyph("<>");
  // Determine max length and pad others with random jitter near origin.
  const max = Math.max(hash.length, asterisk.length, angle.length);
  const pad = (arr: Float32Array): Float32Array => {
    if (arr.length === max) return arr;
    const extra = max - arr.length;
    const out = new Float32Array(max);
    out.set(arr, 0);
    for (let i = 0; i < extra; i += 3) {
      const rx = (Math.random() - 0.5) * 0.2;
      const ry = (Math.random() - 0.5) * 0.2;
      const rz = (Math.random() - 0.5) * 0.05;
      out[arr.length + i] = rx;
      out[arr.length + i + 1] = ry;
      out[arr.length + i + 2] = rz;
    }
    return out;
  };
  cached = {
    hash: pad(hash),
    asterisk: pad(asterisk),
    angle: pad(angle),
  };
  return cached;
}

export function getShapeData(): {
  shapes: Record<ShapeKey, Float32Array>;
  count: number;
} {
  const shapes = generateShapes();
  const count = shapes.hash.length / 3; // number of particles
  return { shapes, count };
}
