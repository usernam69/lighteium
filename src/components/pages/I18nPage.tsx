import React, { useState } from 'react';
import { POPULAR_LANGUAGES } from '../../data/defaultData';
import { useBrowser } from '../../context/BrowserContext';
import { Globe, Check, Search, Languages } from 'lucide-react';

export const I18nPage: React.FC = () => {
  const { preferences, updatePreferences } = useBrowser();
  const [search, setSearch] = useState('');

  const sampleTranslations: Record<string, Record<string, string>> = {
    'en-US': {
      title: 'Helium Browser',
      tagline: 'The browser built around privacy, consent, and comfort.',
      noiseDesc: 'Helium frees up memory from inactive tabs and protects against fingerprinting.',
      shieldActive: 'Shield Active',
      zenMode: 'Zen Mode',
    },
    'es': {
      title: 'Navegador Helium',
      tagline: 'El navegador creado en torno a la privacidad, el consentimiento y la comodidad.',
      noiseDesc: 'Helium libera memoria de pestañas inactivas y protege contra la toma de huella digital.',
      shieldActive: 'Escudo Activo',
      zenMode: 'Modo Zen',
    },
    'fr': {
      title: 'Navigateur Helium',
      tagline: 'Le navigateur conçu autour de la confidentialité, du consentement et du confort.',
      noiseDesc: 'Helium libère la mémoire des onglets inactifs et protège contre le pistage d’empreinte.',
      shieldActive: 'Bouclier Actif',
      zenMode: 'Mode Zen',
    },
    'de': {
      title: 'Helium Browser',
      tagline: 'Der Browser rund um Datenschutz, Zustimmung und Komfort.',
      noiseDesc: 'Helium gibt Speicher von inaktiven Tabs frei und schützt vor Fingerprinting.',
      shieldActive: 'Schutz Aktiv',
      zenMode: 'Zen-Modus',
    },
    'ja': {
      title: 'Helium ブラウザ',
      tagline: 'プライバシー、同意、快適さを中心に構築されたブラウザ。',
      noiseDesc: 'Helium は非アクティブなタブのメモリを解放し、フィンガープリントを防ぎます。',
      shieldActive: 'シールド有効',
      zenMode: 'Zen モード',
    },
    'ru': {
      title: 'Браузер Helium',
      tagline: 'Браузер, созданный для конфиденциальности, согласия и комфорта.',
      noiseDesc: 'Helium освобождает память неактивных вкладок и защищает от цифровых отпечатков.',
      shieldActive: 'Защита активна',
      zenMode: 'Режим Дзен',
    }
  };

  const currentStrings = sampleTranslations[preferences.language] || sampleTranslations['en-US'];

  const filteredLangs = POPULAR_LANGUAGES.filter(
    l => l.name.toLowerCase().includes(search.toLowerCase()) || l.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full overflow-y-auto bg-[#0e1118] text-slate-100 p-6 md:p-10 select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="p-6 bg-[#141824] border border-white/10 rounded-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white">Helium Localization & i18n</h1>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                  helium://i18n
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Helium supports 70+ localized languages from i18n/languages.json
              </p>
            </div>
          </div>
        </div>

        {/* Live Translated Preview Card */}
        <div className="p-6 bg-[#141824] border border-white/10 rounded-3xl space-y-3">
          <div className="text-xs font-semibold text-cyan-300 flex items-center gap-2">
            <Languages className="w-4 h-4" /> Live Language Strings Preview ({preferences.language})
          </div>
          <div className="space-y-2 p-4 bg-black/30 rounded-2xl text-xs">
            <div className="text-base font-bold text-white">{currentStrings.title}</div>
            <div className="text-slate-300 italic">"{currentStrings.tagline}"</div>
            <div className="text-slate-400 pt-1">{currentStrings.noiseDesc}</div>
            <div className="flex gap-2 pt-2">
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[11px]">
                {currentStrings.shieldActive}
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[11px]">
                {currentStrings.zenMode}
              </span>
            </div>
          </div>
        </div>

        {/* Languages Selection List */}
        <div className="p-6 bg-[#141824] border border-white/10 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Select Browser Language</h2>
            <div className="flex items-center gap-2 bg-[#181d2a] px-3 py-1.5 rounded-xl border border-white/10 text-xs">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search languages..."
                className="bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            {filteredLangs.map(lang => (
              <div
                key={lang.code}
                onClick={() => updatePreferences({ language: lang.code })}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  preferences.language === lang.code
                    ? 'bg-cyan-600/20 border-cyan-500 text-white shadow-md'
                    : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                <div>
                  <div className="font-semibold text-xs">{lang.name}</div>
                  <div className="text-[10px] font-mono text-slate-500">{lang.code}</div>
                </div>
                {preferences.language === lang.code && <Check className="w-4 h-4 text-cyan-400" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
