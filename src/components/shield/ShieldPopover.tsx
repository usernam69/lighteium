import React, { useState } from 'react';
import { useBrowser } from '../../context/BrowserContext';
import { Shield, ShieldCheck, ShieldAlert, Cpu, Network, Check, ExternalLink, RefreshCw } from 'lucide-react';
import { testDomainSubstitution } from '../../utils/domainSubstitution';

export const ShieldPopover: React.FC = () => {
  const {
    activeTab,
    ublockSettings,
    updateUBlockSettings,
    noiseSettings,
    updateNoiseSettings,
    setIsShieldPopoverOpen,
    createTab
  } = useBrowser();

  const [activeTabSubView, setActiveTabSubView] = useState<'overview' | 'domain-sub' | 'filters'>('overview');

  let currentHostname = 'helium.local';
  try {
    if (activeTab.url.startsWith('http')) {
      currentHostname = new URL(activeTab.url).hostname;
    } else if (activeTab.url.startsWith('helium://')) {
      currentHostname = activeTab.url;
    }
  } catch {
    currentHostname = activeTab.url;
  }

  const subResult = testDomainSubstitution(activeTab.url);

  return (
    <div className="absolute top-12 right-2 w-88 bg-[#161b26] border border-white/10 rounded-2xl shadow-2xl z-50 text-slate-200 overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
      {/* Header */}
      <div className="p-4 bg-[#1f2637]/70 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl ${ublockSettings.enabled ? 'bg-blue-600/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-sm flex items-center gap-1.5">
              <span>Helium Shield</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                uBlock Core
              </span>
            </div>
            <div className="text-xs text-slate-400 truncate max-w-[190px]">
              {currentHostname}
            </div>
          </div>
        </div>

        <button
          onClick={() => updateUBlockSettings({ enabled: !ublockSettings.enabled })}
          className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
            ublockSettings.enabled
              ? 'bg-blue-600 hover:bg-blue-500 text-white'
              : 'bg-white/10 hover:bg-white/20 text-slate-300'
          }`}
        >
          {ublockSettings.enabled ? 'Active' : 'Paused'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 text-xs bg-[#12151e]">
        <button
          onClick={() => setActiveTabSubView('overview')}
          className={`flex-1 py-2 font-medium transition-colors ${activeTabSubView === 'overview' ? 'text-blue-400 border-b-2 border-blue-500 bg-white/5' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Protection
        </button>
        <button
          onClick={() => setActiveTabSubView('domain-sub')}
          className={`flex-1 py-2 font-medium transition-colors ${activeTabSubView === 'domain-sub' ? 'text-blue-400 border-b-2 border-blue-500 bg-white/5' : 'text-slate-400 hover:text-slate-200'}`}
        >
          De-Google
        </button>
        <button
          onClick={() => setActiveTabSubView('filters')}
          className={`flex-1 py-2 font-medium transition-colors ${activeTabSubView === 'filters' ? 'text-blue-400 border-b-2 border-blue-500 bg-white/5' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Filters
        </button>
      </div>

      <div className="p-4 space-y-4 max-h-[360px] overflow-y-auto">
        {activeTabSubView === 'overview' && (
          <>
            {/* Blocker Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Trackers Intercepted</div>
                <div className="text-xl font-bold text-white mt-1">
                  {ublockSettings.enabled ? ublockSettings.blockedStats.trackersBlocked.toLocaleString() : '0'}
                </div>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Ads Blocked</div>
                <div className="text-xl font-bold text-blue-400 mt-1">
                  {ublockSettings.enabled ? ublockSettings.blockedStats.adsBlocked.toLocaleString() : '0'}
                </div>
              </div>
            </div>

            {/* Quick Protections Toggles */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-medium text-slate-200">Helium Noise (Fingerprinting)</div>
                    <div className="text-[11px] text-slate-400">Canvas & Audio spoofing active</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={noiseSettings.enabled}
                  onChange={e => updateNoiseSettings({ enabled: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2">
                  <Network className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="font-medium text-slate-200">DNS & CNAME Uncloaking</div>
                    <div className="text-[11px] text-slate-400">Reveal masked third-party beacons</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={ublockSettings.dnsUncloaking}
                  onChange={e => updateUBlockSettings({ dnsUncloaking: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="font-medium text-slate-200">Global Privacy Control (GPC)</div>
                    <div className="text-[11px] text-slate-400">Enforcing Sec-GPC: 1 header</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
                  ENFORCED
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsShieldPopoverOpen(false);
                createTab('helium://noise', 'Fingerprint Lab');
              }}
              className="w-full py-2 px-3 text-xs font-medium rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 flex items-center justify-center gap-2 transition-colors"
            >
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span>Test Fingerprint Noise Lab</span>
            </button>
          </>
        )}

        {activeTabSubView === 'domain-sub' && (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-blue-950/40 border border-blue-500/20 rounded-xl text-slate-300">
              <span className="font-semibold text-blue-300">Domain Substitution</span> replaces telemetry, GAIA authentication endpoints, and Google font probes at the network layer.
            </div>

            {subResult.replaced ? (
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl space-y-1">
                <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Matched De-Google Rule
                </div>
                <div className="text-[11px] text-slate-400">{subResult.matchedRule?.description}</div>
                <div className="font-mono text-[11px] text-slate-300 break-all bg-black/40 p-2 rounded mt-1">
                  Replaced with: <span className="text-emerald-300">{subResult.resultUrl}</span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-white/5 rounded-xl text-slate-400 text-center">
                No active Google telemetry detected on this page. All outbound requests remain clean.
              </div>
            )}

            <div className="text-[11px] text-slate-400">
              Active rules from <code className="text-blue-300">domain_substitution.list</code>:
              <ul className="list-disc list-inside mt-1 space-y-0.5 font-mono text-[10px]">
                <li>clients*.google.com &rarr; qjz9zk.clients.invalid</li>
                <li>safebrowsing.googleapis.com &rarr; 127.0.0.1:9</li>
                <li>accounts.google.com/ListAccounts &rarr; blocked</li>
                <li>fonts.googleapis.com &rarr; fonts.helium.local</li>
              </ul>
            </div>
          </div>
        )}

        {activeTabSubView === 'filters' && (
          <div className="space-y-2 text-xs">
            <div className="font-semibold text-slate-300 mb-1">Filter Lists Active</div>
            {[
              { name: 'Helium Services Filter', count: '14,290 rules', active: true },
              { name: 'uBlock Origin Filters', count: '38,102 rules', active: true },
              { name: 'EasyList & EasyPrivacy', count: '94,520 rules', active: true },
              { name: 'Peter Lowe\'s Ad Server List', count: '3,842 rules', active: true },
              { name: 'CNAME Uncloaking Rules', count: '1,920 rules', active: ublockSettings.cnameUncloaking },
            ].map((f, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <div>
                  <div className="font-medium text-slate-200">{f.name}</div>
                  <div className="text-[10px] text-slate-400">{f.count}</div>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 bg-[#12151e] border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
        <button
          onClick={() => {
            setIsShieldPopoverOpen(false);
            createTab('helium://settings', 'Settings');
          }}
          className="hover:text-blue-400 transition-colors flex items-center gap-1"
        >
          <span>Shield Preferences</span>
          <ExternalLink className="w-3 h-3" />
        </button>

        <span className="font-mono text-[10px] text-slate-500">v0.1.0 • Beta</span>
      </div>
    </div>
  );
};
