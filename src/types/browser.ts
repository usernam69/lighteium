export type LayoutMode = 'dynamic' | 'compact' | 'horizontal' | 'vertical' | 'zen';

export interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  isMuted?: boolean;
  isPinned?: boolean;
  isHibernated?: boolean; // memory saver
  isLoading?: boolean;
  lastActiveTime?: number;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  icon?: string;
  category?: string;
}

export interface BangItem {
  prefix: string; // e.g. "!ddg", "!g", "!kagi", "!w"
  name: string;
  category: 'Search' | 'AI / Ask' | 'Knowledge' | 'Developer' | 'Media' | 'Shopping';
  urlTemplate: string;
  icon?: string;
  description: string;
}

export interface NoiseSettings {
  enabled: boolean;
  canvasNoise: boolean;
  audioNoise: boolean;
  hardwareConcurrencySpoof: boolean;
  webglNoise: boolean;
  concurrencyCores: number;
  sessionSeed: string;
  exceptionDomains: string[];
}

export interface UBlockSettings {
  enabled: boolean;
  dnsUncloaking: boolean;
  heliumServicesFilters: boolean;
  cnameUncloaking: boolean;
  blockTrackers: boolean;
  blockAds: boolean;
  customFilterRules: string[];
  blockedStats: {
    totalBlocked: number;
    trackersBlocked: number;
    adsBlocked: number;
    domainsUncloaked: number;
  };
}

export interface SyncVaultState {
  enabled: boolean;
  vaultStatus: 'locked' | 'unlocked' | 'uninitialized';
  serverUrl: string;
  lastSynced?: string;
  encryptedItemsCount: number;
  dataTypes: {
    bookmarks: boolean;
    tabs: boolean;
    history: boolean;
    extensions: boolean;
    passwords: boolean; // default false for zero-trust
  };
}

export interface BrowserPreferences {
  layoutMode: LayoutMode;
  centeredAddressBar: boolean;
  searchEngine: 'duckduckgo' | 'kagi' | 'brave' | 'google' | 'searx';
  theme: 'dark' | 'light' | 'midnight';
  showBookmarksBar: boolean;
  memorySaverDefault: boolean;
  globalPrivacyControl: boolean;
  enableECH: boolean;
  splitClientHello: boolean;
  language: string;
}

export interface KeyboardShortcut {
  id: string;
  label: string;
  keyCombo: string;
  category: 'Tabs' | 'Navigation' | 'Layout' | 'Privacy';
}
