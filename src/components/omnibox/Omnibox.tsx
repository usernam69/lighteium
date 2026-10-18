import React, { useState, useEffect, useRef } from 'react';
import { useBrowser } from '../../context/BrowserContext';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Lock,
  Star,
  Shield,
  Search,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { findBang } from '../../data/bangs';
import { BangsSuggestions } from './BangsSuggestions';
import { ShieldPopover } from '../shield/ShieldPopover';

export const Omnibox: React.FC = () => {
  const {
    activeTab,
    navigateTab,
    refreshTab,
    bookmarks,
    addBookmark,
    removeBookmark,
    ublockSettings,
    preferences,
    isShieldPopoverOpen,
    setIsShieldPopoverOpen
  } = useBrowser();

  const [inputVal, setInputVal] = useState(activeTab.url);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync input with active tab URL when tab changes or finishes navigating
  useEffect(() => {
    if (!isFocused) {
      setInputVal(activeTab.url);
    }
  }, [activeTab.url, isFocused]);

  const isBookmarked = bookmarks.some(b => b.url === activeTab.url);

  const handleToggleBookmark = () => {
    if (isBookmarked) {
      const match = bookmarks.find(b => b.url === activeTab.url);
      if (match) removeBookmark(match.id);
    } else {
      addBookmark(activeTab.title || activeTab.url, activeTab.url);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeNavigation(inputVal);
      inputRef.current?.blur();
      setIsFocused(false);
    } else if (e.key === 'Escape') {
      setInputVal(activeTab.url);
      setIsFocused(false);
      inputRef.current?.blur();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => prev + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(0, prev - 1));
    }
  };

  const executeNavigation = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    // Check for Helium internal protocol
    if (trimmed.startsWith('helium://') || trimmed === 'about:blank') {
      navigateTab(activeTab.id, trimmed);
      return;
    }

    // Check for native bang e.g. !kagi, !ddg, !w, !gh
    const { bang, cleanQuery } = findBang(trimmed);
    if (bang) {
      if (bang.prefix === '!ai') {
        const dest = `helium://ai?q=${encodeURIComponent(cleanQuery)}`;
        navigateTab(activeTab.id, dest, `Ask: ${cleanQuery || 'Query'}`);
        return;
      }
      const targetUrl = bang.urlTemplate.replace('{q}', encodeURIComponent(cleanQuery));
      navigateTab(activeTab.id, targetUrl, `${bang.name}: ${cleanQuery}`);
      return;
    }

    // Check if looks like a domain name e.g. wikipedia.org, github.com/user, localhost:3000
    const domainRegex = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      navigateTab(activeTab.id, trimmed);
    } else if (domainRegex.test(trimmed) || trimmed.startsWith('localhost:')) {
      navigateTab(activeTab.id, `https://${trimmed}`);
    } else {
      // Default search engine fallback
      let searchEngineUrl = 'https://duckduckgo.com/?q={q}';
      if (preferences.searchEngine === 'kagi') searchEngineUrl = 'https://kagi.com/search?q={q}';
      else if (preferences.searchEngine === 'brave') searchEngineUrl = 'https://search.brave.com/search?q={q}';
      else if (preferences.searchEngine === 'searx') searchEngineUrl = 'https://searx.be/search?q={q}';
      else if (preferences.searchEngine === 'google') searchEngineUrl = 'https://www.google.com/search?q={q}';

      const targetUrl = searchEngineUrl.replace('{q}', encodeURIComponent(trimmed));
      navigateTab(activeTab.id, targetUrl, `Search: ${trimmed}`);
    }
  };

  // Detected bang indicator
  const { bang: currentBang } = findBang(inputVal);

  return (
    <div className="relative flex items-center gap-1.5 flex-1 max-w-4xl mx-auto">
      {/* Navigation Buttons */}
      <div className="flex items-center text-slate-400 gap-0.5">
        <button
          onClick={() => {}}
          title="Back"
          className="p-1.5 hover:bg-white/10 hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => {}}
          title="Forward"
          className="p-1.5 hover:bg-white/10 hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => refreshTab(activeTab.id)}
          title="Reload"
          className={`p-1.5 hover:bg-white/10 hover:text-slate-200 rounded-lg transition-colors cursor-pointer ${
            activeTab.isLoading ? 'animate-spin text-blue-400' : ''
          }`}
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Omnibox Input Container */}
      <div
        className={`relative flex items-center flex-1 h-9 px-3 rounded-xl border transition-all ${
          isFocused
            ? 'bg-[#121622] border-blue-500/80 ring-2 ring-blue-500/20 shadow-lg'
            : 'bg-[#181d2a]/80 hover:bg-[#1c2232] border-white/10'
        }`}
      >
        {/* Security / Protocol / Bang Badge */}
        <div className="flex items-center mr-2 text-slate-400 select-none">
          {currentBang ? (
            <span className="flex items-center gap-1 text-[11px] font-mono font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-md border border-blue-500/30">
              <Search className="w-3 h-3 text-blue-400" />
              <span>{currentBang.name}</span>
            </span>
          ) : activeTab.url.startsWith('helium://') ? (
            <span className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
              <span>helium</span>
            </span>
          ) : activeTab.url.startsWith('https://') ? (
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Search className="w-3.5 h-3.5 text-slate-400" />
          )}
        </div>

        {/* Input Text Field */}
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            inputRef.current?.select();
          }}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder="Search with DuckDuckGo or enter address (!ddg, !kagi, !w, !gh)"
          className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
        />

        {/* Right Action Icons in Omnibox */}
        <div className="flex items-center gap-1 text-slate-400">
          {/* Bookmark Star */}
          <button
            onClick={handleToggleBookmark}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark this tab'}
            className="p-1 hover:bg-white/10 rounded-md transition-colors cursor-pointer"
          >
            <Star
              className={`w-3.5 h-3.5 ${
                isBookmarked ? 'text-amber-400 fill-amber-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            />
          </button>

          {/* Helium Shield / uBlock Icon */}
          <button
            onClick={() => setIsShieldPopoverOpen(!isShieldPopoverOpen)}
            title="Helium Shield (uBlock Origin & Noise Protection)"
            className={`relative p-1 hover:bg-white/10 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
              ublockSettings.enabled ? 'text-blue-400' : 'text-slate-400'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            {ublockSettings.enabled && (
              <span className="text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 px-1 rounded">
                {ublockSettings.blockedStats.trackersBlocked > 999
                  ? `${(ublockSettings.blockedStats.trackersBlocked / 1000).toFixed(1)}k`
                  : ublockSettings.blockedStats.trackersBlocked}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Bangs Suggestions Dropdown */}
      {isFocused && (
        <BangsSuggestions
          query={inputVal}
          selectedIndex={selectedIndex}
          onSelect={val => {
            setInputVal(val);
            executeNavigation(val);
            setIsFocused(false);
          }}
        />
      )}

      {/* Helium Shield Popover Modal */}
      {isShieldPopoverOpen && <ShieldPopover />}
    </div>
  );
};
