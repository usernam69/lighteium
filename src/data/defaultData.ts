import { Bookmark, KeyboardShortcut, Tab } from '../types/browser';

export const DEFAULT_TABS: Tab[] = [
  {
    id: 'tab-1',
    title: 'New Tab',
    url: 'helium://newtab',
    favicon: '/resources/favicons/favicon_ntp_32.png',
    isPinned: false,
    isMuted: false,
    isHibernated: false,
    lastActiveTime: Date.now(),
  },
  {
    id: 'tab-2',
    title: 'Fingerprint Protection Lab',
    url: 'helium://noise',
    favicon: '/resources/favicons/favicon_flags_32.png',
    isPinned: false,
    isMuted: false,
    isHibernated: false,
    lastActiveTime: Date.now() - 1000,
  },
  {
    id: 'tab-3',
    title: 'Patchset Explorer',
    url: 'helium://patches',
    favicon: '/resources/branding/product_logo.svg',
    isPinned: false,
    isMuted: false,
    isHibernated: true, // hibernated by memory saver
    lastActiveTime: Date.now() - 50000,
  }
];

export const DEFAULT_BOOKMARKS: Bookmark[] = [
  { id: 'bm-1', title: 'Helium Web', url: 'https://helium.computer/', category: 'Helium' },
  { id: 'bm-2', title: 'Onboarding Setup', url: 'helium://setup', category: 'Helium' },
  { id: 'bm-3', title: 'Fingerprint Lab', url: 'helium://noise', category: 'Helium' },
  { id: 'bm-4', title: 'GN Flags Config', url: 'helium://flags', category: 'Developer' },
  { id: 'bm-5', title: 'Patches Explorer', url: 'helium://patches', category: 'Developer' },
  { id: 'bm-6', title: 'Kagi Search', url: 'https://kagi.com/', category: 'Search' },
  { id: 'bm-7', title: 'DuckDuckGo', url: 'https://duckduckgo.com/', category: 'Search' },
  { id: 'bm-8', title: 'GitHub', url: 'https://github.com/imputnet/helium-macos', category: 'Code' },
];

export const DEFAULT_SHORTCUTS: KeyboardShortcut[] = [
  { id: 'sc-1', label: 'New Tab', keyCombo: 'Ctrl + T', category: 'Tabs' },
  { id: 'sc-2', label: 'Close Tab', keyCombo: 'Ctrl + W', category: 'Tabs' },
  { id: 'sc-3', label: 'Cycle Tabs (MRU)', keyCombo: 'Ctrl + Tab', category: 'Tabs' },
  { id: 'sc-4', label: 'Focus Omnibox', keyCombo: 'Ctrl + L', category: 'Navigation' },
  { id: 'sc-5', label: 'Zen Mode Toggle', keyCombo: 'F11 / Ctrl + Shift + Z', category: 'Layout' },
  { id: 'sc-6', label: 'Toggle Dynamic/Compact', keyCombo: 'Ctrl + Shift + D', category: 'Layout' },
  { id: 'sc-7', label: 'Split View', keyCombo: 'Ctrl + Alt + S', category: 'Layout' },
  { id: 'sc-8', label: 'Mute / Unmute Tab', keyCombo: 'Ctrl + M', category: 'Tabs' },
  { id: 'sc-9', label: 'Hibernate Inactive Tabs', keyCombo: 'Ctrl + Shift + H', category: 'Tabs' },
  { id: 'sc-10', label: 'Toggle Shield & uBlock', keyCombo: 'Ctrl + Shift + U', category: 'Privacy' },
  { id: 'sc-11', label: 'Helium Settings', keyCombo: 'Ctrl + ,', category: 'Navigation' },
];

export interface PatchInfo {
  category: 'helium-ui' | 'helium-core' | 'helium-settings' | 'ungoogled' | 'bromite' | 'inox' | 'brave' | 'debian';
  name: string;
  description: string;
  status: 'active' | 'optional';
}

