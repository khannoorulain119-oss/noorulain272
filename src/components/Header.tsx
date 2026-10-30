import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  Receipt, 
  Columns2, 
  Maximize2, 
  Minimize2, 
  Settings, 
  PackagePlus, 
  Phone, 
  MapPin, 
  Home, 
  Clock, 
  Sun, 
  Moon, 
  MessageSquare,
  Zap
} from 'lucide-react';
import { DisplayMode, StoreSettings } from '../types';
import { YsmLogo } from './YsmLogo';

interface HeaderProps {
  settings: StoreSettings;
  mode: DisplayMode;
  onModeChange: (mode: DisplayMode) => void;
  onOpenSettings: () => void;
  onOpenProductManager: () => void;
  onToggleTheme: () => void;
  onQuickAddAllToBill?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  mode,
  onModeChange,
  onOpenSettings,
  onOpenProductManager,
  onToggleTheme,
  onQuickAddAllToBill,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <header className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur border-b border-slate-800 text-slate-100 select-none sticky top-0 z-40 transition-colors">
      {/* Top Banner / Store Contacts & Dargai Location Info */}
      <div className="px-4 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60 text-xs">
        {/* Left: Location & House / Shop address */}
        <div className="flex items-center gap-3 text-slate-300">
          <div className="flex items-center gap-1.5 font-medium text-emerald-400">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
            <span className="tracking-wide font-semibold">{settings.location}</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5 text-slate-400 hidden sm:flex">
            <Home className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span className="truncate max-w-xs">{settings.houseAddress}</span>
          </div>
        </div>

        {/* Center & Right: WhatsApp & EasyPaisa Number and Live Clock */}
        <div className="flex items-center gap-4">
          {/* Primary Phone & WhatsApp & EasyPaisa badge */}
          <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-lg text-emerald-300 shadow-sm">
            <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-mono-numbers font-bold tracking-wider text-xs">{settings.phone}</span>
            <div className="flex items-center gap-1 ml-1 pl-2 border-l border-emerald-500/30 text-[10px] font-semibold">
              <span className="px-1.5 py-0.2 rounded bg-emerald-700/60 text-white flex items-center gap-1">
                <MessageSquare className="w-2.5 h-2.5 text-emerald-300" />
                WhatsApp
              </span>
              <span className="px-1.5 py-0.2 rounded bg-amber-600/60 text-amber-100">
                EasyPaisa
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 text-slate-400 hidden lg:flex font-mono-numbers text-xs">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{currentDate}</span>
            <span className="text-slate-600">·</span>
            <span className="text-emerald-400 font-semibold">{currentTime}</span>
          </div>
        </div>
      </div>

      {/* Main Bar: Brand, YSM Emblem, Mode Switcher, and Quick Actions */}
      <div className="px-4 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Area with New Luxury YSM Crest Logo */}
        <div className="flex items-center gap-3.5">
          <YsmLogo onClick={onOpenSettings} size="md" />

          <div>
            <h1 className="font-display text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              {settings.storeName}
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              Digital Signage Billboard & Customer POS Receipt System · Dargai
            </p>
          </div>
        </div>

        {/* Display Mode Switcher */}
        <div className="flex items-center bg-slate-800/90 p-1.5 rounded-xl border border-slate-700/80 shadow-inner">
          <button
            onClick={() => onModeChange('billboard')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              mode === 'billboard'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
            title="Auto-slide product-by-product showcase"
          >
            <Tv className="w-4 h-4" />
            <span>Product Billboard</span>
          </button>

          <button
            onClick={() => onModeChange('receipt')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              mode === 'receipt'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
            title="Customer Bill & Live Checkout Counter"
          >
            <Receipt className="w-4 h-4" />
            <span>Customer Receipt (POS)</span>
          </button>

          <button
            onClick={() => onModeChange('split')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              mode === 'split'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
            title="Split screen: Live Bill + Product Promo"
          >
            <Columns2 className="w-4 h-4" />
            <span>Dual Screen (POS + Promo)</span>
          </button>
        </div>

        {/* Right Actions: Inventory Manager, Direct Add All, Settings, Fullscreen */}
        <div className="flex items-center gap-2 shrink-0">
          {onQuickAddAllToBill && (
            <button
              onClick={onQuickAddAllToBill}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/40 transition-all"
              title="Direct 1-Click: Add top mini mart items straight into Customer Bill"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Direct Add Items</span>
            </button>
          )}

          <button
            onClick={onOpenProductManager}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Manage Products & Discounts"
          >
            <PackagePlus className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xl:inline">Products</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            title="Store Settings & Contact Details"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            title="Toggle Light / Dark Mode"
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-300" />
            )}
          </button>

          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden md:inline">{isFullscreen ? 'Exit Full' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
