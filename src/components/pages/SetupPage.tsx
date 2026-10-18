import React, { useState } from 'react';
import { useBrowser } from '../../context/BrowserContext';
import {
  Shield,
  Search,
  Layers,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Download,
  Check,
  ChevronRight,
  Compass,
  Cpu,
  Lock,
  Globe
} from 'lucide-react';
import { LayoutMode } from '../../types/browser';

export const SetupPage: React.FC = () => {
  const {
    preferences,
    updatePreferences,
    noiseSettings,
    updateNoiseSettings,
    layoutMode,
    setLayoutMode,
    navigateTab,
    activeTab
  } = useBrowser();

  const [step, setStep] = useState(1);
  const [selectedEngine, setSelectedEngine] = useState(preferences.searchEngine);
  const [privacyProfile, setPrivacyProfile] = useState<'balanced' | 'strict' | 'custom'>('strict');
  const [selectedLayout, setSelectedLayout] = useState<LayoutMode>(layoutMode);
  const [importedBrowser, setImportedBrowser] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<string>('');

  const searchEngines = [
    { id: 'duckduckgo', name: 'DuckDuckGo', desc: 'Private search with zero profiling', tag: 'Default' },
    { id: 'kagi', name: 'Kagi', desc: 'Premium ad-free search with customizable ranking', tag: 'Fast' },
    { id: 'brave', name: 'Brave Search', desc: 'Independent index not dependent on big tech', tag: 'Independent' },
    { id: 'searx', name: 'SearXNG', desc: 'Decentralized open-source metasearch engine', tag: 'FOSS' },
  ];

  const browserImporters = [
    { id: 'arc', name: 'Arc Browser', desc: 'Import Spaces, Pinned Tabs, and Bookmarks', tag: 'Helium Arc Importer' },
    { id: 'zen', name: 'Zen Browser', desc: 'Import Workspaces, Vertical Tab groups & Themes', tag: 'Helium Zen Importer' },
    { id: 'chrome', name: 'Google Chrome', desc: 'Import Bookmarks, History, and Autofill entries', tag: 'Standard' },
    { id: 'firefox', name: 'Mozilla Firefox', desc: 'Import Bookmarks, History, and Saved Logins', tag: 'Standard' },
    { id: 'safari', name: 'Apple Safari', desc: 'Import Bookmarks and Reading List (Full Disk Access)', tag: 'macOS' },
  ];

  const handleFinish = () => {
    updatePreferences({ searchEngine: selectedEngine as any, layoutMode: selectedLayout });
    setLayoutMode(selectedLayout);
    navigateTab(activeTab.id, 'helium://newtab', 'New Tab');
  };

  const handleImport = (id: string) => {
    setImportedBrowser(id);
    setImportStatus('Reading database files...');
    setTimeout(() => {
      setImportStatus('Decrypting bookmarks & pinned tabs...');
      setTimeout(() => {
        setImportStatus('Successfully imported 24 bookmarks and 4 tab spaces!');
      }, 700);
    }, 600);
  };

  return (
    <div className="h-full overflow-y-auto bg-[#0e1118] text-slate-100 p-6 md:p-12 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-[#141824] border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-white/10">
          <img src="/resources/branding/product_logo.svg" alt="Helium" className="w-12 h-12" />
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Helium Onboarding</span>
              <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                helium://setup
              </span>
            </h1>
            <p className="text-xs text-slate-400">Configure your privacy defaults and browsing comfort</p>
          </div>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-between my-6 px-2">
          {[
            { num: 1, label: 'Search' },
            { num: 2, label: 'Privacy' },
            { num: 3, label: 'Layout' },
            { num: 4, label: 'Import' },
          ].map(s => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === s.num
                    ? 'bg-blue-600 text-white'
                    : step > s.num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white/10 text-slate-400'
                }`}
              >
                {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
              </div>
              <span className={`text-xs font-medium hidden sm:inline ${step === s.num ? 'text-white' : 'text-slate-500'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1: Search Engine */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-base font-semibold text-white">Choose your default search engine</h2>
              <p className="text-xs text-slate-400 mt-1">
                Helium does not bundle sponsored search redirects. All queries are direct and unmonitored.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {searchEngines.map(engine => (
                <div
                  key={engine.id}
                  onClick={() => setSelectedEngine(engine.id as any)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    selectedEngine === engine.id
                      ? 'bg-blue-600/15 border-blue-500 text-white shadow-md'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">{engine.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                      {engine.tag}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">{engine.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Privacy Profile */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-base font-semibold text-white">Select your privacy & fingerprinting defense level</h2>
              <p className="text-xs text-slate-400 mt-1">
                Helium includes active noise injection on canvas and audio buffers to defeat device profiling.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div
                onClick={() => {
                  setPrivacyProfile('strict');
                  updateNoiseSettings({ enabled: true, canvasNoise: true, audioNoise: true });
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  privacyProfile === 'strict'
                    ? 'bg-blue-600/15 border-blue-500 text-white'
                    : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    <span className="font-semibold text-sm">Helium Strict (Recommended)</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    Maximum Protection
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-2 pl-7">
                  Active Canvas Noise + AudioContext perturbation + uBlock Origin + Domain substitution to nullify all Google tracking.
                </div>
              </div>

              <div
                onClick={() => {
                  setPrivacyProfile('balanced');
                  updateNoiseSettings({ enabled: true, canvasNoise: true, audioNoise: false });
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  privacyProfile === 'balanced'
                    ? 'bg-blue-600/15 border-blue-500 text-white'
                    : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-blue-400" />
                    <span className="font-semibold text-sm">Balanced Shield</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                    High Compatibility
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-2 pl-7">
                  Full ad and tracker blocking with selective canvas protection for delicate media creation apps.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Layout Mode */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-base font-semibold text-white">Choose your layout mode</h2>
              <p className="text-xs text-slate-400 mt-1">
                Helium supports fluid responsive layouts. You can change this anytime with <code className="text-blue-300 font-mono">Ctrl+Shift+D</code>.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { id: 'dynamic', title: 'Dynamic Layout', desc: 'Tabs & chrome seamlessly adapt to window width and split view' },
                { id: 'compact', title: 'Compact Single-Row', desc: 'Maximum vertical space: tabs and omnibox share a single row' },
                { id: 'vertical', title: 'Vertical Tabs Sidebar', desc: 'Tree tab groups and pins on the left edge' },
                { id: 'zen', title: 'Zen Mode', desc: 'No chrome, no borders, auto-hiding controls for deep focus' },
              ].map(lm => (
                <div
                  key={lm.id}
                  onClick={() => setSelectedLayout(lm.id as any)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedLayout === lm.id
                      ? 'bg-blue-600/15 border-blue-500 text-white shadow-md'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  <div className="font-semibold text-sm mb-1">{lm.title}</div>
                  <div className="text-xs text-slate-400">{lm.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Importer */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-base font-semibold text-white">Import from another browser</h2>
              <p className="text-xs text-slate-400 mt-1">
                Helium includes native Arc and Zen browser importers in addition to standard browsers.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              {browserImporters.map(b => (
                <div
                  key={b.id}
                  onClick={() => handleImport(b.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    importedBrowser === b.id
                      ? 'bg-blue-600/20 border-blue-500 text-white'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-xs flex items-center gap-2">
                      <span>{b.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-blue-300">
                        {b.tag}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">{b.desc}</div>
                  </div>
                  <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-xs rounded-xl font-medium transition-colors">
                    {importedBrowser === b.id ? 'Imported' : 'Import'}
                  </button>
                </div>
              ))}
            </div>

            {importStatus && (
              <div className="p-3 bg-blue-950/40 border border-blue-500/20 rounded-xl text-xs text-blue-300 font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{importStatus}</span>
              </div>
            )}
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-8 mt-6 border-t border-white/10">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors"
            >
              Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/20"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-semibold text-white transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Launch Helium</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
