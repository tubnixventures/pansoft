/**
 * Pansoft Technologies – User Profile & JWT Session Viewer
 * Displays Cloudflare D1 user record and inspects active Hono JWT token claims.
 */
import React from 'react';
import { User, Shield, Key, Database, RefreshCw, CheckCircle, FileText } from 'lucide-react';
import { User as UserType } from '../types';
import { HonoJwtAuthService } from '../lib/auth-jwt';
import { d1 } from '../lib/d1-client';

interface ProfileViewProps {
  currentUser: UserType | null;
  onUserUpdated: (user: UserType) => void;
  onLogout: () => void;
  setActiveTab: (tab: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onUserUpdated,
  onLogout,
  setActiveTab,
}) => {
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-24 p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">No Active Session</h2>
        <p className="text-xs text-slate-400">Please sign in to access your Pansoft profile.</p>
        <button
          onClick={() => setActiveTab('home')}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold cursor-pointer"
        >
          Return Home
        </button>
      </div>
    );
  }

  const token = HonoJwtAuthService.getSessionToken();
  const tokenPayload = token ? HonoJwtAuthService.verify(token) : null;

  const handleSwitchRole = (newRole: UserType['role']) => {
    d1.updateUserRole(currentUser.id, newRole);
    const updated = d1.getUserById(currentUser.id);
    if (updated) {
      // Re-sign token
      HonoJwtAuthService.login(updated.email);
      onUserUpdated(updated);
    }
  };

  const userInquiries = d1.getInquiries().filter(i => i.email.toLowerCase() === currentUser.email.toLowerCase());
  const userSubmissions = d1.getFreelanceSubmissions().filter(s => s.email.toLowerCase() === currentUser.email.toLowerCase());

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <span>D1 Identity & Profile</span>
            <span aria-hidden="true">·</span>
            <span>Hono JWT Verified</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">{currentUser.name}</h1>
          <p className="text-xs text-slate-400 font-mono">
            ID: {currentUser.id} · Registered in Cloudflare D1
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-rose-400 hover:text-rose-300 text-xs font-semibold cursor-pointer transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Profile Overview Card & Role Switcher for Evaluators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Col 1 & 2: User details */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-6">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-400" />
            <span>Profile Information</span>
          </h3>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400">Email Address:</span>
              <div className="font-semibold text-white font-mono mt-0.5">{currentUser.email}</div>
            </div>
            <div>
              <span className="text-slate-400">Current Role:</span>
              <div className="font-semibold text-blue-400 uppercase mt-0.5">{currentUser.role}</div>
            </div>
            <div>
              <span className="text-slate-400">Organization:</span>
              <div className="font-semibold text-white mt-0.5">{currentUser.company || 'Pansoft Technologies'}</div>
            </div>
            <div>
              <span className="text-slate-400">Contact Number:</span>
              <div className="font-semibold text-white font-mono mt-0.5">{currentUser.phone || '+254 745 910 909'}</div>
            </div>
          </div>

          {/* Role testing switcher */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white">Switch Role for Testing (Live Edge Simulation):</span>
              <span className="text-[10px] text-slate-400 font-mono">Updates D1 & JWT Claims</span>
            </div>
            <div className="flex gap-2 text-xs">
              {(['client', 'freelancer', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => handleSwitchRole(r)}
                  className={`flex-1 py-1.5 rounded-lg font-medium capitalize cursor-pointer transition-colors ${
                    currentUser.role === r
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Col 3: Hono JWT Payload Token Details */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3 font-sans">
            <Key className="w-4 h-4 text-emerald-400" />
            <span>Hono JWT Claims</span>
          </div>

          {tokenPayload ? (
            <div className="space-y-2 text-slate-300">
              <div>
                <span className="text-slate-400">alg:</span> <span className="text-white">HS256</span>
              </div>
              <div>
                <span className="text-slate-400">sub:</span> <span className="text-white truncate block">{tokenPayload.sub}</span>
              </div>
              <div>
                <span className="text-slate-400">role:</span> <span className="text-emerald-400">{tokenPayload.role}</span>
              </div>
              <div>
                <span className="text-slate-400">iat:</span> <span className="text-white">{tokenPayload.iat}</span>
              </div>
              <div>
                <span className="text-slate-400">exp:</span> <span className="text-white">{tokenPayload.exp}</span>
              </div>
              <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-800 font-sans">
                Verified with Pansoft Edge Secret Key.
              </div>
            </div>
          ) : (
            <div className="text-slate-400">No active token signature verified.</div>
          )}
        </div>

      </div>

      {/* User Inquiries or Submissions in D1 */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-400" />
          <span>Your Registered Records in Cloudflare D1</span>
        </h3>

        {currentUser.role === 'freelancer' ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 overflow-x-auto">
            {userSubmissions.length > 0 ? (
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3">Archive File (ZIP)</th>
                    <th className="px-5 py-3">Specialty</th>
                    <th className="px-5 py-3">Negotiated Fee</th>
                    <th className="px-5 py-3">Review Status</th>
                    <th className="px-5 py-3">Payout State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {userSubmissions.map((s) => (
                    <tr key={s.id}>
                      <td className="px-5 py-3 font-mono text-blue-400">{s.zipFileName}</td>
                      <td className="px-5 py-3">{s.specialty}</td>
                      <td className="px-5 py-3 font-mono text-emerald-400 font-semibold">{s.negotiatedFee}</td>
                      <td className="px-5 py-3 capitalize">{s.reviewStatus}</td>
                      <td className="px-5 py-3 capitalize text-blue-400">{s.payoutStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                No code submissions logged under {currentUser.email} yet.{' '}
                <button onClick={() => setActiveTab('freelance')} className="text-blue-400 hover:underline">
                  Submit code to R2 →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 overflow-x-auto">
            {userInquiries.length > 0 ? (
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3">Project Type</th>
                    <th className="px-5 py-3">Budget</th>
                    <th className="px-5 py-3">Timeline</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {userInquiries.map((inq) => (
                    <tr key={inq.id}>
                      <td className="px-5 py-3 font-medium text-white">{inq.projectType}</td>
                      <td className="px-5 py-3 font-mono text-slate-300">{inq.budget}</td>
                      <td className="px-5 py-3 text-slate-400">{inq.timeline}</td>
                      <td className="px-5 py-3 capitalize text-blue-400 font-semibold">{inq.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                No active project inquiries logged under {currentUser.email} yet.{' '}
                <button onClick={() => setActiveTab('inquire')} className="text-blue-400 hover:underline">
                  Request a Quote →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