export const HELIUM_PATCH_LIST: PatchInfo[] = [
  { category: 'helium-ui', name: 'layout/dynamic.patch', description: 'Dynamic layout engine with responsive tab strip and fluid chrome adapting to viewport width', status: 'active' },
  { category: 'helium-ui', name: 'layout/compact.patch', description: 'Single-row compact layout combining tabs with inline address bar', status: 'active' },
  { category: 'helium-ui', name: 'layout/zen-mode.patch', description: 'Zen mode eliminating all borders and chrome for absolute focus', status: 'active' },
  { category: 'helium-ui', name: 'layout/vertical.patch', description: 'Vertical tabs sidebar with nested tree structures and pinning', status: 'active' },
  { category: 'helium-ui', name: 'layout/centered-address-bar.patch', description: 'Centered floating location bar with sleek rounded aesthetic', status: 'active' },
  { category: 'helium-ui', name: 'split-view.patch', description: 'Side-by-side multi-contents split view for comparing and multitasking', status: 'active' },
  { category: 'helium-ui', name: 'bangs-ui.patch', description: 'Omnibox keyword view displaying native bangs and search mode chips', status: 'active' },
  { category: 'helium-ui', name: 'rounded-frame-corners.patch', description: 'Native rounded window corners and custom floating corner backgrounds', status: 'active' },
  { category: 'helium-ui', name: 'enable-fluent-scrollbar.patch', description: 'Fluent overlay scrollbars matching modern desktop aesthetic', status: 'active' },
  { category: 'helium-ui', name: 'clean-new-tab-page.patch', description: 'Eliminates Google promo banners, doodle trackers, and recommended news feed', status: 'active' },
  
  { category: 'helium-core', name: 'noise/canvas.patch', description: 'Subtle per-session deterministic canvas noise to defeat fingerprinting', status: 'active' },
  { category: 'helium-core', name: 'noise/audio.patch', description: 'AudioContext frequency response noise to defeat audio fingerprinting', status: 'active' },
  { category: 'helium-core', name: 'noise/hardware-concurrency.patch', description: 'Spoofs navigator.hardwareConcurrency to standardize device core count', status: 'active' },
  { category: 'helium-core', name: 'add-native-bangs.patch', description: 'Built-in omnibox !bang query parser routing without external redirects', status: 'active' },
  { category: 'helium-core', name: 'ublock-install-as-component.patch', description: 'Integrates uBlock Origin engine directly as an internal browser component', status: 'active' },
  { category: 'helium-core', name: 'ublock-dns-uncloaking.patch', description: 'Uncloaks CNAME and DNS disguised third-party trackers', status: 'active' },
  { category: 'helium-core', name: 'sync/vault-encryption.patch', description: 'Zero-knowledge end-to-end encrypted local vault sync system', status: 'active' },
  { category: 'helium-core', name: 'tab-cycling-mru.patch', description: 'Most-recently-used tab cycling order when pressing Ctrl+Tab', status: 'active' },
  { category: 'helium-core', name: 'memory-saving-by-default.patch', description: 'Automatic tab freezing and memory reclamation for background tabs', status: 'active' },
  { category: 'helium-core', name: 'close-tabs-to-left.patch', description: 'Adds tab context menu option to close all tabs to the left', status: 'active' },
  { category: 'helium-core', name: 'hibernate-tab-context-menu.patch', description: 'Allows manual hibernation of heavy tabs from context menu', status: 'active' },
  
  { category: 'helium-settings', name: 'helium-noise-settings.patch', description: 'Full settings interface for fingerprinting defenses and site rules', status: 'active' },
  { category: 'helium-settings', name: 'custom-keyboard-shortcuts-page.patch', description: 'Settings UI to configure and remap any browser keyboard shortcut', status: 'active' },
  { category: 'helium-settings', name: 'network-and-security-page.patch', description: 'DNS over HTTPS, QUIC v2, Split ClientHello, and ECH settings', status: 'active' },
  { category: 'helium-settings', name: 'remove-autofill.patch', description: 'Removes Google autofill data-harvesting pipelines from settings', status: 'active' },
  
  { category: 'ungoogled', name: 'disable-google-host-detection.patch', description: 'Prevents browser from pinging Google servers on startup', status: 'active' },
  { category: 'ungoogled', name: 'block-trk-and-subdomains.patch', description: 'Hard-blocks trk: schema and background analytics beacons', status: 'active' },
  { category: 'ungoogled', name: 'disable-privacy-sandbox.patch', description: 'Disables Google Privacy Sandbox (FLoC / Topics API)', status: 'active' },
  { category: 'ungoogled', name: 'disable-gaia.patch', description: 'Removes Google Accounts (GAIA) authentication tie-ins', status: 'active' },
  { category: 'ungoogled', name: 'disable-webstore-urls.patch', description: 'Removes forced Chrome Web Store phone-home URLs', status: 'active' },
  { category: 'ungoogled', name: 'prepopulated-search-engines.patch', description: 'Restores privacy-respecting search engines to default choice', status: 'active' },
  
  { category: 'bromite', name: 'disable-fetching-field-trials.patch', description: 'Disables remote Google A/B testing and field trials', status: 'active' },
  { category: 'bromite', name: 'fingerprinting-flags-client-rects.patch', description: 'Adds flags to mitigate getClientRects & measureText fingerprinting', status: 'active' },
  
  { category: 'inox', name: 'disable-update-pings.patch', description: 'Stops automated telemetry update check pings', status: 'active' },
  { category: 'inox', name: 'disable-rlz.patch', description: 'Stops RLZ tracking string installation', status: 'active' },
];

