import React, { useState } from 'react';
import { 
  X, 
  Store, 
  MapPin, 
  Home, 
  Phone, 
  Clock, 
  DollarSign, 
  Check, 
  Sparkles, 
  Download, 
  Upload, 
  ShieldCheck 
} from 'lucide-react';
import { StoreSettings } from '../types';

interface StoreSettingsModalProps {
  settings: StoreSettings;
  isOpen: boolean;
  onClose: () => void;
  onSaveSettings: (settings: StoreSettings) => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const StoreSettingsModal: React.FC<StoreSettingsModalProps> = ({
  settings,
  isOpen,
  onClose,
  onSaveSettings,
  onExportData,
  onImportData,
}) => {
  const [formData, setFormData] = useState<StoreSettings>({ ...settings });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-emerald-600 to-teal-800 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {formData.shortCode || 'YSM'}
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Store Profile & 27" Display Settings
              </h3>
              <p className="text-xs text-slate-400">
                Configure store branding, Dargai location, phone and billboard behavior
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Brand & Monogram */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-slate-400 block mb-1 font-medium flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-emerald-400" />
                <span>Store Name</span>
              </label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Short Monogram (Badge)</label>
              <input
                type="text"
                value={formData.shortCode}
                onChange={(e) => setFormData({ ...formData, shortCode: e.target.value.toUpperCase().slice(0, 4) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono font-bold text-center uppercase focus:outline-none focus:border-emerald-500"
                maxLength={4}
                required
              />
            </div>
          </div>

          {/* Location & House Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Town / Location</span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Dargai, Malakand"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-emerald-400" />
                <span>House / Shop / Street Address</span>
              </label>
              <input
                type="text"
                value={formData.houseAddress}
                onChange={(e) => setFormData({ ...formData, houseAddress: e.target.value })}
                placeholder="Main Road Near Old Post Office, Shop #14"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          {/* Contact Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-medium flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Primary Phone / Mobile Number (03163514886)</span>
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="03163514886"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono-numbers focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">WhatsApp / EasyPaisa Number</label>
              <input
                type="text"
                value={formData.alternatePhone || ''}
                onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                placeholder="03163514886"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono-numbers focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Display & Billboard Timing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Slide Interval (Seconds)</span>
              </label>
              <select
                value={formData.slideshowInterval}
                onChange={(e) => setFormData({ ...formData, slideshowInterval: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value={3}>3 Seconds (Fast)</option>
                <option value={5}>5 Seconds (Normal)</option>
                <option value={6}>6 Seconds (Recommended)</option>
                <option value={8}>8 Seconds (Relaxed)</option>
                <option value={10}>10 Seconds (Showcase)</option>
                <option value={15}>15 Seconds (Slow)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Currency Symbol</span>
              </label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-emerald-500 text-center"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Cashier / Counter ID</label>
              <input
                type="text"
                value={formData.cashierName}
                onChange={(e) => setFormData({ ...formData, cashierName: e.target.value })}
                placeholder="Counter 01"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Marquee Ticker Announcement */}
          <div>
            <label className="text-slate-400 block mb-1 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Bottom Announcement Bar (Ticker Text)</span>
            </label>
            <textarea
              rows={2}
              value={formData.marqueeText}
              onChange={(e) => setFormData({ ...formData, marqueeText: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              placeholder="Announcements, delivery info, special greetings..."
            />
          </div>

          {/* Offline Data Backup & Portability */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Offline Storage</span>
            </div>
            <p className="text-[11px] text-slate-400">
              All mart products, sales receipts, and settings are saved on this local machine. You can export a backup file or restore anytime.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onExportData}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export Backup (JSON)</span>
              </button>

              <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Import Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={onImportData}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/30 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
