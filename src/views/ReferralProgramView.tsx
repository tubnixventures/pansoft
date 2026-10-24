/**
 * Pansoft Technologies – Partner & Client Referral Program
 * Transparent compensation: All referral rewards are as per negotiated agreement.
 * Includes interactive reward estimator, Zod lead registration, and Zeptomail dispatch.
 */
import React, { useState } from 'react';
import { Gift, Calculator, ArrowRight, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';
import { d1 } from '../lib/d1-client';
import { zeptomail } from '../lib/zeptomail-client';
import { BackendApiClient } from '../lib/api-client';
import { referralSchema, ReferralInput } from '../lib/validation';
import { Referral } from '../types';

import { EastAfricanCurrency, EAST_AFRICAN_CURRENCIES, formatCurrency } from '../lib/currency';
import { CurrencySelector } from '../components/CurrencySelector';

export const ReferralProgramView: React.FC = () => {
  const [currency, setCurrency] = useState<EastAfricanCurrency>('KES');
  const [dealSizeKes, setDealSizeKes] = useState<number>(350000);
  const [projectCategory, setProjectCategory] = useState<'saas' | 'edge' | 'fintech' | 'maintenance'>('saas');
  const [referrals, setReferrals] = useState<Referral[]>(d1.getReferrals());

  const [formInput, setFormInput] = useState<ReferralInput>({
    referrerName: '',
    referrerEmail: '',
    referrerPhone: '',
    leadName: '',
    leadCompany: '',
    leadEmail: '',
    leadPhone: '',
    estimatedProjectSize: 'KSh 100,000 – KSh 350,000 (Custom SaaS / Housika)',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<Referral | null>(null);

  // Dynamic calculation of negotiated rewards
  const getCommissionRate = (sizeKes: number): number => {
    if (sizeKes < 100000) return 0.08; // 8%
    if (sizeKes < 500000) return 0.10; // 10%
    if (sizeKes < 1500000) return 0.12; // 12%
    return 0.15; // 15% for enterprise deals
  };

  const currentRate = getCommissionRate(dealSizeKes);
  const estimatedRewardKes = Math.round(dealSizeKes * currentRate);

  const handleSubmitReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const valResult = referralSchema.safeParse(formInput);
    if (!valResult.success) {
      const errMap: Record<string, string> = {};
      valResult.error.issues.forEach((err) => {
        if (err.path[0]) errMap[err.path[0] as string] = err.message;
      });
      setErrors(errMap);
      return;
    }

    setIsSubmitting(true);
    try {
      const rateLabel = `${(currentRate * 100).toFixed(0)}% Negotiated Reward (~${formatCurrency(estimatedRewardKes, currency)})`;

      const refData = {
        referrerName: formInput.referrerName,
        referrerEmail: formInput.referrerEmail,
        referrerPhone: formInput.referrerPhone,
        leadName: formInput.leadName,
        leadCompany: formInput.leadCompany,
        leadEmail: formInput.leadEmail,
        leadPhone: formInput.leadPhone,
        estimatedProjectSize: formInput.estimatedProjectSize,
        negotiatedRewardRate: rateLabel,
        notes: formInput.notes,
      };

      const newRef = d1.insertReferral(refData);
      try {
        await BackendApiClient.createReferral(refData);
      } catch (err) {
        console.warn('Backend referral sync warning:', err);
      }

      // Dispatch Zeptomail confirmation to the referrer
      zeptomail.sendTransactionalEmail({
        toEmail: formInput.referrerEmail,
        toName: formInput.referrerName,
        subject: `Pansoft Partner Referral Confirmed: ${formInput.leadCompany}`,
        templateType: 'referral_confirmed',
        variables: {
          leadCompany: formInput.leadCompany,
        },
      });

      setSubmissionSuccess(newRef);
      setReferrals(d1.getReferrals());
      setFormInput({
        referrerName: '',
        referrerEmail: '',
        referrerPhone: '',
        leadName: '',
        leadCompany: '',
        leadEmail: '',
        leadPhone: '',
        estimatedProjectSize: '$10,000 - $20,000 (Custom SaaS / Housika)',
        notes: '',
      });
    } catch (err) {
      console.error(err);
      alert('Failed to register referral in Cloudflare D1.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      
      {/* 1. Policy & Value Proposition Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
          <span>Partnership & Ecosystem</span>
          <span aria-hidden="true">·</span>
          <span>Transparent Rewards</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
          Partner & Client Referral Program
        </h1>
        <p className="text-slate-300 text-base leading-relaxed">
          We actively reward colleagues, engineers, and corporate partners who introduce prospective clients or enterprise users to our growing software platform. <strong>All referral fees are structured as per negotiated agreement</strong> based on project scale and contract milestones.
        </p>
      </div>

      {/* 2. Interactive Negotiated Reward Estimator */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 sm:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800/80 flex items-center justify-center text-blue-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Interactive Referral Reward Estimator</h2>
              <p className="text-xs text-slate-400">Model your expected commission based on East African project scope and tier.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Currency:</span>
            <CurrencySelector
              currentCurrency={currency}
              onCurrencyChange={(c) => setCurrency(c)}
              compact
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span className="font-semibold">Estimated Client Contract Value:</span>
                <span className="font-mono text-base font-bold text-white">
                  {formatCurrency(dealSizeKes, currency)}
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="3000000"
                step="50000"
                value={dealSizeKes}
                onChange={(e) => setDealSizeKes(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>{formatCurrency(50000, currency)}</span>
                <span>{formatCurrency(500000, currency)}</span>
                <span>{formatCurrency(1500000, currency)}</span>
                <span>{formatCurrency(3000000, currency)}+</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Contract Engagement Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'saas', label: 'Housika / SaaS' },
                  { key: 'edge', label: 'Cloudflare Edge' },
                  { key: 'fintech', label: 'Paystack Gateway' },
                  { key: 'maintenance', label: 'Yearly Retainer' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setProjectCategory(item.key as any)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer text-center ${
                      projectCategory === item.key
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                        : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-slate-400 space-y-1">
              <div>• Tier 1 (&lt; KSh 100k): 8% baseline negotiated commission</div>
              <div>• Tier 2 (KSh 100k – 500k): 10% negotiated reward rate</div>
              <div>• Tier 3 (KSh 500k – 1.5M): 12% high-scale partner rate</div>
              <div>• Tier 4 (KSh 1.5M+): 15% enterprise strategic partner reward</div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Projected Partner Payout ({EAST_AFRICAN_CURRENCIES[currency].code})
            </div>
            
            <div>
              <div className="text-3xl sm:text-4xl font-bold font-mono text-emerald-400">
                {formatCurrency(estimatedRewardKes, currency)}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Based on {(currentRate * 100).toFixed(0)}% negotiated compensation rate
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                <span><strong>50% Initial Tranche:</strong> Dispatched upon client contract signing and down payment.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                <span><strong>50% Final Tranche:</strong> Dispatched upon milestone sign-off.</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400">
              Payments disbursed via Bank Wire, Paystack, or M-Pesa.
            </div>
          </div>

        </div>
      </div>

      {/* 3. Partner Lead Submission Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">Register a Lead or Partner Inquiry</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Submit contact details for an organization or founder seeking software design, development, Housika deployment, or cloud infrastructure.
          </p>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="font-semibold text-white">How We Protect Referrers:</div>
            <div>1. We log lead provenance into Cloudflare D1 with an immutable timestamp.</div>
            <div>2. You receive an automated Zeptomail confirmation with your referral ID.</div>
            <div>3. We notify you as the client passes discovery and contract stages.</div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmitReferral}
            className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-5"
          >
            {submissionSuccess && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-200 space-y-1">
                <div className="font-semibold text-white">Referral Registered in D1</div>
                <div>Reference ID: <span className="font-mono">{submissionSuccess.id}</span></div>
                <div>Status: <span className="font-mono text-emerald-300">Negotiating Terms</span></div>
                <div>A confirmation receipt was dispatched via Zeptomail to {submissionSuccess.referrerEmail}.</div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Your Full Name (Partner)</label>
                <input
                  type="text"
                  value={formInput.referrerName}
                  onChange={(e) => setFormInput({ ...formInput, referrerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Brian Mutua"
                />
                {errors.referrerName && <p className="text-[11px] text-rose-400">{errors.referrerName}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Your Email Address</label>
                <input
                  type="email"
                  value={formInput.referrerEmail}
                  onChange={(e) => setFormInput({ ...formInput, referrerEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  placeholder="partner@gmail.com"
                />
                {errors.referrerEmail && <p className="text-[11px] text-rose-400">{errors.referrerEmail}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Your Phone Number</label>
                <input
                  type="tel"
                  value={formInput.referrerPhone}
                  onChange={(e) => setFormInput({ ...formInput, referrerPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  placeholder="07... or +254..."
                />
                {errors.referrerPhone && <p className="text-[11px] text-rose-400">{errors.referrerPhone}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Estimated Project Scale</label>
                <select
                  value={formInput.estimatedProjectSize}
                  onChange={(e) => setFormInput({ ...formInput, estimatedProjectSize: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="$2,500 - $5,000 (Micro SaaS or Cloudflare Migration)">$2,500 - $5,000 (Micro SaaS or Cloudflare Migration)</option>
                  <option value="$5,000 - $15,000 (Full-Stack Platform / Housika)">$5,000 - $15,000 (Full-Stack Platform / Housika)</option>
                  <option value="$15,000 - $30,000 (Enterprise Cloud Infrastructure)">$15,000 - $30,000 (Enterprise Cloud Infrastructure)</option>
                  <option value="$30,000+ (High-Scale Multi-Cloud Suite)">$30,000+ (High-Scale Multi-Cloud Suite)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Lead Contact Name</label>
                <input
                  type="text"
                  value={formInput.leadName}
                  onChange={(e) => setFormInput({ ...formInput, leadName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Jackson Mwangi"
                />
                {errors.leadName && <p className="text-[11px] text-rose-400">{errors.leadName}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Lead Organization / Company</label>
                <input
                  type="text"
                  value={formInput.leadCompany}
                  onChange={(e) => setFormInput({ ...formInput, leadCompany: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Kilimani Estates Portal"
                />
                {errors.leadCompany && <p className="text-[11px] text-rose-400">{errors.leadCompany}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Lead Email</label>
                <input
                  type="email"
                  value={formInput.leadEmail}
                  onChange={(e) => setFormInput({ ...formInput, leadEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  placeholder="director@company.com"
                />
                {errors.leadEmail && <p className="text-[11px] text-rose-400">{errors.leadEmail}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Lead Phone (Optional)</label>
                <input
                  type="tel"
                  value={formInput.leadPhone}
                  onChange={(e) => setFormInput({ ...formInput, leadPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  placeholder="+254..."
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Project Context or Special Notes</label>
              <textarea
                rows={3}
                value={formInput.notes}
                onChange={(e) => setFormInput({ ...formInput, notes: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
                placeholder="Describe what they need (e.g. they want a custom tenant rental portal like Housika)..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/25"
            >
              <Gift className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering Referral in D1...' : 'Register Referral & Lock Negotiated Reward'}</span>
            </button>
          </form>
        </div>

      </div>

      {/* 4. Live Referral Registry Table */}
      <div className="space-y-4 pt-6 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Active Partner Referral Pipeline</h3>
          <span className="text-xs text-slate-400 font-mono">Cloudflare D1 Table: referrals</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/30 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3">Referrer</th>
                <th className="px-5 py-3">Referred Lead</th>
                <th className="px-5 py-3">Estimated Scale</th>
                <th className="px-5 py-3">Negotiated Reward Terms</th>
                <th className="px-5 py-3">Deal Status</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {referrals.map((ref) => (
                <tr key={ref.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-white">{ref.referrerName}</div>
                    <div className="text-[11px] text-slate-400">{ref.referrerEmail}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-blue-400">{ref.leadCompany}</div>
                    <div className="text-[11px] text-slate-400">{ref.leadName}</div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-300">
                    {ref.estimatedProjectSize}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-emerald-400 font-mono">
                    {ref.negotiatedRewardRate}
                  </td>
                  <td className="px-5 py-3.5">
                    {ref.status === 'approved' && <span className="text-emerald-400 font-semibold">Approved</span>}
                    {ref.status === 'negotiating' && <span className="text-amber-400 font-semibold">Negotiating</span>}
                    {ref.status === 'converted' && <span className="text-blue-400 font-semibold">Contract Converted</span>}
                    {ref.status === 'paid' && <span className="text-purple-400 font-semibold">Reward Settled</span>}
                  </td>
                  <td className="px-5 py-3.5 text-[11px] text-slate-400 font-mono">
                    {new Date(ref.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