export const GN_FLAGS_CONFIG: { flag: string; value: string; description: string }[] = [
  { flag: 'chrome_pgo_phase', value: '0', description: 'Disable Profile-Guided Optimization phase telemetry' },
  { flag: 'clang_use_chrome_plugins', value: 'false', description: 'Disable proprietary Clang compiler plugins' },
  { flag: 'disable_fieldtrial_testing_config', value: 'true', description: 'Disable Google field trial A/B testing configs' },
  { flag: 'enable_hangout_services_extension', value: 'false', description: 'Disable Hangouts background service extension' },
  { flag: 'enable_mdns', value: 'false', description: 'Disable multicast DNS local network broadcasting' },
  { flag: 'enable_remoting', value: 'false', description: 'Disable Chrome Remote Desktop daemon' },
  { flag: 'enable_reporting', value: 'false', description: 'Disable browser crash/usage reporting to Google servers' },
  { flag: 'enable_service_discovery', value: 'false', description: 'Disable device and Chromecast network discovery' },
  { flag: 'enable_widevine', value: 'true', description: 'Enable Widevine CDM for DRM-protected media (Spotify, Netflix)' },
  { flag: 'exclude_unwind_tables', value: 'true', description: 'Reduces binary footprint by omitting unwind tables' },
  { flag: 'google_api_key', value: '""', description: 'Empty Google API key prevents telemetry authentication' },
  { flag: 'google_default_client_id', value: '""', description: 'Empty Google Client ID disables account sync tracking' },
  { flag: 'google_default_client_secret', value: '""', description: 'Empty Client Secret ensures de-googled build' },
  { flag: 'safe_browsing_mode', value: '0', description: 'Disable SafeBrowsing live URL lookup to Google' },
  { flag: 'treat_warnings_as_errors', value: 'false', description: 'Allow compilation with warnings' },
  { flag: 'use_official_google_api_keys', value: 'false', description: 'Reject official Google API keys in open source build' },
  { flag: 'use_unofficial_version_number', value: 'false', description: 'Preserve standard Chromium version signature' },
];

export const POPULAR_LANGUAGES: { code: string; name: string }[] = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'it', name: 'Italian (Italiano)' },
  { code: 'ja', name: 'Japanese (日本語)' },
  { code: 'zh-CN', name: 'Chinese Simplified (简体中文)' },
  { code: 'pt-BR', name: 'Portuguese (Português Brasil)' },
  { code: 'ru', name: 'Russian (Русский)' },
  { code: 'ko', name: 'Korean (한국어)' },
  { code: 'pl', name: 'Polish (Polski)' },
  { code: 'nl', name: 'Dutch (Nederlands)' },
  { code: 'sv', name: 'Swedish (Svenska)' },
  { code: 'tr', name: 'Turkish (Türkçe)' },
  { code: 'ar', name: 'Arabic (العربية)' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'uk', name: 'Ukrainian (Українська)' },
];
