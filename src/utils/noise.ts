// Helium Noise fingerprint defense simulator and runtime algorithm

export function generateSessionSeed(): string {
  return Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

// Generate deterministic pseudo-random offset based on seed and coordinate
function pseudoRandom(seed: number, x: number, y: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
  return n - Math.floor(n);
}

/**
 * Applies subtle Helium canvas noise to an existing HTML5 Canvas ImageData
 */
export function applyCanvasNoise(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  sessionSeedStr: string
): string {
  try {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const seed = parseInt(sessionSeedStr.slice(0, 6), 16) || 1337;

    for (let y = 0; y < height; y += 4) {
      for (let x = 0; x < width; x += 4) {
        const index = (y * width + x) * 4;
        // Only alter non-transparent pixels slightly (±1 or 2 least significant bits)
        if (data[index + 3] > 0) {
          const delta = pseudoRandom(seed, x, y) > 0.5 ? 1 : -1;
          data[index] = Math.min(255, Math.max(0, data[index] + delta));
          data[index + 1] = Math.min(255, Math.max(0, data[index + 1] - delta));
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);
  } catch (e) {
    console.warn('Canvas noise application failed:', e);
  }

  // Return base64 representation hash
  return simpleHash(ctx.canvas.toDataURL());
}

/**
 * Fast string hash for fingerprint comparison
 */
export function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

/**
 * Simulates audio buffer fingerprinting before and after Helium Audio noise
 */
export function calculateAudioFingerprint(withNoise: boolean, sessionSeed: string): { hash: string; sampleValues: number[] } {
  const baseSamples = [0.03452, -0.12948, 0.45931, -0.67201, 0.88412, -0.32104, 0.11928, 0.55120];
  const seedNum = parseInt(sessionSeed.slice(0, 4), 16) || 42;

  const samples = baseSamples.map((v, i) => {
    if (!withNoise) return v;
    const noise = (pseudoRandom(seedNum, i, 42) - 0.5) * 0.0008;
    return Number((v + noise).toFixed(6));
  });

  const hashStr = samples.join(',');
  return {
    hash: simpleHash(hashStr + (withNoise ? sessionSeed : 'standard')),
    sampleValues: samples
  };
}
