# Helium Browser (React Edition)

<div align="center">
  <img src="resources/branding/product_logo.svg" title="Helium" alt="Helium logo" width="120" />
  <h1>Helium Browser</h1>
  <p><strong>The browser built around privacy, consent, and comfort.</strong></p>
</div>

Helium has been rewritten into a modern, full-featured React application preserving all core features and business logic from the original patchsets.

## Key Features

- **Dynamic Layout Engine**:
  - **Dynamic Mode**: Tabs and omnibox seamlessly adapt to window width and user focus.
  - **Compact Mode**: Consolidated single-row layout combining tabs and inline omnibox.
  - **Horizontal Tabs**: Classic floating multi-tab strip with sound indicator, freeze/hibernate status, and custom rounded frame corners.
  - **Vertical Tabs Sidebar**: Left sidebar featuring collapsible tab groups and pinned states.
  - **Zen Mode (`F11`)**: Distraction-free browsing with all chrome hidden and interactive hover reveal.
  - **Split View (`Ctrl+Alt+S`)**: Side-by-side multi-contents comparison with draggable splitter.

- **Omnibox & Native Bangs**:
  - Direct zero-redirect bangs engine:
    - `!ddg` (DuckDuckGo)
    - `!kagi` (Kagi)
    - `!b` (Brave Search)
    - `!w` (Wikipedia)
    - `!gh` (GitHub)
    - `!so` (StackOverflow)
    - `!yt` (YouTube)
    - `!ai` (Helium Ask Mode)
  - Search suggestion filtering and omnibox keyword chip.

- **Helium Shield (Built-in uBlock Origin Engine)**:
  - Live blocked tracker counter and shield popover.
  - DNS and CNAME uncloaking protection.
  - Filter lists management (EasyList, Peter Lowe's list, Helium services list).
  - Domain substitution inspector neutralizing Google telemetry domains to local loopback addresses.

- **Fingerprinting Protection (Helium Noise)**:
  - Interactive test suite at `helium://noise`.
  - Subtle per-session deterministic Canvas 2D and AudioContext noise injection.
  - Hardware concurrency and WebGL renderer spoofing.

- **Helium Sync Vault**:
  - End-to-end zero-knowledge encrypted sync engine with master passphrase protection.
  - Consent-first datatype policies.

- **Internal Helium Pages**:
  - `helium://newtab` - Clean New Tab Page with square monograms.
  - `helium://setup` - Onboarding wizard with Arc and Zen browser importers.
  - `helium://noise` - Fingerprinting Protection Laboratory.
  - `helium://patches` - Interactive Patchset Series Explorer (150+ patches).
  - `helium://flags` - GN Build Flags Configurator (`flags.gn`).
  - `helium://i18n` - Localization & translation preview (70+ languages).
  - `helium://settings` - Full preferences suite.

## Development

```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
```
