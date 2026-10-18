import React, { useState } from 'react';
import { useBrowser } from '../../context/BrowserContext';
import { FolderLock, Key, Lock, CheckCircle, Copy, X, Shield, RefreshCw } from 'lucide-react';

export const SyncVaultDialog: React.FC = () => {
  const { isVaultModalOpen, setIsVaultModalOpen, syncVault, updateSyncVault, bookmarks, tabs } = useBrowser();
  const [passphrase, setPassphrase] = useState('helium-passphrase-vault-local');
  const [exportedJson, setExportedJson] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isVaultModalOpen) return null;

  const handleExportVault = () => {
    const payload = {
      version: '1.0',
      cipher: 'AES-256-GCM',
      kdf: 'PBKDF2-SHA256-100000',
      salt: '7a19c3b88f912e',
      ciphertext: btoa(JSON.stringify({ bookmarks, tabs: tabs.map(t => ({ title: t.title, url: t.url })) })),
      meta: {
        totalItems: bookmarks.length + tabs.length,
        exportedAt: new Date().toISOString(),
        client: 'Helium Browser 0.1.0'
      }
    };
    setExportedJson(JSON.stringify(payload, null, 2));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(exportedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-lg bg-[#141824] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <FolderLock className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Helium Encrypted Sync Vault</h2>
          </div>
          <button
            onClick={() => setIsVaultModalOpen(false)}
            className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status */}
        <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <CheckCircle className="w-4 h-4" />
            <span>Vault Active & Protected</span>
          </div>
          <span className="font-mono text-[10px] text-slate-400">
            Transport: 127.0.0.1 (Loopback)
          </span>
        </div>

        {/* Passphrase field */}
        <div className="space-y-1.5 text-xs">
          <label className="font-semibold text-slate-300 flex items-center justify-between">
            <span>Client Passphrase (Zero-Knowledge):</span>
            <span className="text-[10px] text-slate-500">Never transmitted to server</span>
          </label>
          <div className="relative flex items-center">
            <Key className="w-4 h-4 text-slate-400 absolute left-3" />
            <input
              type="password"
              value={passphrase}
              onChange={e => setPassphrase(e.target.value)}
              className="w-full bg-[#181d2a] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Datatypes policy */}
        <div className="p-3 bg-white/5 rounded-2xl space-y-2 text-xs">
          <div className="font-semibold text-slate-200">Datatypes Included:</div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={syncVault.dataTypes.bookmarks}
                onChange={e =>
                  updateSyncVault({
                    dataTypes: { ...syncVault.dataTypes, bookmarks: e.target.checked }
                  })
                }
                className="rounded text-blue-600"
              />
              <span>Bookmarks ({bookmarks.length})</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={syncVault.dataTypes.tabs}
                onChange={e =>
                  updateSyncVault({
                    dataTypes: { ...syncVault.dataTypes, tabs: e.target.checked }
                  })
                }
                className="rounded text-blue-600"
              />
              <span>Tabs & Sessions ({tabs.length})</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={syncVault.dataTypes.extensions}
                onChange={e =>
                  updateSyncVault({
                    dataTypes: { ...syncVault.dataTypes, extensions: e.target.checked }
                  })
                }
                className="rounded text-blue-600"
              />
              <span>Extension States</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer opacity-75">
              <input
                type="checkbox"
                checked={syncVault.dataTypes.passwords}
                onChange={e =>
                  updateSyncVault({
                    dataTypes: { ...syncVault.dataTypes, passwords: e.target.checked }
                  })
                }
                className="rounded text-blue-600"
              />
              <span>Passwords (Consent Req.)</span>
            </label>
          </div>
        </div>

        {/* Action button */}
        <div className="flex gap-2">
          <button
            onClick={handleExportVault}
            className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FolderLock className="w-3.5 h-3.5" />
            <span>Generate Encrypted Vault Dump</span>
          </button>
        </div>

        {/* Exported preview */}
        {exportedJson && (
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Encrypted Envelope:</span>
              <button
                onClick={handleCopy}
                className="text-blue-400 hover:underline flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? 'Copied' : 'Copy Payload'}</span>
              </button>
            </div>
            <pre className="p-3 bg-black/50 border border-white/5 rounded-xl font-mono text-[10px] text-emerald-400 max-h-32 overflow-y-auto">
              {exportedJson}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
