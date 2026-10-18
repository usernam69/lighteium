import React from 'react';
import { BangItem } from '../../types/browser';
import { HELIUM_BANGS } from '../../data/bangs';
import { Search, Sparkles, Globe, Terminal, BookOpen, Film, Tag } from 'lucide-react';

interface BangsSuggestionsProps {
  query: string;
  selectedIndex: number;
  onSelect: (value: string) => void;
}

export const BangsSuggestions: React.FC<BangsSuggestionsProps> = ({ query, selectedIndex, onSelect }) => {
  const trimmed = query.trim().toLowerCase();

  // If query starts with or includes "!"
  const isBangSearch = query.includes('!');
  const matchedBangs: BangItem[] = isBangSearch
    ? HELIUM_BANGS.filter(b => b.prefix.toLowerCase().includes(trimmed.split(/\s+/)[0]) || b.name.toLowerCase().includes(trimmed))
    : HELIUM_BANGS.slice(0, 5);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI / Ask':
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
      case 'Developer':
        return <Terminal className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Knowledge':
        return <BookOpen className="w-3.5 h-3.5 text-blue-400" />;
      case 'Media':
        return <Film className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <Search className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  const internalPages = [
    { title: 'New Tab', url: 'helium://newtab', desc: 'Default starting page' },
    { title: 'Helium Onboarding Setup', url: 'helium://setup', desc: 'Setup wizard & browser importer' },
    { title: 'Fingerprint Noise Lab', url: 'helium://noise', desc: 'Canvas & audio anti-fingerprinting test' },
    { title: 'Helium Patchset Explorer', url: 'helium://patches', desc: 'Inspect Helium & ungoogled patches' },
    { title: 'GN Flags Configurator', url: 'helium://flags', desc: 'Inspect and export flags.gn' },
    { title: 'Helium Settings', url: 'helium://settings', desc: 'Preferences, shields, layout, vault' },
  ].filter(p => p.title.toLowerCase().includes(trimmed) || p.url.toLowerCase().includes(trimmed));

  return (
    <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#161b26] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 text-xs backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
      {/* Ask / AI Keyword Chip if !ai */}
      {query.startsWith('!ai') && (
        <div className="p-3 bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-blue-900/40 border-b border-blue-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="font-semibold text-blue-200">Helium Ask Mode</span>
            <span className="text-[11px] text-slate-400">Zero data retention query</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px]">
            DIRECT BANG
          </span>
        </div>
      )}

      {/* Internal pages matching */}
      {internalPages.length > 0 && (
        <div className="p-2 border-b border-white/5">
          <div className="text-[10px] font-semibold text-slate-500 px-2 py-1 uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-blue-400" /> Helium Internal Pages
          </div>
          {internalPages.slice(0, 3).map((page, i) => (
            <div
              key={page.url}
              onClick={() => onSelect(page.url)}
              className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/10 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <div>
                  <div className="font-medium text-slate-200">{page.title}</div>
                  <div className="font-mono text-[10px] text-blue-400/80">{page.url}</div>
                </div>
              </div>
              <span className="text-[10px] text-slate-500">{page.desc}</span>
            </div>
          ))}
        </div>
      )}

      {/* Native Bangs section */}
      <div className="p-2">
        <div className="text-[10px] font-semibold text-slate-500 px-2 py-1 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Tag className="w-3 h-3 text-purple-400" /> Native Bangs ({matchedBangs.length})
          </span>
          <span className="text-[10px] text-slate-500 normal-case font-normal">
            Type bang like <code className="text-blue-300">!kagi</code> or <code className="text-blue-300">!w</code>
          </span>
        </div>

        <div className="space-y-0.5">
          {matchedBangs.map((bang, i) => {
            const isSelected = i === selectedIndex;
            return (
              <div
                key={bang.prefix}
                onClick={() => {
                  const parts = query.trim().split(/\s+/);
                  const cleanQuery = parts.slice(1).join(' ');
                  onSelect(`${bang.prefix} ${cleanQuery}`.trim());
                }}
                className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all ${
                  isSelected ? 'bg-blue-600/25 border border-blue-500/40 text-white' : 'hover:bg-white/5 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {bang.prefix}
                  </span>
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      <span>{bang.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({bang.category})</span>
                    </div>
                    <div className="text-[11px] text-slate-400">{bang.description}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getCategoryIcon(bang.category)}
                  <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">Press Enter</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
