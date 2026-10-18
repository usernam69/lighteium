import React, { useState } from 'react';
import { useBrowser } from '../../context/BrowserContext';
import {
  Search,
  Shield,
  Cpu,
  Lock,
  Layers,
  Sparkles,
  ExternalLink,
  Code2,
  Terminal,
  Globe,
  Plus
} from 'lucide-react';
import { HELIUM_BANGS, findBang } from '../../data/bangs';

export const NewTabPage: React.FC = () => {
  const {
    activeTab,
    navigateTab,
    ublockSettings,
    noiseSettings,
    syncVault,
    preferences,
    createTab
  } = useBrowser();

  const [query, setQuery] = useState('');

  const quickTiles = [
    { title: 'Onboarding Setup', url: 'helium://setup', monogram: 'ST', color: 'from-blue-600 to-indigo-700' },
    { title: 'Fingerprint Lab', url: 'helium://noise', monogram: 'FP', color: 'from-emerald-600 to-teal-700' },
    { title: 'Patch Explorer', url: 'helium://patches', monogram: 'PT', color: 'from-purple-600 to-indigo-800' },
    { title: 'GN Flags Config', url: 'helium://flags', monogram: 'GN', color: 'from-amber-600 to-orange-700' },
    { title: 'Kagi Search', url: 'https://kagi.com', monogram: 'KG', color: 'from-yellow-600 to-amber-700' },
    { title: 'DuckDuckGo', url: 'https://duckduckgo.com', monogram: 'DG', color: 'from-orange-600 to-red-600' },
    { title: 'GitHub', url: 'https://github.com/imputnet/helium-macos', monogram: 'GH', color: 'from-slate-700 to-slate-900' },
    { title: 'Wikipedia', url: 'https://en.wikipedia.org', monogram: 'WK', color: 'from-cyan-700 to-blue-800' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const { bang, cleanQuery } = findBang(query.trim());
    if (bang) {
      if (bang.prefix === '!ai') {
        navigateTab(activeTab.id, `helium://ai?q=${encodeURIComponent(cleanQuery)}`, `Ask: ${cleanQuery}`);
        return;
      }
      navigateTab(activeTab.id, bang.urlTemplate.replace('{q}', encodeURIComponent(cleanQuery)), `${bang.name}: ${cleanQuery}`);
    } else {
      let url = `https://duckduckgo.com/?q=${encodeURIComponent(query.trim())}`;
      if (preferences.searchEngine === 'kagi') url = `https://kagi.com/search?q=${encodeURIComponent(query.trim())}`;
      else if (preferences.searchEngine === 'brave') url = `https://search.brave.com/search?q=${encodeURIComponent(query.trim())}`;
      navigateTab(activeTab.id, url, `Search: ${query.trim()}`);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-[#0e1118] via-[#121622] to-[#0e1118] text-slate-100 p-6 md:p-12 flex flex-col items-center select-none">
      <div className="w-full max-w-4xl flex flex-col items-center my-auto py-8">
        {/* Helium Logo & Branding */}
        <div className="flex flex-col items-center mb-8 text-center animate-in fade-in duration-500">
          <div className="relative mb-4 group cursor-pointer" onClick={() => createTab('helium://setup')}>
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-40 blur-lg group-hover:opacity-75 transition duration-300" />
            <img
              src="/resources/branding/product_logo.svg"
              alt="Helium"
              className="relative w-20 h-20 shadow-2xl drop-shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>Helium</span>
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Beta 0.1.0
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-md">
            The browser built around privacy, consent, and comfort. Free from telemetry, trackers, and Google services.
          </p>
        </div>

        {/* Centered Search Bar */}
        <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl mb-8">
          <div className="relative flex items-center bg-[#171c2b] border border-white/10 hover:border-blue-500/50 focus-within:border-blue-500 rounded-2xl shadow-xl transition-all p-2 focus-within:ring-4 focus-within:ring-blue-500/10">
            <Search className="w-5 h-5 text-slate-400 ml-3 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search or enter bang (!kagi, !ddg, !w, !gh, !ai, !yt)..."
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
            >
              <span>Search</span>
            </button>
          </div>

          {/* Bang suggestions pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-xs text-slate-400">
            <span className="text-[11px] text-slate-500 mr-1">Try native bangs:</span>
            {HELIUM_BANGS.slice(0, 7).map(b => (
              <button
                key={b.prefix}
                type="button"
                onClick={() => setQuery(`${b.prefix} `)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/5 font-mono text-[11px] cursor-pointer"
              >
                <span className="text-blue-400 font-bold">{b.prefix}</span> {b.name}
              </button>
            ))}
          </div>
        </form>

        {/* Square NTP Monograms (from patches/helium/ui/square-ntp-monograms.patch) */}
        <div className="w-full max-w-3xl mb-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickTiles.map(tile => (
              <div
                key={tile.url}
                onClick={() => navigateTab(activeTab.id, tile.url, tile.title)}
                className="group p-3 rounded-2xl bg-[#141824] hover:bg-[#1b2132] border border-white/5 hover:border-white/15 transition-all cursor-pointer flex items-center gap-3 shadow-md"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tile.color} flex items-center justify-center font-bold font-mono text-sm text-white shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform`}
                >
                  {tile.monogram}
                </div>
                <div className="truncate">
                  <div className="text-xs font-medium text-slate-200 group-hover:text-white truncate">
                    {tile.title}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono truncate">
                    {tile.url.replace('https://', '')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Privacy & Security Shield Overview */}
        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-3">
          <div
            onClick={() => createTab('helium://settings')}
            className="p-4 rounded-2xl bg-[#141824]/80 border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-blue-400 mb-2">
              <Shield className="w-5 h-5" />
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                ACTIVE
              </span>
            </div>
            <div className="text-lg font-bold text-white">
              {ublockSettings.blockedStats.totalBlocked.toLocaleString()} Blocked
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Integrated uBlock Origin engine with CNAME uncloaking
            </div>
          </div>

          <div
            onClick={() => createTab('helium://noise')}
            className="p-4 rounded-2xl bg-[#141824]/80 border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <Cpu className="w-5 h-5" />
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                {noiseSettings.enabled ? 'PROTECTED' : 'DISABLED'}
              </span>
            </div>
            <div className="text-lg font-bold text-white">Helium Noise</div>
            <div className="text-xs text-slate-400 mt-0.5">
              Subtle canvas & audio noise defeats tracking fingerprints
            </div>
          </div>

          <div
            onClick={() => createTab('helium://patches')}
            className="p-4 rounded-2xl bg-[#141824]/80 border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-purple-400 mb-2">
              <Lock className="w-5 h-5" />
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                DE-GOOGLED
              </span>
            </div>
            <div className="text-lg font-bold text-white">Zero Telemetry</div>
            <div className="text-xs text-slate-400 mt-0.5">
              Google hosts replaced with loopback; no field trials or GAIA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
