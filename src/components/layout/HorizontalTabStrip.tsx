import React, { useState } from 'react';
import { useBrowser } from '../../context/BrowserContext';
import { Tab } from '../../types/browser';
import { Plus, X, Volume2, VolumeX, Snowflake, Pin } from 'lucide-react';
import { TabContextMenu } from '../tabs/TabContextMenu';

export const HorizontalTabStrip: React.FC = () => {
  const {
    tabs,
    activeTabId,
    setActiveTabId,
    createTab,
    closeTab,
    toggleMuteTab,
    preferences
  } = useBrowser();

  const [contextMenuState, setContextMenuState] = useState<{
    x: number;
    y: number;
    tabId: string;
  } | null>(null);

  const handleContextMenu = (e: React.MouseEvent, tabId: string) => {
    e.preventDefault();
    setContextMenuState({ x: e.clientX, y: e.clientY, tabId });
  };

  return (
    <div className="flex items-center px-2 pt-2 gap-1 bg-[#10131c] select-none border-b border-white/5 overflow-x-auto no-scrollbar">
      {/* Brand Icon */}
      <div
        onClick={() => createTab('helium://newtab')}
        className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 cursor-pointer mr-1"
        title="Helium New Tab"
      >
        <img src="/resources/branding/product_logo.svg" alt="Helium" className="w-5 h-5" />
      </div>

      {/* Tabs List */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        {tabs.map((tab: Tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              onContextMenu={e => handleContextMenu(e, tab.id)}
              className={`group relative flex items-center gap-2 h-8 px-3 rounded-t-xl text-xs font-medium cursor-pointer transition-all border-t border-x ${
                isActive
                  ? 'bg-[#181d2a] text-slate-100 border-white/10 shadow-sm z-10'
                  : 'bg-[#121622]/60 text-slate-400 hover:text-slate-200 hover:bg-[#161a27] border-transparent'
              } ${tab.isPinned ? 'max-w-[48px] justify-center px-2' : 'min-w-[130px] max-w-[210px] flex-1'}`}
            >
              {/* Tab Favicon */}
              <div className="flex-shrink-0 relative">
                {tab.favicon ? (
                  <img
                    src={tab.favicon}
                    alt=""
                    className={`w-3.5 h-3.5 object-contain ${tab.isHibernated ? 'opacity-40 grayscale' : ''}`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/resources/branding/product_logo.svg';
                    }}
                  />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full bg-blue-500/30 flex items-center justify-center text-[9px] font-bold text-blue-300">
                    {tab.title.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Hibernated snowflake badge */}
                {tab.isHibernated && (
                  <Snowflake className="w-2.5 h-2.5 text-cyan-400 absolute -bottom-1 -right-1" />
                )}
              </div>

              {/* Title */}
              {!tab.isPinned && (
                <span className="truncate flex-1 font-normal tracking-tight text-[12px]">
                  {tab.title}
                </span>
              )}

              {/* Mute indicator */}
              {tab.isMuted && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMuteTab(tab.id);
                  }}
                  title="Unmute tab"
                  className="p-0.5 hover:bg-white/10 rounded text-slate-400 hover:text-slate-200"
                >
                  <VolumeX className="w-3 h-3 text-red-400" />
                </button>
              )}

              {/* Pin indicator */}
              {tab.isPinned && (
                <Pin className="w-2.5 h-2.5 text-slate-500 -ml-1" />
              )}

              {/* Close Button */}
              {!tab.isPinned && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  title="Close tab (Ctrl+W)"
                  className="opacity-0 group-hover:opacity-100 hover:bg-white/15 p-0.5 rounded-md text-slate-400 hover:text-white transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}

        {/* New Tab Button */}
        <button
          onClick={() => createTab()}
          title="New Tab (Ctrl+T)"
          className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-white/10 rounded-lg transition-colors cursor-pointer flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Right context menu */}
      {contextMenuState && (
        <TabContextMenu
          x={contextMenuState.x}
          y={contextMenuState.y}
          tabId={contextMenuState.tabId}
          onClose={() => setContextMenuState(null)}
        />
      )}
    </div>
  );
};
