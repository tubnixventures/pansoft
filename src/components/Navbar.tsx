/**
 * Pansoft Technologies – Navigation Header & Responsive Menu Drawer
 * Fully responsive across mobile, tablet, and desktop viewports.
 * Conforms to Top Bar Contract: Clean brand wordmark (no founder name in header),
 * single-line navigation links, "Pansoft Staff" portal connect, and primary CTA.
 */
import React, { useState } from 'react';
import { Menu, X, Shield, ArrowRight, UserCheck, Lock } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  onOpenStaffModal: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenStaffModal,
  onOpenAuth,
  onLogout,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setDrawerOpen(false);
  };

  const isStaffAuthenticated = currentUser?.role === 'admin';

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-4 sm:px-6 py-3.5">
          
          {/* Zone 1: Pure Brand Wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-base shadow-sm shadow-blue-500/20">
              P
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">
              Pansoft Technologies
            </span>
          </button>

          {/* Zone 2: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-slate-300">
            <button
              onClick={() => handleNavClick('home')}
              className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'home' ? 'text-blue-400 font-semibold' : 'hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => handleNavClick('services')}
              className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'services' ? 'text-blue-400 font-semibold' : 'hover:text-white'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => handleNavClick('products')}
              className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'products' ? 'text-blue-400 font-semibold' : 'hover:text-white'
              }`}
            >
              Housika & SaaS
            </button>
            <button
              onClick={() => handleNavClick('freelance')}
              className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'freelance' ? 'text-blue-400 font-semibold' : 'hover:text-white'
              }`}
            >
              Freelance Hub
            </button>
            <button
              onClick={() => handleNavClick('referrals')}
              className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'referrals' ? 'text-blue-400 font-semibold' : 'hover:text-white'
              }`}
            >
              Referrals
            </button>
            <button
              onClick={() => handleNavClick('partnerships')}
              className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 ${
                activeTab === 'partnerships' ? 'text-blue-400 font-semibold' : 'hover:text-white'
              }`}
            >
              <span>Partnership</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono font-normal">Apply</span>
            </button>
            <button
              onClick={() => handleNavClick('cloudflare-lab')}
              className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'cloudflare-lab' ? 'text-blue-400 font-semibold' : 'hover:text-white'
              }`}
            >
              Cloudflare Lab
            </button>
          </nav>

          {/* Zone 3: Actions & Pansoft Staff Access */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Dedicated "Pansoft Staff" Entry on Menu Bar */}
            <button
              onClick={() => {
                if (isStaffAuthenticated) {
                  handleNavClick('admin');
                } else {
                  onOpenStaffModal();
                }
              }}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                isStaffAuthenticated
                  ? 'bg-blue-950/80 border border-blue-700/80 text-blue-300 hover:bg-blue-900/60'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
              title="Access Pansoft internal operational and administrative console"
            >
              {isStaffAuthenticated ? (
                <>
                  <Shield className="w-3.5 h-3.5 text-blue-400" />
                  <span>Pansoft Staff (Active)</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Pansoft Staff</span>
                </>
              )}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => handleNavClick('inquire')}
              className="hidden md:inline-flex px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 shadow-sm shadow-blue-600/30 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              Request Quote
            </button>

            {/* Mobile / Tablet Drawer Toggle Button */}
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {drawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </header>

      {/* Responsive Slide-Over Mobile & Tablet Menu Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-slate-950 border-l border-slate-800 h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            
            <div className="space-y-6">
              
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                    P
                  </div>
                  <span className="font-bold text-white tracking-tight text-sm">Pansoft Technologies</span>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links List */}
              <nav className="flex flex-col space-y-1 text-sm font-medium">
                <button
                  onClick={() => handleNavClick('home')}
                  className={`text-left px-3.5 py-2.5 rounded-lg transition-colors ${
                    activeTab === 'home'
                      ? 'bg-blue-950/60 text-blue-400 font-semibold'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => handleNavClick('services')}
                  className={`text-left px-3.5 py-2.5 rounded-lg transition-colors ${
                    activeTab === 'services'
                      ? 'bg-blue-950/60 text-blue-400 font-semibold'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  Services & Architecture
                </button>
                <button
                  onClick={() => handleNavClick('products')}
                  className={`text-left px-3.5 py-2.5 rounded-lg transition-colors ${
                    activeTab === 'products'
                      ? 'bg-blue-950/60 text-blue-400 font-semibold'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  Housika & SaaS Products
                </button>
                <button
                  onClick={() => handleNavClick('freelance')}
                  className={`text-left px-3.5 py-2.5 rounded-lg transition-colors ${
                    activeTab === 'freelance'
                      ? 'bg-blue-950/60 text-blue-400 font-semibold'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  Freelance Hub (R2 ZIP)
                </button>
                <button
                  onClick={() => handleNavClick('referrals')}
                  className={`text-left px-3.5 py-2.5 rounded-lg transition-colors ${
                    activeTab === 'referrals'
                      ? 'bg-blue-950/60 text-blue-400 font-semibold'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  Referral Program
                </button>
                <button
                  onClick={() => handleNavClick('partnerships')}
                  className={`text-left px-3.5 py-2.5 rounded-lg transition-colors flex items-center justify-between ${
                    activeTab === 'partnerships'
                      ? 'bg-blue-950/60 text-blue-400 font-semibold'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <span>Partnership Hub</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono">Apply</span>
                </button>
                <button
                  onClick={() => handleNavClick('cloudflare-lab')}
                  className={`text-left px-3.5 py-2.5 rounded-lg transition-colors ${
                    activeTab === 'cloudflare-lab'
                      ? 'bg-blue-950/60 text-blue-400 font-semibold'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  Cloudflare & D1 Source Lab
                </button>
                <button
                  onClick={() => handleNavClick('contact')}
                  className={`text-left px-3.5 py-2.5 rounded-lg transition-colors ${
                    activeTab === 'contact'
                      ? 'bg-blue-950/60 text-blue-400 font-semibold'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  Contact & R2 Attachments
                </button>
              </nav>

              {/* Staff Portal Connect in Drawer */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3">
                  Internal Operations
                </div>
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    if (isStaffAuthenticated) {
                      setActiveTab('admin');
                    } else {
                      onOpenStaffModal();
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isStaffAuthenticated
                      ? 'bg-blue-950/60 border border-blue-800/80 text-blue-300'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span>Pansoft Staff Portal</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {isStaffAuthenticated ? 'Connected' : 'Authenticate'}
                  </span>
                </button>
              </div>

            </div>

            {/* Drawer Bottom CTA */}
            <div className="pt-6 border-t border-slate-800/80 space-y-3">
              <button
                onClick={() => handleNavClick('inquire')}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-blue-600/25"
              >
                <span>Request Project Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[11px] text-center text-slate-500 font-mono">
                Reg: BN-36S5WLAP · 0141380666
              </div>
            </div>

          </div>

        </div>
      )}
    </>
  );
};
