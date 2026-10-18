import React, { useState } from 'react';
import { useBrowser } from '../../context/BrowserContext';
import { Omnibox } from '../omnibox/Omnibox';
import { Minimize2, Shield, Plus, X } from 'lucide-react';

export const ZenHeader: React.FC = () => {
  const {
    activeTab,
    setLayoutMode,
    tabs,
    setActiveTabId,
    createTab,
    closeTab
  } = useBrowser();

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="absolute top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      {/* Invisible hover trigger zone at the very top */}
      <div className="h-3 w-full cursor-pointer group flex justify-center items-center">
        {!isHovered && (
          <div className="w-16 h-1 rounded-full bg-blue-500/30 group-hover:bg-blue-400 group-hover:h-1.5 transition-all shadow-glow" />
        )}
      </div>

      {/* Floating Zen Pill when hovered */}
      {isHovered && (
        <div className="mx-auto max-w-4xl px-4 py-2 bg-[#121622]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl animate-in slide-in-from-top-3 duration-200">
          <div className="flex items-center gap-3">
            {/* Quick mini-tabs */}
            <div className="flex items-center gap-1 max-w-[280px] overflow-x-auto no-scrollbar">
              {tabs.slice(0, 4).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`px-2 py-1 rounded-lg text-[11px] truncate max-w-[90px] flex items-center gap-1.5 transition-colors ${
                    tab.id === activeTab.id
                      ? 'bg-blue-600/30 text-white font-medium'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <img src={tab.favicon || '/resources/branding/product_logo.svg'} className="w-3 h-3" alt="" />
                  <span className="truncate">{tab.title}</span>
                </button>
              ))}
              <button
                onClick={() => createTab()}
                className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Omnibox */}
            <div className="flex-1">
              <Omnibox />
            </div>

            {/* Exit Zen Button */}
            <button
              onClick={() => setLayoutMode('dynamic')}
              title="Exit Zen Mode (F11)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors"
            >
              <Minimize2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Exit Zen</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
