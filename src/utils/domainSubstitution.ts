// De-googling domain substitution rules based on Helium's domain_substitution.list

export interface DomainRule {
  pattern: RegExp;
  replacement: string;
  category: 'Telemetry' | 'SafeBrowsing' | 'Account/GAIA' | 'Fonts/Assets' | 'AdServices';
  originalDomain: string;
  description: string;
}

export const DOMAIN_SUBSTITUTION_RULES: DomainRule[] = [
  {
    pattern: /clients[0-9]*\.google\.com/i,
    replacement: 'qjz9zk.clients.invalid',
    category: 'Telemetry',
    originalDomain: 'clients.google.com',
    description: 'Blocked background client sync and update telemetry pings',
  },
  {
    pattern: /safebrowsing\.googleapis\.com/i,
    replacement: '127.0.0.1:9',
    category: 'SafeBrowsing',
    originalDomain: 'safebrowsing.googleapis.com',
    description: 'Redirects live browsing URL telemetry check to null loopback',
  },
  {
    pattern: /accounts\.google\.com\/(ListAccounts|CheckConnectionLoop)/i,
    replacement: 'about:blank',
    category: 'Account/GAIA',
    originalDomain: 'accounts.google.com',
    description: 'Strips auto-login GAIA credential headers and account snooping',
  },
  {
    pattern: /fonts\.googleapis\.com/i,
    replacement: 'fonts.helium.local',
    category: 'Fonts/Assets',
    originalDomain: 'fonts.googleapis.com',
    description: 'Substitutes Google Fonts tracking link with local fallback fonts',
  },
  {
    pattern: /(google-analytics\.com|googletagmanager\.com)/i,
    replacement: '0.0.0.0',
    category: 'Telemetry',
    originalDomain: 'google-analytics.com',
    description: 'Hard-blocks Google Analytics script downloads and beacon dispatches',
  },
  {
    pattern: /(doubleclick\.net|pagead2\.googlesyndication\.com)/i,
    replacement: '0.0.0.0',
    category: 'AdServices',
    originalDomain: 'doubleclick.net',
    description: 'Intercepts DoubleClick ad auction requests before socket open',
  },
  {
    pattern: /connectivitycheck\.gstatic\.com/i,
    replacement: 'captive.helium.local',
    category: 'Telemetry',
    originalDomain: 'connectivitycheck.gstatic.com',
    description: 'Replaces Google captive portal probe with private local check',
  }
];

export function testDomainSubstitution(url: string): { replaced: boolean; resultUrl: string; matchedRule?: DomainRule } {
  for (const rule of DOMAIN_SUBSTITUTION_RULES) {
    if (rule.pattern.test(url)) {
      return {
        replaced: true,
        resultUrl: url.replace(rule.pattern, rule.replacement),
        matchedRule: rule
      };
    }
  }
  return { replaced: false, resultUrl: url };
}
