import { BangItem } from '../types/browser';

export const HELIUM_BANGS: BangItem[] = [
  {
    prefix: '!ddg',
    name: 'DuckDuckGo',
    category: 'Search',
    urlTemplate: 'https://duckduckgo.com/?q={q}',
    description: 'Privacy-focused search without trackers',
  },
  {
    prefix: '!kagi',
    name: 'Kagi Search',
    category: 'Search',
    urlTemplate: 'https://kagi.com/search?q={q}',
    description: 'User-centric, ad-free high quality search',
  },
  {
    prefix: '!b',
    name: 'Brave Search',
    category: 'Search',
    urlTemplate: 'https://search.brave.com/search?q={q}',
    description: 'Independent index with privacy-by-design',
  },
  {
    prefix: '!g',
    name: 'Google (Proxied)',
    category: 'Search',
    urlTemplate: 'https://www.google.com/search?q={q}',
    description: 'De-googled search query stripped of tracking tokens',
  },
  {
    prefix: '!w',
    name: 'Wikipedia',
    category: 'Knowledge',
    urlTemplate: 'https://en.wikipedia.org/wiki/Special:Search?search={q}',
    description: 'Free online encyclopedia',
  },
  {
    prefix: '!gh',
    name: 'GitHub',
    category: 'Developer',
    urlTemplate: 'https://github.com/search?q={q}',
    description: 'Search open-source repositories and code',
  },
  {
    prefix: '!so',
    name: 'Stack Overflow',
    category: 'Developer',
    urlTemplate: 'https://stackoverflow.com/search?q={q}',
    description: 'Developer Q&A and coding problems',
  },
  {
    prefix: '!yt',
    name: 'YouTube',
    category: 'Media',
    urlTemplate: 'https://www.youtube.com/results?search_query={q}',
    description: 'Video search with ad telemetry stripped',
  },
  {
    prefix: '!r',
    name: 'Reddit',
    category: 'Media',
    urlTemplate: 'https://www.reddit.com/search/?q={q}',
    description: 'Discussions and communities',
  },
  {
    prefix: '!maps',
    name: 'OpenStreetMap',
    category: 'Knowledge',
    urlTemplate: 'https://www.openstreetmap.org/search?query={q}',
    description: 'Open collaborative mapping project',
  },
  {
    prefix: '!ai',
    name: 'Helium Ask / AI',
    category: 'AI / Ask',
    urlTemplate: 'https://duckduckgo.com/?q=!ai+{q}',
    description: 'Direct AI question answering with zero data retention',
  },
  {
    prefix: '!arch',
    name: 'ArchWiki',
    category: 'Developer',
    urlTemplate: 'https://wiki.archlinux.org/index.php?search={q}',
    description: 'Linux documentation and technical manuals',
  },
  {
    prefix: '!mdn',
    name: 'MDN Web Docs',
    category: 'Developer',
    urlTemplate: 'https://developer.mozilla.org/en-US/search?q={q}',
    description: 'Mozilla Developer Network documentation',
  },
  {
    prefix: '!crates',
    name: 'Rust Crates',
    category: 'Developer',
    urlTemplate: 'https://crates.io/search?q={q}',
    description: 'Rust package registry',
  },
  {
    prefix: '!npm',
    name: 'NPM Registry',
    category: 'Developer',
    urlTemplate: 'https://www.npmjs.com/search?q={q}',
    description: 'JavaScript & Node.js packages',
  }
];

export function findBang(query: string): { bang: BangItem | null; cleanQuery: string } {
  const trimmed = query.trim();
  const parts = trimmed.split(/\s+/);
  if (parts.length === 0) return { bang: null, cleanQuery: query };

  const firstToken = parts[0].toLowerCase();
  const matched = HELIUM_BANGS.find(b => b.prefix.toLowerCase() === firstToken);
  if (matched) {
    return {
      bang: matched,
      cleanQuery: parts.slice(1).join(' ')
    };
  }

  // Also check if bang is at the end e.g. "rust iterators !gh"
  const lastToken = parts[parts.length - 1].toLowerCase();
  const matchedEnd = HELIUM_BANGS.find(b => b.prefix.toLowerCase() === lastToken);
  if (matchedEnd) {
    return {
      bang: matchedEnd,
      cleanQuery: parts.slice(0, parts.length - 1).join(' ')
    };
  }

  return { bang: null, cleanQuery: query };
}
