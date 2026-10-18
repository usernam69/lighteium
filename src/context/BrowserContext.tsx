import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Bookmark,
  BrowserPreferences,
  LayoutMode,
  NoiseSettings,
  SyncVaultState,
  Tab,
  UBlockSettings
} from '../types/browser';
import { DEFAULT_BOOKMARKS, DEFAULT_TABS } from '../data/defaultData';
import { generateSessionSeed } from '../utils/noise';

interface BrowserContextType {
  tabs: Tab[];
  activeTabId: string;
  setActiveTabId: (id: string) => void;
  splitTabId: string | null;
  setSplitTabId: (id: string | null) => void;
  splitRatio: number; // 0 to 1
  setSplitRatio: (ratio: number) => void;
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  preferences: BrowserPreferences;
  updatePreferences: (partial: Partial<BrowserPreferences>) => void;
  noiseSettings: NoiseSettings;
  updateNoiseSettings: (partial: Partial<NoiseSettings>) => void;
  ublockSettings: UBlockSettings;
  updateUBlockSettings: (partial: Partial<UBlockSettings>) => void;
  syncVault: SyncVaultState;
  updateSyncVault: (partial: Partial<SyncVaultState>) => void;
  bookmarks: Bookmark[];
  addBookmark: (title: string, url: string) => void;
  removeBookmark: (id: string) => void;
  activeTab: Tab;
  createTab: (url?: string, title?: string) => string;
  closeTab: (id: string) => void;
  closeTabsToLeft: (id: string) => void;
  closeOtherTabs: (id: string) => void;
  toggleMuteTab: (id: string) => void;
  togglePinTab: (id: string) => void;
  toggleHibernateTab: (id: string) => void;
  duplicateTab: (id: string) => void;
  navigateTab: (id: string, url: string, title?: string) => void;
  refreshTab: (id: string) => void;
  toggleSplitView: (tabId?: string) => void;
  closeSplitView: () => void;
  cycleTabsMRU: (direction: 'forward' | 'backward') => void;
  isShortcutsOpen: boolean;
  setIsShortcutsOpen: (open: boolean) => void;
  isVaultModalOpen: boolean;
  setIsVaultModalOpen: (open: boolean) => void;
  isShieldPopoverOpen: boolean;
  setIsShieldPopoverOpen: (open: boolean) => void;
  simulateRequestBlock: () => void;
}

const BrowserContext = createContext<BrowserContextType | undefined>(undefined);

