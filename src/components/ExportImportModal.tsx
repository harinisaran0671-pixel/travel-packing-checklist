import React, { useState } from 'react';
import { X, Download, Upload, Copy, Check } from 'lucide-react';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  exportData: string;
  onImport: (jsonStr: string) => boolean;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  exportData,
  onImport,
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [importText, setImportText] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(exportData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `packvoyage-checklist-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!importText.trim()) return;

    const success = onImport(importText.trim());
    if (success) {
      onClose();
    } else {
      setErrorMsg('Invalid checklist JSON format. Please verify the copied structure.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('export');
                setErrorMsg('');
              }}
              className={`text-xs font-semibold pb-1 border-b-2 transition-colors ${
                activeTab === 'export'
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Export Checklist JSON
            </button>
            <span className="text-slate-300">·</span>
            <button
              onClick={() => {
                setActiveTab('import');
                setErrorMsg('');
              }}
              className={`text-xs font-semibold pb-1 border-b-2 transition-colors ${
                activeTab === 'import'
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Import Checklist JSON
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'export' ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                You can copy this JSON to save a backup, share with travel companions, or import on another device.
              </p>
              <textarea
                readOnly
                value={exportData}
                rows={9}
                className="w-full p-3 font-mono text-[11px] bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
              />
              <div className="flex items-center justify-end gap-2.5">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy JSON'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .json file</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleImportSubmit} className="space-y-4">
              <p className="text-xs text-slate-600">
                Paste a previously exported PackVoyage trip JSON below to load it into your checklist:
              </p>
              <textarea
                value={importText}
                onChange={e => {
                  setImportText(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Paste valid JSON here..."
                rows={9}
                className="w-full p-3 font-mono text-[11px] bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
              {errorMsg && (
                <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>
              )}
              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!importText.trim()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 rounded-lg shadow-xs transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import Checklist</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
