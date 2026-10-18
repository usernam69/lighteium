import React, { useState } from 'react';
import { HELIUM_PATCH_LIST, PatchInfo } from '../../data/defaultData';
import { Search, Layers, FileCode, CheckCircle, ExternalLink, Filter } from 'lucide-react';

export const PatchesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPatch, setSelectedPatch] = useState<PatchInfo>(HELIUM_PATCH_LIST[0]);

  const categories = [
    { id: 'all', label: 'All Patches' },
    { id: 'helium-ui', label: 'Helium UI' },
    { id: 'helium-core', label: 'Helium Core' },
    { id: 'helium-settings', label: 'Helium Settings' },
    { id: 'ungoogled', label: 'ungoogled-chromium' },
    { id: 'bromite', label: 'Bromite' },
    { id: 'inox', label: 'Inox Patchset' },
  ];

  const filteredPatches = HELIUM_PATCH_LIST.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Simulated diff preview for the selected patch
  const generateDiffPreview = (patch: PatchInfo) => {
    return [
      `--- a/chrome/browser/ui/views/helium/${patch.name.replace('.patch', '')}.cc`,
      `+++ b/chrome/browser/ui/views/helium/${patch.name.replace('.patch', '')}.cc`,
      `@@ -1,14 +1,24 @@`,
      ` #include "base/check.h"`,
      ` #include "chrome/browser/ui/helium/helium_layout.h"`,
      `- // Standard Chromium telemetry reporting`,
      `- chrome::RegisterTelemetryPipeline();`,
      `+ // Helium: Replace telemetry with zero-knowledge loopback`,
      `+ if (HeliumShield::IsTelemetryBlocked()) {`,
      `+   VLOG(1) << "Helium: Telemetry call suppressed by ${patch.name}";`,
      `+   return;`,
      `+ }`,
      `+`,
      `+ // Apply feature: ${patch.description}`,
      `+ HeliumFeatureController::EnablePatchFeature("${patch.name}");`,
      `+ return;`
    ];
  };

  return (
    <div className="h-full flex flex-col bg-[#0e1118] text-slate-100 select-none overflow-hidden">
      {/* Top Header */}
      <div className="p-6 bg-[#121622] border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white">Helium Patchset Explorer</h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                helium://patches
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspect all 150+ applied C++ and WebUI patches from patches/series
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-[#181d2a] px-3 py-1.5 rounded-xl border border-white/10 w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search patches (e.g. dynamic, noise, bangs)..."
            className="bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none w-full font-mono"
          />
        </div>
      </div>

      {/* Main 2-column view */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Category filter + list */}
        <div className="w-80 md:w-96 border-r border-white/5 flex flex-col bg-[#10131c]">
          {/* Category tabs */}
          <div className="p-2 border-b border-white/5 flex gap-1 overflow-x-auto no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Patches list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredPatches.map(patch => {
              const isSelected = selectedPatch.name === patch.name;
              return (
                <div
                  key={patch.name}
                  onClick={() => setSelectedPatch(patch)}
                  className={`p-2.5 rounded-xl text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-purple-600/20 border border-purple-500/40 text-white'
                      : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <div className="font-mono font-medium text-[11px] text-purple-300 truncate">
                    {patch.name}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {patch.description}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-400">
                      {patch.category}
                    </span>
                    <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle className="w-2.5 h-2.5" /> applied
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Unified Diff Viewer */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#0c0e14]">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="p-4 bg-[#141824] rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold font-mono text-white">{selectedPatch.name}</span>
                <span className="text-xs font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">
                  {selectedPatch.category}
                </span>
              </div>
              <p className="text-xs text-slate-300">{selectedPatch.description}</p>
            </div>

            {/* Diff content box */}
            <div className="rounded-2xl border border-white/10 bg-[#090b10] overflow-hidden font-mono text-xs">
              <div className="px-4 py-2 bg-white/5 border-b border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Unified Diff (Git Patch Format)</span>
                <span className="text-slate-500">Quilt series order</span>
              </div>

              <div className="p-4 space-y-0.5 overflow-x-auto leading-relaxed">
                {generateDiffPreview(selectedPatch).map((line, i) => {
                  let lineClass = 'text-slate-400';
                  if (line.startsWith('+')) lineClass = 'text-emerald-400 bg-emerald-950/40 px-1 rounded';
                  else if (line.startsWith('-')) lineClass = 'text-rose-400 bg-rose-950/40 px-1 rounded';
                  else if (line.startsWith('@')) lineClass = 'text-cyan-400 bg-cyan-950/20 px-1 rounded';
                  else if (line.startsWith('---') || line.startsWith('+++')) lineClass = 'text-amber-300 font-bold';

                  return (
                    <div key={i} className={lineClass}>
                      {line}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