export const BrowserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tabs, setTabs] = useState<Tab[]>(DEFAULT_TABS);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');
  const [splitTabId, setSplitTabId] = useState<string | null>(null);
  const [splitRatio, setSplitRatio] = useState<number>(0.5);
  const [mruStack, setMruStack] = useState<string[]>(['tab-1', 'tab-2', 'tab-3']);

  const [layoutMode, setLayoutMode] = useState<LayoutMode>('dynamic');
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [isShieldPopoverOpen, setIsShieldPopoverOpen] = useState(false);

  const [preferences, setPreferences] = useState<BrowserPreferences>({
    layoutMode: 'dynamic',
    centeredAddressBar: false,
    searchEngine: 'duckduckgo',
    theme: 'dark',
    showBookmarksBar: true,
    memorySaverDefault: true,
    globalPrivacyControl: true,
    enableECH: true,
    splitClientHello: true,
    language: 'en-US',
  });

  const [noiseSettings, setNoiseSettings] = useState<NoiseSettings>({
    enabled: true,
    canvasNoise: true,
    audioNoise: true,
    hardwareConcurrencySpoof: true,
    webglNoise: true,
    concurrencyCores: 4,
    sessionSeed: generateSessionSeed(),
    exceptionDomains: [],
  });

  const [ublockSettings, setUblockSettings] = useState<UBlockSettings>({
    enabled: true,
    dnsUncloaking: true,
    heliumServicesFilters: true,
    cnameUncloaking: true,
    blockTrackers: true,
    blockAds: true,
    customFilterRules: ['||google-analytics.com^', '||doubleclick.net^', '||telemetry.helium.local^$badfilter'],
    blockedStats: {
      totalBlocked: 4829,
      trackersBlocked: 3105,
      adsBlocked: 1472,
      domainsUncloaked: 252,
    },
  });

  const [syncVault, setSyncVault] = useState<SyncVaultState>({
    enabled: true,
    vaultStatus: 'unlocked',
    serverUrl: 'http://127.0.0.1:8743 (Helium Loopback)',
    lastSynced: 'Just now',
    encryptedItemsCount: 42,
    dataTypes: {
      bookmarks: true,
      tabs: true,
      history: true,
      extensions: true,
      passwords: false, // zero-knowledge privacy default
    },
  });

  const [bookmarks, setBookmarks] = useState<Bookmark[]>(DEFAULT_BOOKMARKS);

  // Sync layout mode between state and preferences
  useEffect(() => {
    setPreferences(prev => ({ ...prev, layoutMode }));
  }, [layoutMode]);

  // Update MRU stack on active tab change
  const handleSetActiveTab = (id: string) => {
    setActiveTabId(id);
    setTabs(prev =>
      prev.map(t => (t.id === id ? { ...t, isHibernated: false, lastActiveTime: Date.now() } : t))
    );
    setMruStack(prev => [id, ...prev.filter(item => item !== id)]);
  };

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0] || {
    id: 'tab-default',
    title: 'New Tab',
    url: 'helium://newtab',
  };

  const createTab = (url = 'helium://newtab', title = 'New Tab') => {
    const newId = `tab-${Date.now()}`;
    const newTab: Tab = {
      id: newId,
      title: title || (url.startsWith('helium://') ? url.replace('helium://', '').toUpperCase() : url),
      url,
      favicon: url.startsWith('helium://')
        ? '/resources/branding/product_logo.svg'
        : '/resources/favicons/favicon_bookmarks_16.png',
      isHibernated: false,
      lastActiveTime: Date.now(),
    };
    setTabs(prev => [...prev, newTab]);
    handleSetActiveTab(newId);
    return newId;
  };

  const closeTab = (id: string) => {
    if (tabs.length === 1) {
      // If closing the last tab, reset to NTP rather than blank window
      setTabs([{
        id: `tab-${Date.now()}`,
        title: 'New Tab',
        url: 'helium://newtab',
        favicon: '/resources/favicons/favicon_ntp_32.png',
        lastActiveTime: Date.now(),
      }]);
      setActiveTabId(tabs[0].id);
      return;
    }

    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);

    if (splitTabId === id) {
      setSplitTabId(null);
    }

    if (activeTabId === id) {
      // Pick next MRU tab
      const nextMru = mruStack.find(tId => tId !== id && newTabs.some(nt => nt.id === tId));
      const fallbackId = nextMru || newTabs[newTabs.length - 1].id;
      setActiveTabId(fallbackId);
    }

    setMruStack(prev => prev.filter(tId => tId !== id));
  };

  const closeTabsToLeft = (id: string) => {
    const targetIndex = tabs.findIndex(t => t.id === id);
    if (targetIndex <= 0) return;
    const remainingTabs = tabs.slice(targetIndex);
    setTabs(remainingTabs);
    if (!remainingTabs.some(t => t.id === activeTabId)) {
      setActiveTabId(id);
    }
  };

  const closeOtherTabs = (id: string) => {
    const remaining = tabs.filter(t => t.id === id);
    setTabs(remaining);
    setActiveTabId(id);
    if (splitTabId && splitTabId !== id) {
      setSplitTabId(null);
    }
  };

  const toggleMuteTab = (id: string) => {
    setTabs(prev => prev.map(t => (t.id === id ? { ...t, isMuted: !t.isMuted } : t)));
  };

  const togglePinTab = (id: string) => {
    setTabs(prev => prev.map(t => (t.id === id ? { ...t, isPinned: !t.isPinned } : t)));
  };

  const toggleHibernateTab = (id: string) => {
    setTabs(prev =>
      prev.map(t => {
        if (t.id === id) {
          return { ...t, isHibernated: !t.isHibernated };
        }
        return t;
      })
    );
  };

  const duplicateTab = (id: string) => {
    const target = tabs.find(t => t.id === id);
    if (!target) return;
    createTab(target.url, target.title);
  };

  const navigateTab = (id: string, url: string, title?: string) => {
    setTabs(prev =>
      prev.map(t => {
        if (t.id === id) {
          let tabTitle = title;
          if (!tabTitle) {
            if (url.startsWith('helium://')) {
              tabTitle = `Helium ${url.replace('helium://', '').charAt(0).toUpperCase() + url.slice(10)}`;
            } else {
              try {
                const u = new URL(url.startsWith('http') ? url : `https://${url}`);
                tabTitle = u.hostname.replace('www.', '');
              } catch {
                tabTitle = url;
              }
            }
          }
          return {
            ...t,
            url,
            title: tabTitle,
            isLoading: false,
            isHibernated: false,
          };
        }
        return t;
      })
    );
  };

  const refreshTab = (id: string) => {
    setTabs(prev =>
      prev.map(t => (t.id === id ? { ...t, isLoading: true } : t))
    );
    setTimeout(() => {
      setTabs(prev =>
        prev.map(t => (t.id === id ? { ...t, isLoading: false } : t))
      );
    }, 400);
  };

  const toggleSplitView = (targetTabId?: string) => {
    if (splitTabId) {
      setSplitTabId(null);
      return;
    }
    // Find an alternate tab to split with
    const otherTab = targetTabId || tabs.find(t => t.id !== activeTabId)?.id;
    if (otherTab) {
      setSplitTabId(otherTab);
    } else {
      // create a new tab for split view
      const newTabId = createTab('helium://noise', 'Fingerprint Lab');
      setSplitTabId(newTabId);
    }
  };

  const closeSplitView = () => setSplitTabId(null);

  const cycleTabsMRU = (direction: 'forward' | 'backward') => {
    if (tabs.length <= 1) return;
    const currentIndexInMru = mruStack.indexOf(activeTabId);
    let nextIndex = 0;
    if (direction === 'forward') {
      nextIndex = (currentIndexInMru + 1) % mruStack.length;
    } else {
      nextIndex = (currentIndexInMru - 1 + mruStack.length) % mruStack.length;
    }
    const targetId = mruStack[nextIndex];
    if (targetId && tabs.some(t => t.id === targetId)) {
      setActiveTabId(targetId);
    }
  };

  const addBookmark = (title: string, url: string) => {
    setBookmarks(prev => [...prev, { id: `bm-${Date.now()}`, title, url, category: 'Personal' }]);
  };

  const removeBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  const simulateRequestBlock = () => {
    setUblockSettings(prev => ({
      ...prev,
      blockedStats: {
        ...prev.blockedStats,
        totalBlocked: prev.blockedStats.totalBlocked + 1,
        trackersBlocked: prev.blockedStats.trackersBlocked + 1,
      }
    }));
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 't') {
        e.preventDefault();
        createTab();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'w') {
        e.preventDefault();
        closeTab(activeTabId);
      } else if (e.key === 'F11' || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')) {
        e.preventDefault();
        setLayoutMode(prev => (prev === 'zen' ? 'dynamic' : 'zen'));
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setLayoutMode(prev => (prev === 'dynamic' ? 'compact' : 'dynamic'));
      } else if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        toggleSplitView();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        toggleMuteTab(activeTabId);
      } else if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        createTab('helium://settings', 'Settings');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTabId, tabs, splitTabId, mruStack]);

  return (
    <BrowserContext.Provider
      value={{
        tabs,
        activeTabId,
        setActiveTabId: handleSetActiveTab,
        splitTabId,
        setSplitTabId,
        splitRatio,
        setSplitRatio,
        layoutMode,
        setLayoutMode,
        preferences,
        updatePreferences: partial => setPreferences(prev => ({ ...prev, ...partial })),
        noiseSettings,
        updateNoiseSettings: partial => setNoiseSettings(prev => ({ ...prev, ...partial })),
        ublockSettings,
        updateUBlockSettings: partial => setUblockSettings(prev => ({ ...prev, ...partial })),
        syncVault,
        updateSyncVault: partial => setSyncVault(prev => ({ ...prev, ...partial })),
        bookmarks,
        addBookmark,
        removeBookmark,
        activeTab,
        createTab,
        closeTab,
        closeTabsToLeft,
        closeOtherTabs,
        toggleMuteTab,
        togglePinTab,
        toggleHibernateTab,
        duplicateTab,
        navigateTab,
        refreshTab,
        toggleSplitView,
        closeSplitView,
        cycleTabsMRU,
        isShortcutsOpen,
        setIsShortcutsOpen,
        isVaultModalOpen,
        setIsVaultModalOpen,
        isShieldPopoverOpen,
        setIsShieldPopoverOpen,
        simulateRequestBlock,
      }}
    >
      {children}
    </BrowserContext.Provider>
  );
};

export const useBrowser = () => {
  const context = useContext(BrowserContext);
  if (!context) throw new Error('useBrowser must be used within a BrowserProvider');
  return context;
};
