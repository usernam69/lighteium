import React, { useEffect, useRef } from 'react';
import { useBrowser } from '../../context/BrowserContext';
import {
  VolumeX,
  Volume2,
  Copy,
  Columns,
  Pin,
  Trash2,
  Snowflake,
  ArrowLeftToLine,
  XSquare,
  Plus
} from 'lucide-react';

interface TabContextMenuProps {
  x: number;
  y: number;
  tabId: string;
  onClose: () => void;
}

export const TabContextMenu: React.FC<TabContextMenuProps> = ({ x, y, tabId, onClose }) => {
  const {
    tabs,
    closeTab,
    closeTabsToLeft,
    closeOtherTabs,
    toggleMuteTab,
    togglePinTab,
    toggleHibernateTab,
    duplicateTab,
    toggleSplitView,
    createTab
  } = useBrowser();

  const menuRef = useRef<HTMLDivElement>(null);
  const targetTab = tabs.find(t => t.id === tabId);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!targetTab) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(targetTab.url);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      style={{ top: Math.min(y, window.innerHeight - 300), left: Math.min(x, window.innerWidth - 220) }}
      className="fixed z-50 w-56 bg-[#161b26] border border-white/10 rounded-xl shadow-2xl py-1 text-xs text-slate-200 backdrop-blur-md animate-in fade-in zoom-in-95 duration-100"
    >
      <button
        onClick={() => {
          createTab('helium://newtab');
          onClose();
        }}
        className="w-full px-3 py-1.5 text-left flex items-center gap-2.5 hover:bg-white/10 transition-colors"
      >
        <Plus className="w-3.5 h-3.5 text-slate-400" />
        <span>New Tab to Right</span>
      </button>

      <button
        onClick={() => {
          duplicateTab(tabId);
          onClose();
        }}
        className="w-full px-3 py-1.5 text-left flex items-center gap-2.5 hover:bg-white/10 transition-colors"
      >
        <Copy className="w-3.5 h-3.5 text-slate-400" />
        <span>Duplicate Tab</span>
      </button>

      <button
        onClick={() => {
          togglePinTab(tabId);
          onClose();
        }}
        className="w-full px-3 py-1.5 text-left flex items-center gap-2.5 hover:bg-white/10 transition-colors"
      >
        <Pin className="w-3.5 h-3.5 text-slate-400" />
        <span>{targetTab.isPinned ? 'Unpin Tab' : 'Pin Tab'}</span>
      </button>

      <button
        onClick={() => {
          toggleMuteTab(tabId);
          onClose();
        }}
        className="w-full px-3 py-1.5 text-left flex items-center gap-2.5 hover:bg-white/10 transition-colors"
      >
        {targetTab.isMuted ? (
          <>
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Unmute Tab</span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            <span>Mute Tab</span>
          </>
        )}
      </button>

      <button
        onClick={() => {
          toggleHibernateTab(tabId);
          onClose();
        }}
        className="w-full px-3 py-1.5 text-left flex items-center gap-2.5 hover:bg-white/10 transition-colors text-cyan-300"
      >
        <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
        <span>{targetTab.isHibernated ? 'Thaw / Wake Tab' : 'Hibernate Tab (Save RAM)'}</span>
      </button>

      <button
        onClick={() => {
          toggleSplitView(tabId);
          onClose();
        }}
        className="w-full px-3 py-1.5 text-left flex items-center gap-2.5 hover:bg-white/10 transition-colors"
      >
        <Columns className="w-3.5 h-3.5 text-blue-400" />
        <span>Open in Split View</span>
      </button>

      <button
        onClick={handleCopyUrl}
        className="w-full px-3 py-1.5 text-left flex items-center gap-2.5 hover:bg-white/10 transition-colors"
      >
        <Copy className="w-3.5 h-3.5 text-slate-400" />
        <span>Copy Tab URL</span>
      </button>

      <div className="my-1 border-t border-white/5" />

      <button
        onClick={() => {
          closeTabsToLeft(tabId);
          onClose();
        }}
        className="w-full px-3 py-1.5 text-left flex items-center gap-2.5 hover:bg-white/10 transition-colors"
      >
        <ArrowLeftToLine className="w-3.5 h-3.5 text-slate-400" />
        <span>Close Tabs to the Left</span>
      </button>

      <button
        onClick={() => {
          closeOtherTabs(tabId);
          onClose();
        }}
        className="w-full px-3 py-1.5 text-left flex items-center gap-2.5 hover:bg-white/10 transition-colors"
      >
        <XSquare className="w-3.5 h-3.5 text-slate-400" />
        <span>Close Other Tabs</span>
      </button>

      <button
        onClick={() => {
          closeTab(tabId);
          onClose();
        }}
        className="w-full px-3 py-1.5 text-left flex items-center gap-2.5 hover:bg-red-500/20 text-red-400 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>Close Tab</span>
      </button>
    </div>
  );
};
