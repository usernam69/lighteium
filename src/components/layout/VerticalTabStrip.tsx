import React, { useState } from 'react';
import { useBrowser } from '../../context/BrowserContext';
import { Tab } from '../../types/browser';
import {
  Plus,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  Pin,
  Snowflake,
  VolumeX,
  Shield,
  Layers,
  Settings
} from 'lucide-react';
import { TabContextMenu } from '../tabs/TabContextMenu';

export const VerticalTabStrip: React.FC = () => {
  const {
    tabs,
    activeTabId,
    setActiveTabId,
    createTab,
    closeTab,
    toggleMuteTab,
    setLayoutMode,
    isShieldPopoverOpen,
    setIsShieldPopoverOpen
  } = useBrowser();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [tabFilter, setTabFilter] = useState('');
  const [contextMenuState, setContextMenuState] = useState<{
    x: number;
    y: number;
    tabId: string;
  } | null>(null);

  const filteredTabs = tabs.filter(t =>
    t.title.toLowerCase().includes(tabFilter.toLowerCase()) ||
    t.url.toLowerCase().includes(tabFilter.toLowerCase())
  );

  const pinnedTabs = filteredTabs.filter(t => t.isPinned);
  const regularTabs = filteredTabs.filter(t => !t.isPinned);

  const handleContextMenu = (e: React.MouseEvent, tabId: string) => {
    e.preventDefault();
    setContextMenuState({ x: e.clientX, y: e.clientY, tabId });
  };

  return (
    <aside
      className={`h-full bg-[#10131c] border-r border-white/5 flex flex-col transition-all duration-200 select-none ${
        isCollapsed ? 'w-14' : 'w-64'
      }`}
    >
      {/* Brand & Collapse Header */}
      <div className="p-3 border-b border-white/5 flex items-center justify-between">
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5">
            <img src="/resources/branding/product_logo.svg" alt="Helium" className="w-5 h-5" />
            <span className="font-semibold text-sm text-slate-100 tracking-tight">Helium</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
              Vertical
            </span>
          </div>
        ) : (
          <div className="mx-auto">
            <img src="/resources/branding/product_logo.svg" alt="Helium" className="w-5 h-5" />
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
          title={isCollapsed ? 'Expand tab bar' : 'Collapse tab bar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Tab Filter Search Bar */}
      {!isCollapsed && (
        <div className="p-2 border-b border-white/5">
          <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/5">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={tabFilter}
              onChange={e => setTabFilter(e.target.value)}
              placeholder="Search tabs..."
              className="bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none w-full"
            />
            {tabFilter && (
              <button onClick={() => setTabFilter('')} className="text-slate-400 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Pinned Tabs Grid */}
      {pinnedTabs.length > 0 && (
        <div className="p-2 border-b border-white/5 flex flex-wrap gap-1">
          {pinnedTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              onContextMenu={e => handleContextMenu(e, tab.id)}
              title={tab.title}
              className={`p-2 rounded-xl flex items-center justify-center transition-colors ${
                tab.id === activeTabId
                  ? 'bg-blue-600/30 text-white border border-blue-500/40'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400'
              }`}
            >
              <img
                src={tab.favicon || '/resources/branding/product_logo.svg'}
                alt=""
                className="w-4 h-4 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/resources/branding/product_logo.svg';
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Tabs List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {regularTabs.map((tab: Tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              onContextMenu={e => handleContextMenu(e, tab.id)}
              title={tab.title}
              className={`group flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs cursor-pointer transition-all ${
                isActive
                  ? 'bg-blue-600/20 text-white font-medium border border-blue-500/30'
                  : 'hover:bg-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Tab Favicon */}
              <div className="relative flex-shrink-0">
                <img
                  src={tab.favicon || '/resources/branding/product_logo.svg'}
                  alt=""
                  className={`w-4 h-4 object-contain ${tab.isHibernated ? 'opacity-40 grayscale' : ''}`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/resources/branding/product_logo.svg';
                  }}
                />
                {tab.isHibernated && (
                  <Snowflake className="w-2.5 h-2.5 text-cyan-400 absolute -bottom-1 -right-1" />
                )}
              </div>

              {!isCollapsed && (
                <>
                  <div className="flex-1 truncate">
                    <div className="truncate text-slate-200">{tab.title}</div>
                    <div className="text-[10px] text-slate-500 truncate">{tab.url}</div>
                  </div>

                  {tab.isMuted && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleMuteTab(tab.id);
                      }}
                      className="p-0.5 text-red-400 hover:text-red-300"
                    >
                      <VolumeX className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      closeTab(tab.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-2 border-t border-white/5 space-y-1">
        <button
          onClick={() => createTab()}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 transition-colors"
        >
          <Plus className="w-4 h-4 text-blue-400" />
          {!isCollapsed && <span>New Tab</span>}
        </button>

        <button
          onClick={() => createTab('helium://settings', 'Settings')}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-colors"
        >
          <Settings className="w-4 h-4" />
          {!isCollapsed && <span>Settings</span>}
        </button>
      </div>

      {contextMenuState && (
        <TabContextMenu
          x={contextMenuState.x}
          y={contextMenuState.y}
          tabId={contextMenuState.tabId}
          onClose={() => setContextMenuState(null)}
        />
      )}
    </aside>
  );
};
