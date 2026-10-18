import React, { useState } from 'react';
import { useBrowser } from '../../context/BrowserContext';
import { Omnibox } from '../omnibox/Omnibox';
import {
  Columns,
  Maximize2,
  Sliders,
  Settings,
  Shield,
  Key,
  FolderLock,
  Layers,
  Sparkles,
  Command,
  Globe,
  MoreVertical,
  Star,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { LayoutMode } from '../../types/browser';

export const DynamicToolbar: React.FC = () => {
  const {
    layoutMode,
    setLayoutMode,
    splitTabId,
    toggleSplitView,
    bookmarks,
    navigateTab,
    activeTab,
    createTab,
    setIsShortcutsOpen,
    setIsVaultModalOpen,
    preferences
  } = useBrowser();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLayoutSelectorOpen, setIsLayoutSelectorOpen] = useState(false);

  const layoutModesList: { mode: LayoutMode; label: string; desc: string }[] = [
    { mode: 'dynamic', label: 'Dynamic Layout', desc: 'Fluid tab strip adapting to window geometry' },
    { mode: 'compact', label: 'Compact Single-Row', desc: 'Tabs & omnibox aligned in single row' },
    { mode: 'horizontal', label: 'Horizontal Tabs', desc: 'Classic multi-tab strip on top' },
    { mode: 'vertical', label: 'Vertical Tabs', desc: 'Modern sidebar tabs with tree groups' },
    { mode: 'zen', label: 'Zen Mode', desc: 'Zero distractions, hidden chrome with hover reveal' },
  ];

  return (
    <div className="bg-[#121622] border-b border-white/5 select-none relative z-30">
      {/* Primary Row: Controls & Omnibox */}
      <div className="flex items-center gap-2 px-3 py-2">
        {/* Omnibox Component */}
        <Omnibox />

        {/* Toolbar Action Icons */}
        <div className="flex items-center gap-1 text-slate-300">
          {/* Split View Button */}
          <button
            onClick={() => toggleSplitView()}
            title={splitTabId ? 'Close Split View' : 'Split View (Ctrl+Alt+S)'}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              splitTabId
                ? 'bg-blue-600/30 text-blue-400 border border-blue-500/40 shadow-sm'
                : 'hover:bg-white/10 hover:text-white text-slate-400'
            }`}
          >
            <Columns className="w-4 h-4" />
          </button>

          {/* Layout Mode Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLayoutSelectorOpen(!isLayoutSelectorOpen)}
              title="Change Helium Layout"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span className="capitalize hidden md:inline">{layoutMode}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {isLayoutSelectorOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-60 bg-[#161b26] border border-white/10 rounded-2xl shadow-2xl p-1.5 z-50 text-xs backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                  Helium Layouts
                </div>
                {layoutModesList.map(item => (
                  <button
                    key={item.mode}
                    onClick={() => {
                      setLayoutMode(item.mode);
                      setIsLayoutSelectorOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl transition-colors flex flex-col ${
                      layoutMode === item.mode
                        ? 'bg-blue-600/20 text-white font-medium border border-blue-500/30'
                        : 'hover:bg-white/5 text-slate-300'
                    }`}
                  >
                    <div className="font-semibold">{item.label}</div>
                    <div className="text-[10px] text-slate-400">{item.desc}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Zen Mode Quick Toggle */}
          <button
            onClick={() => setLayoutMode(layoutMode === 'zen' ? 'dynamic' : 'zen')}
            title="Zen Mode (F11)"
            className="p-2 hover:bg-white/10 hover:text-white rounded-xl text-slate-400 transition-colors cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Sync Vault Button */}
          <button
            onClick={() => setIsVaultModalOpen(true)}
            title="Helium Encrypted Sync Vault"
            className="p-2 hover:bg-white/10 hover:text-white rounded-xl text-slate-400 transition-colors cursor-pointer"
          >
            <FolderLock className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Main App Menu */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              title="Helium Menu"
              className="p-2 hover:bg-white/10 hover:text-white rounded-xl text-slate-400 transition-colors cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-64 bg-[#161b26] border border-white/10 rounded-2xl shadow-2xl py-1.5 z-50 text-xs text-slate-200 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src="/resources/branding/product_logo.svg" alt="" className="w-4 h-4" />
                    <span className="font-semibold text-slate-100">Helium Browser</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                    Beta
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      createTab('helium://setup', 'Helium Setup');
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center gap-2.5 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <div>
                      <div className="font-medium text-slate-200">Onboarding Setup Wizard</div>
                      <div className="text-[10px] text-slate-400">Import from Arc, Zen, Chrome, Safari</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      createTab('helium://noise', 'Fingerprint Lab');
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center gap-2.5 transition-colors"
                  >
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="font-medium text-slate-200">Fingerprint Protection Lab</div>
                      <div className="text-[10px] text-slate-400">Canvas & Audio anti-tracking tester</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      createTab('helium://patches', 'Patchset Explorer');
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center gap-2.5 transition-colors"
                  >
                    <Layers className="w-4 h-4 text-purple-400" />
                    <div>
                      <div className="font-medium text-slate-200">Helium Patch Series Explorer</div>
                      <div className="text-[10px] text-slate-400">Inspect 150+ browser patches & diffs</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      createTab('helium://flags', 'GN Flags Builder');
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center gap-2.5 transition-colors"
                  >
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="font-medium text-slate-200">GN Flags Configurator</div>
                      <div className="text-[10px] text-slate-400">Manage flags.gn build options</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      createTab('helium://i18n', 'Languages & i18n');
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center gap-2.5 transition-colors"
                  >
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="font-medium text-slate-200">Internationalization (70+ langs)</div>
                      <div className="text-[10px] text-slate-400">Live locale and translation explorer</div>
                    </div>
                  </button>
                </div>

                <div className="border-t border-white/5 my-1" />

                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsShortcutsOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left hover:bg-white/10 flex items-center gap-2.5 transition-colors text-slate-300"
                  >
                    <Command className="w-4 h-4 text-slate-400" />
                    <span>Keyboard Shortcuts</span>
                  </button>

                  <button
                    onClick={() => {
                      createTab('helium://settings', 'Settings');
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left hover:bg-white/10 flex items-center gap-2.5 transition-colors text-slate-300"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Helium Settings</span>
                  </button>
                </div>

                <div className="p-2 border-t border-white/5 text-[10px] text-slate-500 font-mono text-center">
                  Chromium 155.0.8059.84 (Beta)
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bookmarks Bar */}
      {preferences.showBookmarksBar && bookmarks.length > 0 && (
        <div className="flex items-center px-3 py-1 gap-2 bg-[#0e1118] border-t border-white/5 text-xs text-slate-300 overflow-x-auto no-scrollbar">
          {bookmarks.map(bm => (
            <button
              key={bm.id}
              onClick={() => navigateTab(activeTab.id, bm.url, bm.title)}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-md hover:bg-white/5 hover:text-white transition-colors flex-shrink-0 cursor-pointer"
            >
              {bm.url.startsWith('helium://') ? (
                <img src="/resources/branding/product_logo.svg" alt="" className="w-3 h-3" />
              ) : (
                <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400/50" />
              )}
              <span className="truncate max-w-[120px]">{bm.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
