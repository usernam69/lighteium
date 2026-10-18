import React, { useState } from 'react';
import { useBrowser } from '../../context/BrowserContext';
import { DEFAULT_SHORTCUTS } from '../../data/defaultData';
import { KeyboardShortcut } from '../../types/browser';
import { Command, X, Search, RotateCcw } from 'lucide-react';

export const ShortcutsDialog: React.FC = () => {
  const { isShortcutsOpen, setIsShortcutsOpen } = useBrowser();
  const [shortcuts, setShortcuts] = useState<KeyboardShortcut[]>(DEFAULT_SHORTCUTS);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  if (!isShortcutsOpen) return null;

  const filtered = shortcuts.filter(
    s => s.label.toLowerCase().includes(search.toLowerCase()) || s.keyCombo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-xl bg-[#141824] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Command className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">Helium Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={() => setIsShortcutsOpen(false)}
            className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="bg-[#181d2a] px-3 py-2 rounded-xl border border-white/10 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search shortcut (e.g. Zen, Tab, Mute, Split)..."
            className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Shortcuts list */}
        <div className="max-h-[360px] overflow-y-auto space-y-2 pr-1">
          {filtered.map(sc => (
            <div
              key={sc.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs transition-colors"
            >
              <div>
                <div className="font-medium text-slate-200">{sc.label}</div>
                <div className="text-[10px] text-slate-500 font-mono">{sc.category}</div>
              </div>

              <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 font-bold">
                {sc.keyCombo}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={() => setShortcuts(DEFAULT_SHORTCUTS)}
            className="flex items-center gap-1.5 hover:text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Defaults</span>
          </button>

          <button
            onClick={() => setIsShortcutsOpen(false)}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
