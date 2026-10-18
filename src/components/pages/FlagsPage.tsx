import React, { useState } from 'react';
import { GN_FLAGS_CONFIG } from '../../data/defaultData';
import { Sliders, Copy, Check, Download, Info, RefreshCw } from 'lucide-react';

export const FlagsPage: React.FC = () => {
  const [flags, setFlags] = useState(GN_FLAGS_CONFIG);
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState('');

  const toggleFlag = (flagName: string) => {
    setFlags(prev =>
      prev.map(f => {
        if (f.flag === flagName) {
          if (f.value === 'true') return { ...f, value: 'false' };
          if (f.value === 'false') return { ...f, value: 'true' };
          if (f.value === '0') return { ...f, value: '1' };
          if (f.value === '1') return { ...f, value: '0' };
        }
        return f;
      })
    );
  };

  const generateGnOutput = () => {
    return flags.map(f => `${f.flag}=${f.value}`).join('\n');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateGnOutput());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredFlags = flags.filter(
    f => f.flag.toLowerCase().includes(search.toLowerCase()) || f.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full overflow-y-auto bg-[#0e1118] text-slate-100 p-6 md:p-10 select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="p-6 bg-[#141824] border border-white/10 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white">GN Build Flags Configurator</h1>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                  helium://flags
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure build switches from flags.gn to strip telemetry and compile privacy presets
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-200 transition-colors flex items-center gap-2 cursor-pointer border border-white/5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copied flags.gn' : 'Copy flags.gn'}</span>
            </button>
          </div>
        </div>

        {/* Filter Input */}
        <div className="bg-[#141824] border border-white/10 rounded-2xl p-3 flex items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search GN build flags..."
            className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-mono"
          />
        </div>

        {/* Flags list */}
        <div className="bg-[#141824] border border-white/10 rounded-3xl p-6 space-y-3">
          <div className="text-xs font-semibold text-white mb-2 flex items-center justify-between">
            <span>De-Googled GN Build Switches ({filteredFlags.length})</span>
            <span className="text-[10px] text-slate-400 font-normal">Click toggle to switch flag value</span>
          </div>

          <div className="space-y-2">
            {filteredFlags.map(item => (
              <div
                key={item.flag}
                className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="font-mono text-xs font-bold text-amber-300 flex items-center gap-2">
                    <span>{item.flag}</span>
                    <span className="text-slate-500 font-normal">=</span>
                    <span className="text-emerald-400">{item.value}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">{item.description}</div>
                </div>

                {(item.value === 'true' || item.value === 'false' || item.value === '0' || item.value === '1') && (
                  <button
                    onClick={() => toggleFlag(item.flag)}
                    className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono font-medium text-slate-200 transition-colors cursor-pointer"
                  >
                    Toggle
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Raw flags.gn preview box */}
        <div className="bg-[#090b10] border border-white/10 rounded-3xl p-5 space-y-2 font-mono text-xs">
          <div className="text-slate-400 text-[11px] font-semibold flex items-center justify-between">
            <span>Generated flags.gn preview:</span>
            <span className="text-emerald-400">Ready for gn gen out/Default</span>
          </div>
          <pre className="text-slate-300 text-[11px] leading-relaxed overflow-x-auto p-3 bg-black/40 rounded-xl">
            {generateGnOutput()}
          </pre>
        </div>
      </div>
    </div>
  );
};
