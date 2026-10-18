import React from 'react';
import { Tab } from '../../types/browser';
import { useBrowser } from '../../context/BrowserContext';
import { NewTabPage } from '../pages/NewTabPage';
import { SetupPage } from '../pages/SetupPage';
import { NoisePage } from '../pages/NoisePage';
import { SettingsPage } from '../pages/SettingsPage';
import { PatchesPage } from '../pages/PatchesPage';
import { FlagsPage } from '../pages/FlagsPage';
import { I18nPage } from '../pages/I18nPage';
import {
  Shield,
  Lock,
  ExternalLink,
  Globe,
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { testDomainSubstitution } from '../../utils/domainSubstitution';

export const WebView: React.FC<{ tab: Tab }> = ({ tab }) => {
  const { ublockSettings, noiseSettings, navigateTab } = useBrowser();

  const url = tab.url;

  // Handle internal helium:// protocols
  if (url === 'helium://newtab' || url === 'about:blank') {
    return <NewTabPage />;
  }
  if (url === 'helium://setup') {
    return <SetupPage />;
  }
  if (url === 'helium://noise') {
    return <NoisePage />;
  }
  if (url === 'helium://settings') {
    return <SettingsPage />;
  }
  if (url === 'helium://patches') {
    return <PatchesPage />;
  }
  if (url === 'helium://flags') {
    return <FlagsPage />;
  }
  if (url === 'helium://i18n') {
    return <I18nPage />;
  }

  // Handle !ai Ask mode
  if (url.startsWith('helium://ai')) {
    const searchParams = new URLSearchParams(url.split('?')[1] || '');
    const prompt = searchParams.get('q') || 'How does Helium protect browser privacy?';

    return (
      <div className="h-full overflow-y-auto bg-[#0e1118] text-slate-100 p-8 flex flex-col items-center">
        <div className="w-full max-w-2xl bg-[#141824] border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-base text-white">Helium Ask Mode (!ai bang)</div>
              <div className="text-xs text-slate-400">Private query with zero server-side telemetry retention</div>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Your Query:</div>
            <div className="text-sm font-medium text-blue-200">"{prompt}"</div>
          </div>

          <div className="space-y-4 text-xs leading-relaxed text-slate-300">
            <p>
              Helium uses multiple layers of defense to protect user browsing privacy without breaking compatibility:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-slate-200">
              <li>
                <strong>Active Noise Injection:</strong> Perturbs canvas pixels and AudioContext buffer calculations with subtle per-session noise, making cross-site fingerprinting mathematically ineffective.
              </li>
              <li>
                <strong>Domain Substitution:</strong> Intercepts Google telemetry endpoints, GAIA account sync, and tracking beacons at the network stack, directing them to local loopback addresses (127.0.0.1:9) or <code className="text-blue-300">qjz9zk.invalid</code>.
              </li>
              <li>
                <strong>Built-in uBlock Origin Engine:</strong> Blocks third-party ads and trackers, uncloaking CNAME disguised trackers before sockets are opened.
              </li>
              <li>
                <strong>Encrypted Sync Vault:</strong> Syncs bookmarks, tabs, and settings using zero-knowledge client-side encryption rather than account-based cloud storage.
              </li>
            </ul>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle className="w-3.5 h-3.5" /> Direct response rendered locally
            </span>
            <button
              onClick={() => navigateTab(tab.id, 'helium://newtab')}
              className="text-blue-400 hover:underline"
            >
              Back to New Tab
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Domain substitution analysis on external URL
  const subResult = testDomainSubstitution(url);

  let hostname = url;
  try {
    hostname = new URL(url).hostname;
  } catch {}

  const isSearchEngine =
    url.includes('duckduckgo.com') ||
    url.includes('kagi.com') ||
    url.includes('google.com') ||
    url.includes('brave.com') ||
    url.includes('search');

  let searchQuery = '';
  try {
    const u = new URL(url);
    searchQuery = u.searchParams.get('q') || u.searchParams.get('search') || u.searchParams.get('query') || '';
  } catch {}

  return (
    <div className="h-full flex flex-col bg-[#0b0d13] text-slate-100 overflow-hidden">
      {/* Simulated Page Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 max-w-4xl mx-auto w-full">
        {/* Security / Privacy Banner for external page */}
        <div className="p-4 rounded-2xl bg-[#141824] border border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-slate-200 flex items-center gap-2">
                <span>{hostname}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  TLS 1.3 • ECH
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Helium Shield active • {ublockSettings.blockedStats.trackersBlocked} trackers blocked on this session
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-blue-400 font-mono hidden sm:inline">
              Canvas Noise: {noiseSettings.enabled ? 'ON' : 'OFF'}
            </span>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
              title="Open in new window"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Search Results Display if navigating via search bang or search engine */}
        {isSearchEngine && searchQuery ? (
          <div className="bg-[#141824] rounded-3xl border border-white/10 p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-blue-400" />
                <div>
                  <h2 className="text-base font-bold text-white">Results for "{searchQuery}"</h2>
                  <div className="text-xs text-slate-400">Filtered with privacy & zero ad profiling</div>
                </div>
              </div>
              <span className="text-xs font-mono px-2 py-1 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/20">
                {hostname}
              </span>
            </div>

            <div className="space-y-5">
              {[
                {
                  title: `${searchQuery} - Official Documentation & Guide`,
                  url: `https://${searchQuery.toLowerCase().replace(/\s+/g, '')}.org/docs`,
                  snippet: `Complete reference guide, installation steps, best practices, and architecture documentation for ${searchQuery}.`
                },
                {
                  title: `GitHub: Popular repositories for ${searchQuery}`,
                  url: `https://github.com/topics/${searchQuery.toLowerCase().replace(/\s+/g, '-')}`,
                  snippet: `Explore trending open source projects, tools, libraries, and discussions related to ${searchQuery}.`
                },
                {
                  title: `${searchQuery} on Wikipedia, the free encyclopedia`,
                  url: `https://en.wikipedia.org/wiki/${encodeURIComponent(searchQuery)}`,
                  snippet: `Background history, overview, development, and community impact of ${searchQuery}.`
                },
                {
                  title: `Latest discussions and tutorials on ${searchQuery}`,
                  url: `https://news.ycombinator.com/item?id=search`,
                  snippet: `Technical community feedback, benchmark comparisons, and deep-dives about ${searchQuery}.`
                }
              ].map((res, i) => (
                <div
                  key={i}
                  onClick={() => navigateTab(tab.id, res.url, res.title)}
                  className="group cursor-pointer space-y-1 p-3 rounded-2xl hover:bg-white/5 transition-colors"
                >
                  <div className="text-[11px] font-mono text-emerald-400 truncate flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    <span>{res.url}</span>
                  </div>
                  <div className="text-sm font-semibold text-blue-400 group-hover:text-blue-300 group-hover:underline">
                    {res.title}
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed">
                    {res.snippet}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* General Simulated Web Page View */
          <div className="bg-[#141824] rounded-3xl border border-white/10 p-6 md:p-8 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
                <Globe className="w-4 h-4" />
                <span>{url}</span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">{tab.title}</h1>
              <p className="text-xs text-slate-400">
                Securely loaded via Helium de-googled network pipeline with active fingerprint defense.
              </p>
            </div>

            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-2 text-xs text-slate-300">
              <div className="font-semibold text-slate-200">Site Isolation & Privacy Report:</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" /> Cookies: Ephemeral Partitioned
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" /> Referrer: Stripped to origin
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" /> Client Hints: Suppressed
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" /> GPC Signal: Enforced
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
              <button
                onClick={() => navigateTab(tab.id, 'helium://newtab')}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-xl font-medium text-slate-200 transition-colors"
              >
                Return to New Tab
              </button>
              <button
                onClick={() => navigateTab(tab.id, 'helium://noise')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium text-white transition-colors"
              >
                Test Fingerprint on this site
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
