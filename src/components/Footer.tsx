/**
 * Pansoft Technologies – Corporate Footer
 * Fully compliant with Section 1.B (No ornamental engines, quiet copyright, legal notices).
 * Displays official registration: BN-36S5WLAP, phone: 0141380666, founder: Movin Juma.
 */
import React from 'react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/60">
          
          {/* Column 1: Brand & Registration Identity */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                P
              </div>
              <span className="font-bold text-white tracking-tight">Pansoft Technologies</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Software design, development and maintenance. Designing robust server architectures, Cloudflare edge applications, and fintech payment gateways.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <div><strong className="text-slate-300">Registration:</strong> BN-36S5WLAP</div>
              <div><strong className="text-slate-300">Founder & CEO:</strong> Movin Juma</div>
              <div><strong className="text-slate-300">Public Contact:</strong> 0141380666 (+254 141 380 666)</div>
            </div>
          </div>

          {/* Column 2: Solutions & SaaS */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Solutions & SaaS</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('products')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">
                  Housika Rental Marketplace
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('products')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">
                  Paystack Payment Integrations
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('services')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">
                  Cloudflare Edge & D1 Migration
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('services')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">
                  Full-Stack TypeScript & Node.js
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('services')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">
                  Multi-Cloud: GCP, Azure & AWS
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Freelance & Partnerships */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Ecosystem & Talent</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('freelance')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">
                  Freelance Hub & Code Review
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('freelance')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">
                  R2 ZIP Code Bundle Upload
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('referrals')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">
                  Partner Referral Program
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('referrals')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">
                  Negotiated Payout Calculator
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('cloudflare-lab')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">
                  Cloudflare & Nuxt 3 Source Export
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Verification */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Direct Engagement</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Available for technical consultations, contract sprints, and specialized enterprise software architectures.
            </p>
            <div className="pt-1 flex flex-col gap-2">
              <button
                onClick={() => setActiveTab('inquire')}
                className="w-full text-center px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                Inquire For Project
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className="w-full text-center px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-transparent border border-slate-800 hover:border-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                Contact & Attach Specs (R2)
              </button>
            </div>
          </div>

        </div>

        {/* Bottom row: Quiet copyright and legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Pansoft Technologies.</span>
            <span>·</span>
            <span>Registered: BN-36S5WLAP</span>
            <span>·</span>
            <span>Founder & CEO: Movin Juma</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setActiveTab('admin')} className="hover:text-slate-300 cursor-pointer">
              Admin Access
            </button>
            <span>·</span>
            <span>Zeptomail Transactional Edge</span>
            <span>·</span>
            <span>Tel: 0141380666 (+254 141 380 666)</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
