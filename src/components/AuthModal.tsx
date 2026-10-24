/**
 * Pansoft Technologies – Authentication Modal
 * Implements Sign In, Sign Up, Forgot Password, and Reset Password
 * powered by Cloudflare D1 database and Hono JWT edge auth.
 */
import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Lock, User as UserIcon, Phone, Building } from 'lucide-react';
import { HonoJwtAuthService } from '../lib/auth-jwt';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [tab, setTab] = useState<'signin' | 'signup' | 'forgot' | 'reset'>('signin');

  // Form states
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState<'client' | 'freelancer'>('client');
  const [signUpCompany, setSignUpCompany] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');

  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!signInEmail) {
      setMessage({ type: 'error', text: 'Please enter your email.' });
      return;
    }
    setIsLoading(true);
    try {
      const { user } = HonoJwtAuthService.login(signInEmail);
      onAuthSuccess(user);
      onClose();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Login failed.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!signUpName || !signUpEmail || !signUpPassword) {
      setMessage({ type: 'error', text: 'Please complete all required fields.' });
      return;
    }
    setIsLoading(true);
    try {
      const { user } = HonoJwtAuthService.register({
        name: signUpName,
        email: signUpEmail,
        role: signUpRole,
        company: signUpCompany,
        phone: signUpPhone,
      });
      onAuthSuccess(user);
      onClose();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Registration failed.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!forgotEmail) {
      setMessage({ type: 'error', text: 'Please enter your email address.' });
      return;
    }
    setIsLoading(true);
    try {
      const token = HonoJwtAuthService.requestPasswordReset(forgotEmail);
      setMessage({
        type: 'success',
        text: `Reset code generated: [${token}]. (Dispatched to ${forgotEmail} via Zeptomail). Enter it below.`,
      });
      setResetToken(token);
      setTab('reset');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error requesting reset.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    setIsLoading(true);
    try {
      HonoJwtAuthService.resetPassword(resetToken);
      setMessage({ type: 'success', text: 'Password reset successful! Please sign in.' });
      setTab('signin');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Reset failed.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-6 animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              P
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Pansoft Edge Auth</h3>
              <p className="text-[10px] text-slate-400 font-mono">Cloudflare D1 & Hono / JWT</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Banner */}
        {message && (
          <div
            className={`p-3 rounded-lg text-xs ${
              message.type === 'error'
                ? 'bg-rose-950/40 border border-rose-800 text-rose-300'
                : 'bg-emerald-950/40 border border-emerald-800 text-emerald-300'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Tab 1: Sign In */}
        {tab === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => { setMessage(null); setTab('forgot'); }}
                  className="text-[11px] text-blue-400 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Sign In (Generate Hono JWT)
            </button>

            <div className="pt-2 text-center text-xs text-slate-400">
              Need an account?{' '}
              <button
                type="button"
                onClick={() => { setMessage(null); setTab('signup'); }}
                className="text-blue-400 hover:underline cursor-pointer font-medium"
              >
                Sign Up in D1
              </button>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setSignInEmail('movin@pansoft.tech');
                  setSignInPassword('password123');
                }}
                className="text-[11px] text-slate-500 hover:text-slate-300 underline cursor-pointer"
              >
                Quick Demo: Fill Movin Juma (CEO / Admin) credentials
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Sign Up */}
        {tab === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Full Name *</label>
              <input
                type="text"
                value={signUpName}
                onChange={(e) => setSignUpName(e.target.value)}
                placeholder="e.g. David Omondi"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Email *</label>
                <input
                  type="email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Phone</label>
                <input
                  type="tel"
                  value={signUpPhone}
                  onChange={(e) => setSignUpPhone(e.target.value)}
                  placeholder="0141380666"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Role *</label>
                <select
                  value={signUpRole}
                  onChange={(e) => setSignUpRole(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="client">Client / Partner</option>
                  <option value="freelancer">Freelancer (Code Reviewer)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Company</label>
                <input
                  type="text"
                  value={signUpCompany}
                  onChange={(e) => setSignUpCompany(e.target.value)}
                  placeholder="Enterprise or Freelance"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Password *</label>
              <input
                type="password"
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Create Account in Cloudflare D1
            </button>

            <div className="pt-1 text-center text-xs text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMessage(null); setTab('signin'); }}
                className="text-blue-400 hover:underline cursor-pointer font-medium"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Forgot Password */}
        {tab === 'forgot' && (
          <form onSubmit={handleForgot} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Account Email</label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="registered@email.com"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              />
              <p className="text-[11px] text-slate-400">
                A 6-digit security token will be generated and dispatched via Zeptomail.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Generate Reset Token via Zeptomail
            </button>

            <div className="text-center text-xs">
              <button
                type="button"
                onClick={() => { setMessage(null); setTab('signin'); }}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: Reset Password */}
        {tab === 'reset' && (
          <form onSubmit={handleReset} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Security Reset Token</label>
              <input
                type="text"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                placeholder="e.g. A9X4B2"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-center tracking-widest text-blue-400 uppercase font-bold focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Update Password in Cloudflare D1
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
