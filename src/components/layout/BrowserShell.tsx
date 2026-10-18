import React, { useState } from 'react';
import { useBrowser } from '../../context/BrowserContext';
import { HorizontalTabStrip } from './HorizontalTabStrip';
import { VerticalTabStrip } from './VerticalTabStrip';
import { DynamicToolbar } from './DynamicToolbar';
import { ZenHeader } from './ZenHeader';
import { WebView } from '../webview/WebView';
import { ShortcutsDialog } from '../dialogs/ShortcutsDialog';
import { SyncVaultDialog } from '../dialogs/SyncVaultDialog';
import { X, GripVertical, ChevronRight, ChevronLeft } from 'lucide-react';

export const BrowserShell: React.FC = () => {
  const {
    layoutMode,
    activeTab,
    splitTabId,
    tabs,
    closeSplitView,
    splitRatio,
    setSplitRatio
  } = useBrowser();

  const [isDraggingSplit, setIsDraggingSplit] = useState(false);

  const splitTab = splitTabId ? tabs.find(t => t.id === splitTabId) : null;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingSplit) return;
    const containerWidth = window.innerWidth;
    const newRatio = Math.max(0.2, Math.min(0.8, e.clientX / containerWidth));
    setSplitRatio(newRatio);
  };

  const handleMouseUp = () => {
    if (isDraggingSplit) setIsDraggingSplit(false);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="flex flex-col h-screen w-screen bg-[#0e1117] text-slate-100 overflow-hidden select-none"
    >
      {/* Zen Mode Header (Floating) */}
      {layoutMode === 'zen' && <ZenHeader />}

      {/* Vertical Tabs Layout */}
      {layoutMode === 'vertical' ? (
        <div className="flex-1 flex overflow-hidden">
          <VerticalTabStrip />

          <div className="flex-1 flex flex-col overflow-hidden">
            <DynamicToolbar />

            {/* Content Area with Split View Support */}
            <div className="flex-1 flex overflow-hidden relative">
              <div
                style={{ width: splitTab ? `${splitRatio * 100}%` : '100%' }}
                className="h-full overflow-hidden"
              >
                <WebView tab={activeTab} />
              </div>

              {splitTab && (
                <>
                  {/* Draggable Divider */}
                  <div
                    onMouseDown={() => setIsDraggingSplit(true)}
                    className="w-1.5 bg-[#181d2a] hover:bg-blue-500 cursor-col-resize flex items-center justify-center transition-colors group z-20"
                  >
                    <GripVertical className="w-3 h-3 text-slate-500 group-hover:text-white" />
                  </div>

                  {/* Split View Secondary Tab */}
                  <div
                    style={{ width: `${(1 - splitRatio) * 100}%` }}
                    className="h-full overflow-hidden relative border-l border-white/5"
                  >
                    <div className="absolute top-2 right-2 z-30">
                      <button
                        onClick={closeSplitView}
                        className="p-1 rounded-lg bg-black/60 hover:bg-black/90 text-slate-300 hover:text-white shadow-lg backdrop-blur-md"
                        title="Close split view"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <WebView tab={splitTab} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Horizontal, Dynamic, Compact or Zen Layout */
        <div className="flex-1 flex flex-col overflow-hidden">
          {layoutMode !== 'zen' && (
            <>
              {layoutMode !== 'compact' && <HorizontalTabStrip />}
              <DynamicToolbar />
            </>
          )}

          {/* Main Web View Viewport */}
          <div className="flex-1 flex overflow-hidden relative">
            <div
              style={{ width: splitTab ? `${splitRatio * 100}%` : '100%' }}
              className="h-full overflow-hidden"
            >
              <WebView tab={activeTab} />
            </div>

            {splitTab && (
              <>
                {/* Draggable Divider */}
                <div
                  onMouseDown={() => setIsDraggingSplit(true)}
                  className="w-1.5 bg-[#181d2a] hover:bg-blue-500 cursor-col-resize flex items-center justify-center transition-colors group z-20"
                >
                  <GripVertical className="w-3 h-3 text-slate-500 group-hover:text-white" />
                </div>

                {/* Secondary Tab */}
                <div
                  style={{ width: `${(1 - splitRatio) * 100}%` }}
                  className="h-full overflow-hidden relative border-l border-white/5"
                >
                  <div className="absolute top-2 right-2 z-30">
                    <button
                      onClick={closeSplitView}
                      className="p-1.5 rounded-xl bg-black/60 hover:bg-black/90 text-slate-300 hover:text-white shadow-lg backdrop-blur-md"
                      title="Close split view"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <WebView tab={splitTab} />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Global Modals */}
      <ShortcutsDialog />
      <SyncVaultDialog />
    </div>
  );
};
