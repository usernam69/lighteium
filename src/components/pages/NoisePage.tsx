import React, { useState, useEffect, useRef } from 'react';
import { useBrowser } from '../../context/BrowserContext';
import {
  Cpu,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  Sliders,
  Volume2,
  Eye,
  CheckCircle,
  HelpCircle,
  Copy,
  Info
} from 'lucide-react';
import { applyCanvasNoise, calculateAudioFingerprint, generateSessionSeed, simpleHash } from '../../utils/noise';

export const NoisePage: React.FC = () => {
  const { noiseSettings, updateNoiseSettings } = useBrowser();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasHashWithoutNoise, setCanvasHashWithoutNoise] = useState('');
  const [canvasHashWithNoise, setCanvasHashWithNoise] = useState('');
  const [copied, setCopied] = useState(false);

  // Audio tests
  const audioWithout = calculateAudioFingerprint(false, noiseSettings.sessionSeed);
  const audioWith = calculateAudioFingerprint(noiseSettings.audioNoise && noiseSettings.enabled, noiseSettings.sessionSeed);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw standard fingerprinting test image
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gradient background
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#3450D1');
    grad.addColorStop(0.5, '#7C3AED');
    grad.addColorStop(1, '#EC4899');
    ctx.fillStyle = grad;
    ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Shapes and curves
    ctx.beginPath();
    ctx.arc(60, 60, 40, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fill();

    // Text with complex anti-aliasing
    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('Helium Browser <canvas>', 20, 120);

    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#FDE047';
    ctx.fillText('Fingerprint Defense Test 🛡️', 20, 145);

    // Baseline hash before noise
    const rawDataUrl = canvas.toDataURL();
    const cleanHash = simpleHash(rawDataUrl);
    setCanvasHashWithoutNoise(cleanHash);

    // If noise enabled, apply subtle Helium noise
    if (noiseSettings.enabled && noiseSettings.canvasNoise) {
      const noisyHash = applyCanvasNoise(ctx, canvas.width, canvas.height, noiseSettings.sessionSeed);
      setCanvasHashWithNoise(noisyHash);
    } else {
      setCanvasHashWithNoise(cleanHash);
    }
  }, [noiseSettings.enabled, noiseSettings.canvasNoise, noiseSettings.sessionSeed]);

  const handleRegenerateSeed = () => {
    updateNoiseSettings({ sessionSeed: generateSessionSeed() });
  };

  return (
    <div className="h-full overflow-y-auto bg-[#0e1118] text-slate-100 p-6 md:p-10 select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#141824] border border-white/10 rounded-3xl">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl">
              <Cpu className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">Fingerprint Protection Lab</h1>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  helium://noise
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Deterministic subtle noise injection to neutralize Canvas, Audio, and Hardware profiling.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRegenerateSeed}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-200 transition-colors cursor-pointer border border-white/5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
              <span>New Session Seed</span>
            </button>

            <button
              onClick={() => updateNoiseSettings({ enabled: !noiseSettings.enabled })}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                noiseSettings.enabled
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                  : 'bg-white/10 hover:bg-white/20 text-slate-300'
              }`}
            >
              {noiseSettings.enabled ? 'Noise Active' : 'Noise Disabled'}
            </button>
          </div>
        </div>

        {/* Status Callout */}
        <div className="p-4 bg-blue-950/30 border border-blue-500/20 rounded-2xl text-xs text-slate-300 flex items-start gap-3">
          <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-blue-200">How Helium Fingerprinting Protection Works</div>
            <p className="text-slate-400">
              When fingerprinting protection is enabled, Helium adds imperceptible noise to certain browser features.
              Each website sees consistent randomized information during your browsing session so sites cannot link your activity across browser restarts.
            </p>
            <div className="font-mono text-[11px] text-blue-300 pt-1">
              Current Session Seed: <span className="text-white font-bold">{noiseSettings.sessionSeed}</span>
            </div>
          </div>
        </div>

        {/* Canvas Fingerprint Test Card */}
        <div className="bg-[#141824] border border-white/10 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-400" />
              <h2 className="font-semibold text-base text-white">Canvas 2D / WebGL Noise</h2>
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <span>Enable Canvas Noise</span>
              <input
                type="checkbox"
                checked={noiseSettings.canvasNoise}
                onChange={e => updateNoiseSettings({ canvasNoise: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Render Canvas */}
            <div className="flex flex-col items-center p-3 bg-black/40 rounded-2xl border border-white/5">
              <canvas
                ref={canvasRef}
                width={280}
                height={160}
                className="rounded-xl border border-white/10 shadow-md"
              />
              <span className="text-[10px] text-slate-500 font-mono mt-2">
                Simulated Canvas Test Surface (280x160)
              </span>
            </div>

            {/* Hash Comparison */}
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <div className="text-[11px] text-slate-400">Baseline Trackable Hash (No Noise):</div>
                <div className="font-mono text-sm text-amber-300 font-bold tracking-wider">
                  {canvasHashWithoutNoise || 'Generating...'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 space-y-1">
                <div className="text-[11px] text-emerald-300 flex items-center justify-between">
                  <span>Helium Protected Hash (Per-Session Spoofed):</span>
                  {noiseSettings.enabled && noiseSettings.canvasNoise && (
                    <span className="text-[10px] font-mono bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-300">
                      SPOOFED
                    </span>
                  )}
                </div>
                <div className="font-mono text-sm text-emerald-400 font-bold tracking-wider">
                  {canvasHashWithNoise || 'Generating...'}
                </div>
              </div>

              <div className="text-[11px] text-slate-400">
                {noiseSettings.enabled && noiseSettings.canvasNoise ? (
                  <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Tracking scripts receive a randomized signature with zero visible distortion.
                  </span>
                ) : (
                  <span className="text-amber-400">
                    Protection is currently inactive; tracker scripts receive exact persistent device fingerprint.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* AudioContext & Hardware Concurrency Spoofing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Audio Fingerprint Test */}
          <div className="bg-[#141824] border border-white/10 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-blue-400" />
                <h2 className="font-semibold text-sm text-white">AudioContext Perturbation</h2>
              </div>
              <input
                type="checkbox"
                checked={noiseSettings.audioNoise}
                onChange={e => updateNoiseSettings({ audioNoise: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 cursor-pointer"
              />
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="text-[11px] text-slate-400">Audio Buffer Signature:</div>
                <div className="font-mono text-xs text-blue-300 font-bold mt-1">
                  {audioWith.hash}
                </div>
              </div>

              <div className="p-2.5 bg-black/40 rounded-xl font-mono text-[10px] text-slate-400 space-y-0.5">
                <div>Sample Frequencies:</div>
                <div className="text-slate-300 truncate">
                  [{audioWith.sampleValues.slice(0, 4).join(', ')}...]
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                Adds micro-fluctuations to audio oscillator dynamics to prevent cross-site audio profiling.
              </p>
            </div>
          </div>

          {/* Hardware Concurrency Spoofing */}
          <div className="bg-[#141824] border border-white/10 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-amber-400" />
                <h2 className="font-semibold text-sm text-white">Hardware Concurrency</h2>
              </div>
              <input
                type="checkbox"
                checked={noiseSettings.hardwareConcurrencySpoof}
                onChange={e => updateNoiseSettings({ hardwareConcurrencySpoof: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 cursor-pointer"
              />
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-slate-400">Reported CPU Logical Cores:</span>
                <span className="font-mono text-sm font-bold text-amber-300">
                  {noiseSettings.enabled && noiseSettings.hardwareConcurrencySpoof
                    ? `${noiseSettings.concurrencyCores} Cores (Spoofed)`
                    : `${navigator.hardwareConcurrency || 8} Cores (Raw)`}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-slate-400">Spoof Preset:</span>
                <select
                  value={noiseSettings.concurrencyCores}
                  onChange={e => updateNoiseSettings({ concurrencyCores: Number(e.target.value) })}
                  className="bg-[#181d2a] border border-white/10 rounded-lg px-2 py-1 text-slate-200 text-xs font-mono"
                >
                  <option value={2}>2 Cores (Low-end standard)</option>
                  <option value={4}>4 Cores (Most common desktop)</option>
                  <option value={8}>8 Cores (Modern standard)</option>
                </select>
              </div>

              <p className="text-[11px] text-slate-400">
                Prevents fingerprinting scripts from measuring core count to differentiate your device.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
