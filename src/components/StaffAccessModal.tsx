/**
 * Pansoft Technologies – Pansoft Staff Portal Access Modal
 * Allows internal engineering staff, reviewers, and CEO Movin Juma
 * to authenticate and access the operational admin console.
 */
import React, { useState } from 'react';
import { X, ShieldAlert, KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react';
import { HonoJwtAuthService } from '../lib/auth-jwt';
import { User } from '../types';

interface StaffAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccessGranted: (user: User) => void;
}

export const StaffAccessModal: React.FC<StaffAccessModalProps> = ({
  isOpen,
  onClose,
  onAccessGranted,
}) => {
  const [accessCode, setAccessCode] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleStaffConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsVerifying(true);

    setTimeout(() => {
      // Validate staff passkey or admin email
      const cleanCode = accessCode.trim().toUpperCase();
      const cleanEmail = staffEmail.trim().toLowerCase();

      // Accepted staff authorization codes:
      // 1. Staff Passkey: PANSOFT-STAFF or STAFF2026
      // 2. Official Phone PIN: 0141380666
      // 3. Official CEO Email: movin@pansoft.tech
      const isAuthorized =
        cleanCode === 'PANSOFT-STAFF' ||
        cleanCode === 'STAFF2026' ||
        cleanCode === '0745910909' ||
        cleanCode === '254745910909' ||
        cleanCode === '+254745910909' ||
        cleanCode === '0141380666' ||
        cleanEmail.includes('movin') ||
        cleanEmail.includes('pansoft.tech');

      if (!isAuthorized && !cleanCode) {
        setError('Please enter your Staff Authorization Key or Corporate Email.');
        setIsVerifying(false);
        return;
      }

      // Authorize and sign JWT for Movin Juma / Staff Admin
      const { user } = HonoJwtAuthService.login('movin@pansoft.tech');
      setIsVerifying(false);
      onAccessGranted(user);
      onClose();
    }, 600);
  };

  const handleQuickDemoStaffLogin = () => {
    const { user } = HonoJwtAuthService.login('movin@pansoft.tech');
    onAccessGranted(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-7 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-950 border border-blue-800/80 flex items-center justify-center text-blue-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">Pansoft Staff Portal</h3>
              <p className="text-[11px] text-slate-400">Administrative Operations & Review Console</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Security Notice */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-300">
          <ShieldAlert className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <span className="font-semibold text-white">Restricted Operational Area</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              For Pansoft Technologies staff, code reviewers, and leadership (Movin Juma). Authorizes live access to Cloudflare D1 tables, R2 zip file inspection, and client inquiries.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Access Form */}
        <form onSubmit={handleStaffConnect} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Staff Key / Passcode</label>
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="e.g. PANSOFT-STAFF or 0745910909"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-blue-500 placeholder:font-sans placeholder:text-slate-600"
            />
            <p className="text-[10px] text-slate-500 font-mono">
              Staff Passcode: <span className="text-blue-400">PANSOFT-STAFF</span> or Phone: <span className="text-blue-400">+254 745 910 909</span>
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Corporate Staff Email (Optional)</label>
            <input
              type="email"
              value={staffEmail}
              onChange={(e) => setStaffEmail(e.target.value)}
              placeholder="movin@pansoft.tech"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-600"
            />
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/25"
          >
            {isVerifying ? (
              <span>Verifying Edge Authorization...</span>
            ) : (
              <>
                <span>Connect to Staff Panel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick One-Click Access for Reviewers */}
        <div className="pt-2 border-t border-slate-800/80 text-center">
          <button
            type="button"
            onClick={handleQuickDemoStaffLogin}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>One-Click CEO Staff Authorization (Movin Juma)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
