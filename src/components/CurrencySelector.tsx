/**
 * Pansoft Technologies – East African Currency Selector
 * Provides fast localized currency switching across Kenya, Tanzania, Uganda,
 * Rwanda, Burundi, Ethiopia, and Global USD.
 */
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe, Check } from 'lucide-react';
import { EastAfricanCurrency, EAST_AFRICAN_CURRENCIES } from '../lib/currency';

interface CurrencySelectorProps {
  currentCurrency: EastAfricanCurrency;
  onCurrencyChange: (curr: EastAfricanCurrency) => void;
  compact?: boolean;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  currentCurrency,
  onCurrencyChange,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeConfig = EAST_AFRICAN_CURRENCIES[currentCurrency] || EAST_AFRICAN_CURRENCIES.KES;

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-900/80 px-2.5 py-1 text-xs font-medium text-slate-200 hover:border-slate-600 hover:bg-slate-800 transition-colors cursor-pointer ${
          compact ? 'text-[11px] py-0.5 px-2' : ''
        }`}
        title={`Active Currency: ${activeConfig.name} (${activeConfig.country})`}
      >
        <span className="text-sm leading-none" role="img" aria-label={activeConfig.country}>
          {activeConfig.flag}
        </span>
        <span className="font-mono font-bold text-white">{activeConfig.code}</span>
        <span className="text-slate-400 font-mono text-[10px]">({activeConfig.symbol})</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-60 rounded-xl border border-slate-700 bg-slate-900/95 backdrop-blur-md p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2 py-1.5 border-b border-slate-800 text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>East Africa Regional Currencies</span>
            <span className="text-blue-400 font-mono">KES Base</span>
          </div>

          <div className="py-1 max-h-64 overflow-y-auto space-y-0.5">
            {(Object.keys(EAST_AFRICAN_CURRENCIES) as EastAfricanCurrency[]).map((code) => {
              const item = EAST_AFRICAN_CURRENCIES[code];
              const isSelected = code === currentCurrency;

              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    onCurrencyChange(code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                    isSelected
                      ? 'bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{item.flag}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-white">{item.code}</span>
                        <span className="text-slate-400 text-[11px]">({item.symbol})</span>
                      </div>
                      <div className="text-[10px] text-slate-400">{item.country} · {item.name}</div>
                    </div>
                  </div>

                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="pt-1.5 mt-1 border-t border-slate-800 px-2 text-[10px] text-slate-400">
            Powered by Paystack & M-Pesa automated rate feeds.
          </div>
        </div>
      )}
    </div>
  );
};
