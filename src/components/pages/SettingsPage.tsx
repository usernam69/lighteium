import React, { useState } from 'react';
import { useBrowser } from '../../context/BrowserContext';
import {
  Settings,
  Layers,
  Shield,
  Search,
  FolderLock,
  Command,
  Info,
  Check,
  Cpu,
  Globe,
  Sliders,
  Sparkles,
  ExternalLink,
  Trash2,
  Lock,
  Moon,
  Sun,
  Layout
} from 'lucide-react';
import { LayoutMode } from '../../types/browser';
import { HELIUM_BANGS } from '../../data/bangs';

export const SettingsPage: React.FC = () => {
  const {
    preferences,
    updatePreferences,
    layoutMode,
    setLayoutMode,
    noiseSettings,
    updateNoiseSettings,
    ublockSettings,
    updateUBlockSettings,
    syncVault,
    updateSyncVault,
    setIsShortcutsOpen,
    createTab
  } = useBrowser();

  const [activeSection, setActiveSection] = useState<
    'appearance' | 'privacy' | 'shield' | 'search' | 'vault' | 'about'
  >('appearance');

  return (
    <div className="h-full flex bg-[#0e1118] text-slate-100 select-none overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-60 border-r border-white/5 bg-[#121622] p-4 flex flex-col justify-between flex-shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-3 py-2 mb-3">
            <Settings className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-sm tracking-tight text-white">Helium Settings</span>
          </div>

          {[
            { id: 'appearance', label: 'Appearance & Layout', icon: <Layers className="w-4 h-4 text-blue-400" /> },
            { id: 'privacy', label: 'Privacy & Noise', icon: <Cpu className="w-4 h-4 text-emerald-400" /> },
            { id: 'shield', label: 'uBlock Origin Shield', icon: <Shield className="w-4 h-4 text-indigo-400" /> },
            { id: 'search', label: 'Search & Bangs', icon: <Search className="w-4 h-4 text-amber-400" /> },
            { id: 'vault', label: 'Sync Vault', icon: <FolderLock className="w-4 h-4 text-cyan-400" /> },
            { id: 'about', label: 'About Helium', icon: <Info className="w-4 h-4 text-slate-400" /> },
          ].map(sec => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeSection === sec.id
                  ? 'bg-blue-600/20 text-white border border-blue-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {sec.icon}
              <span>{sec.label}</span>
            </button>
          ))}
        </div>

        <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-[11px] text-slate-400 space-y-1">
          <div className="font-semibold text-slate-200">De-Googled Core</div>
          <div>No Google account links, telemetry or tracking beacons enabled.</div>
        </div>
      </aside>

      {/* Main Settings Content */}
      <main className="flex-1 overflow-y-auto p-8 max-w-4xl">
        {/* Section 1: Appearance & Layout */}
        {activeSection === 'appearance' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h1 className="text-xl font-bold text-white">Appearance & Layout</h1>
              <p className="text-xs text-slate-400 mt-1">
                Customize your browser window geometry, tab placement, and chrome density.
              </p>
            </div>

            {/* Layout Mode Selection */}
            <div className="p-5 bg-[#141824] border border-white/10 rounded-3xl space-y-4">
              <h2 className="text-sm font-semibold text-white">Browser Layout Mode</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { mode: 'dynamic', title: 'Dynamic Layout', desc: 'Fluid tab strip adapts to window width and split views' },
                  { mode: 'compact', title: 'Compact Single-Row', desc: 'Tabs & omnibox in a single condensed row' },
                  { mode: 'horizontal', title: 'Horizontal Tabs', desc: 'Classic multi-tab bar positioned along the top edge' },
                  { mode: 'vertical', title: 'Vertical Tabs Sidebar', desc: 'Sleek vertical sidebar on the left with tree groups' },
                  { mode: 'zen', title: 'Zen Mode', desc: 'Zero distractions: all chrome hidden with top hover reveal' },
                ].map(item => (
                  <div
                    key={item.mode}
                    onClick={() => {
                      setLayoutMode(item.mode as LayoutMode);
                      updatePreferences({ layoutMode: item.mode as LayoutMode });
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      layoutMode === item.mode
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                        : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                    }`}
                  >
                    <div className="font-semibold text-xs mb-1 flex items-center justify-between">
                      <span>{item.title}</span>
                      {layoutMode === item.mode && <Check className="w-3.5 h-3.5 text-blue-400" />}
                    </div>
                    <div className="text-[11px] text-slate-400">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="p-5 bg-[#141824] border border-white/10 rounded-3xl space-y-4 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <div>
                  <div className="font-semibold text-slate-200">Show Bookmarks Bar</div>
                  <div className="text-[11px] text-slate-400">Display quick bookmark tiles beneath the omnibox</div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.showBookmarksBar}
                  onChange={e => updatePreferences({ showBookmarksBar: e.target.checked })}
                  className="rounded text-blue-600 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <div>
                  <div className="font-semibold text-slate-200">Memory Saver by Default</div>
                  <div className="text-[11px] text-slate-400">
                    Automatically hibernate background tabs after 5 minutes of inactivity to save RAM
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.memorySaverDefault}
                  onChange={e => updatePreferences({ memorySaverDefault: e.target.checked })}
                  className="rounded text-blue-600 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-1">
                <div>
                  <div className="font-semibold text-slate-200">Configure Keyboard Shortcuts</div>
                  <div className="text-[11px] text-slate-400">Remap key combinations for tabs and layout controls</div>
                </div>
                <button
                  onClick={() => setIsShortcutsOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white font-medium transition-colors"
                >
                  Edit Shortcuts
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Privacy & Noise */}
        {activeSection === 'privacy' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h1 className="text-xl font-bold text-white">Privacy & Fingerprinting Protection</h1>
              <p className="text-xs text-slate-400 mt-1">
                Helium adds imperceptible noise to browser features to make device tracking impossible.
              </p>
            </div>

            <div className="p-5 bg-[#141824] border border-white/10 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white">Helium Noise Global Switch</h2>
                  <p className="text-xs text-slate-400">Inject subtle per-session noise to Canvas 2D and AudioContext</p>
                </div>
                <input
                  type="checkbox"
                  checked={noiseSettings.enabled}
                  onChange={e => updateNoiseSettings({ enabled: e.target.checked })}
                  className="rounded text-blue-600 w-5 h-5 cursor-pointer"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={() => createTab('helium://noise', 'Fingerprint Lab')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs text-white font-medium transition-colors flex items-center gap-2"
                >
                  <Cpu className="w-4 h-4" />
                  <span>Open Interactive Fingerprint Lab</span>
                </button>
              </div>
            </div>

            <div className="p-5 bg-[#141824] border border-white/10 rounded-3xl space-y-4 text-xs">
              <h2 className="text-sm font-semibold text-white">Network & Transport Security</h2>

              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <div>
                  <div className="font-semibold text-slate-200">Global Privacy Control (GPC)</div>
                  <div className="text-[11px] text-slate-400">Emit Sec-GPC: 1 HTTP header to legally forbid selling data</div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.globalPrivacyControl}
                  onChange={e => updatePreferences({ globalPrivacyControl: e.target.checked })}
                  className="rounded text-blue-600 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <div>
                  <div className="font-semibold text-slate-200">Encrypted Client Hello (ECH)</div>
                  <div className="text-[11px] text-slate-400">Encrypts the SNI domain name during TLS handshakes</div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.enableECH}
                  onChange={e => updatePreferences({ enableECH: e.target.checked })}
                  className="rounded text-blue-600 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-1">
                <div>
                  <div className="font-semibold text-slate-200">Split ClientHello</div>
                  <div className="text-[11px] text-slate-400">Fragments TLS handshake packets to bypass middlebox censorship</div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.splitClientHello}
                  onChange={e => updatePreferences({ splitClientHello: e.target.checked })}
                  className="rounded text-blue-600 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 3: uBlock Origin Shield */}
        {activeSection === 'shield' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h1 className="text-xl font-bold text-white">Helium Shield & uBlock Origin</h1>
              <p className="text-xs text-slate-400 mt-1">
                Built-in uBlock Origin content blocker with DNS & CNAME uncloaking.
              </p>
            </div>

            <div className="p-5 bg-[#141824] border border-white/10 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white">Shield Master Switch</h2>
                  <p className="text-xs text-slate-400">Block banner ads, cross-site trackers, and malware domains</p>
                </div>
                <input
                  type="checkbox"
                  checked={ublockSettings.enabled}
                  onChange={e => updateUBlockSettings({ enabled: e.target.checked })}
                  className="rounded text-blue-600 w-5 h-5 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-5 bg-[#141824] border border-white/10 rounded-3xl space-y-3 text-xs">
              <h2 className="text-sm font-semibold text-white">Active Filter Lists</h2>
              {[
                { name: 'EasyList & EasyPrivacy', desc: 'Standard ad and behavioral tracking rules' },
                { name: 'Peter Lowe\'s Ad Server List', desc: 'Curated list of advertising and tracking servers' },
                { name: 'Helium Services Custom Filter', desc: 'De-googled telemetry blocking and CNAME uncloaking rules' },
                { name: 'uBlock filters – Badware risks', desc: 'Protects against fake software portals and drive-by miners' },
              ].map((fl, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl">
                  <div>
                    <div className="font-semibold text-slate-200">{fl.name}</div>
                    <div className="text-[11px] text-slate-400">{fl.desc}</div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Enabled
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Search & Bangs */}
        {activeSection === 'search' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h1 className="text-xl font-bold text-white">Search Engines & Native Bangs</h1>
              <p className="text-xs text-slate-400 mt-1">
                Direct omnibox bangs allow searching directly without third-party query monitoring.
              </p>
            </div>

            <div className="p-5 bg-[#141824] border border-white/10 rounded-3xl space-y-4">
              <h2 className="text-sm font-semibold text-white">Default Search Engine</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'duckduckgo', name: 'DuckDuckGo', desc: 'Privacy search without ads profiling' },
                  { id: 'kagi', name: 'Kagi', desc: 'Independent paid search engine' },
                  { id: 'brave', name: 'Brave Search', desc: 'Independent index and privacy ranking' },
                  { id: 'searx', name: 'SearXNG', desc: 'Self-hosted metasearch' },
                ].map(eng => (
                  <div
                    key={eng.id}
                    onClick={() => updatePreferences({ searchEngine: eng.id as any })}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      preferences.searchEngine === eng.id
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                    }`}
                  >
                    <div className="font-semibold text-xs flex items-center justify-between">
                      <span>{eng.name}</span>
                      {preferences.searchEngine === eng.id && <Check className="w-3.5 h-3.5 text-blue-400" />}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">{eng.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Native Bangs Catalog */}
            <div className="p-5 bg-[#141824] border border-white/10 rounded-3xl space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">Native Bangs Installed ({HELIUM_BANGS.length})</h2>
                <span className="text-[11px] text-slate-400 font-mono">Type !bang in Omnibox</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {HELIUM_BANGS.map(bang => (
                  <div key={bang.prefix} className="p-2.5 bg-white/5 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-200 flex items-center gap-2">
                        <span className="font-mono text-blue-400">{bang.prefix}</span>
                        <span>{bang.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[200px]">{bang.description}</div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{bang.category}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section 5: Sync Vault */}
        {activeSection === 'vault' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h1 className="text-xl font-bold text-white">Helium Sync Vault</h1>
              <p className="text-xs text-slate-400 mt-1">
                End-to-end encrypted local vault sync without Google cloud storage dependencies.
              </p>
            </div>

            <div className="p-5 bg-[#141824] border border-white/10 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white">Vault Status</h2>
                  <p className="text-xs text-slate-400">Zero-knowledge encrypted local loopback storage</p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-mono text-xs rounded-xl font-bold">
                  UNLOCKED & SYNCED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-white/5 rounded-xl">
                  <div className="text-slate-400 text-[11px]">Encrypted Payload Items:</div>
                  <div className="text-base font-bold text-white mt-0.5">{syncVault.encryptedItemsCount} items</div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl">
                  <div className="text-slate-400 text-[11px]">Server Transport:</div>
                  <div className="text-xs font-mono text-blue-300 mt-0.5 truncate">{syncVault.serverUrl}</div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-[#141824] border border-white/10 rounded-3xl space-y-3 text-xs">
              <h2 className="text-sm font-semibold text-white">Data Type Policy (Consent First)</h2>

              {Object.entries(syncVault.dataTypes).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <div className="capitalize text-slate-200 font-medium">
                    {key}
                    {key === 'passwords' && (
                      <span className="ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        Zero Trust Default: Off
                      </span>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={val}
                    onChange={e =>
                      updateSyncVault({
                        dataTypes: { ...syncVault.dataTypes, [key]: e.target.checked }
                      })
                    }
                    className="rounded text-blue-600 w-4 h-4 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 6: About Helium */}
        {activeSection === 'about' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="p-6 bg-[#141824] border border-white/10 rounded-3xl flex items-center gap-5">
              <img src="/resources/branding/product_logo.svg" alt="Helium" className="w-16 h-16 shadow-lg" />
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Helium Browser</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-normal">
                    Beta 0.1.0
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">The browser built around privacy, consent, and comfort.</p>
                <div className="text-[11px] font-mono text-slate-500 mt-2">
                  Based on Chromium 155.0.8059.84 • Revision 0
                </div>
              </div>
            </div>

            <div className="p-5 bg-[#141824] border border-white/10 rounded-3xl space-y-3 text-xs text-slate-400">
              <h2 className="text-sm font-semibold text-white">Open Source Credits & Patchsets</h2>
              <p>Helium builds on and credits these outstanding open source projects:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 font-medium">
                <li><strong className="text-white">ungoogled-chromium:</strong> Base de-googled patches and domain substitution</li>
                <li><strong className="text-white">Inox patchset:</strong> Update ping removal and strict default prefs</li>
                <li><strong className="text-white">Bromite:</strong> Client rects and measureText fingerprinting flags</li>
                <li><strong className="text-white">uBlock Origin:</strong> Built-in privacy shield and DNS uncloaking</li>
                <li><strong className="text-white">Brave:</strong> MRU tab cycling and custom importer routines</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
