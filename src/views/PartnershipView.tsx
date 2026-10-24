/**
 * Pansoft Technologies – Developer & Agency Partnership Hub
 * Allows developers and agencies to apply to work with CEO Movin Juma.
 * Supports Invite Codes, Referral integration, peak days freelance sprint allocations,
 * and automated Zeptomail & Cloudflare D1 integration.
 */
import React, { useState } from 'react';
import { 
  Users, Handshake, Code2, Sparkles, CheckCircle2, ShieldCheck, 
  ArrowRight, KeyRound, Briefcase, Cpu, Layers, DollarSign, Send, Ticket
} from 'lucide-react';
import { d1 } from '../lib/d1-client';
import { zeptomail } from '../lib/zeptomail-client';
import { BackendApiClient } from '../lib/api-client';
import { partnershipSchema, PartnershipInput } from '../lib/validation';
import { PartnershipRequest, User, InviteCode } from '../types';

interface PartnershipViewProps {
  currentUser?: User | null;
  onOpenAuth?: () => void;
}

export const PartnershipView: React.FC<PartnershipViewProps> = ({ currentUser, onOpenAuth }) => {
  const [formData, setFormData] = useState<PartnershipInput>({
    applicantName: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    partnerType: 'developer',
    companyOrHandle: '',
    portfolioOrGithub: '',
    skillsOrFocus: ['TypeScript / Node.js', 'Cloudflare Workers', 'M-Pesa & Pesapal Integrations'],
    collaborationProposal: '',
    compensationModel: 'contract_freelance',
    inviteCodeUsed: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApplication, setSubmittedApplication] = useState<PartnershipRequest | null>(null);

  // Invite code verification state
  const [inviteStatus, setInviteStatus] = useState<{
    checking: boolean;
    valid?: boolean;
    message?: string;
  }>({ checking: false });

  // Invite Generator Tool State
  const [generatedInvite, setGeneratedInvite] = useState<InviteCode | null>(null);
  const [isGeneratingInvite, setIsGeneratingInvite] = useState(false);

  const availableSkills = [
    'TypeScript & Node.js Backend',
    'Cloudflare Workers & D1 Edge',
    'M-Pesa Daraja 2.0 Webhooks',
    'Pesapal Payment Gateways',
    'Paystack Fintech & Escrow',
    'Gemini AI & Multimodal Workflows',
    'Automated Testing & SRE',
    'WhatsApp Business Cloud API',
    'Nuxt 3 / Vue / React Frontend',
    'Africa\'s Talking SMS & USSD',
  ];

  const toggleSkill = (skill: string) => {
    if (formData.skillsOrFocus.includes(skill)) {
      if (formData.skillsOrFocus.length > 1) {
        setFormData({
          ...formData,
          skillsOrFocus: formData.skillsOrFocus.filter(s => s !== skill),
        });
      }
    } else {
      setFormData({
        ...formData,
        skillsOrFocus: [...formData.skillsOrFocus, skill],
      });
    }
  };

  const handleVerifyInvite = async () => {
    if (!formData.inviteCodeUsed) return;
    setInviteStatus({ checking: true });
    try {
      const result = await BackendApiClient.verifyInviteCode(formData.inviteCodeUsed);
      setInviteStatus({
        checking: false,
        valid: result.valid,
        message: result.message,
      });
    } catch {
      setInviteStatus({
        checking: false,
        valid: false,
        message: 'Unable to verify invite code at this time.',
      });
    }
  };

  const handleGenerateInvite = async () => {
    setIsGeneratingInvite(true);
    try {
      const code = await BackendApiClient.generateInviteCode(
        'partner',
        currentUser?.name || 'Movin Juma',
        currentUser?.email || 'movin@pansoft.tech',
        15
      );
      setGeneratedInvite(code);
    } catch (err) {
      console.error(err);
      alert('Failed to generate invite code.');
    } finally {
      setIsGeneratingInvite(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = partnershipSchema.safeParse(formData);
    if (!result.success) {
      const errMap: Record<string, string> = {};
      result.error.issues.forEach(err => {
        if (err.path[0]) errMap[err.path[0] as string] = err.message;
      });
      setErrors(errMap);
      return;
    }

    setIsSubmitting(true);
    try {
      const partnership = await BackendApiClient.createPartnership({
        applicantName: formData.applicantName,
        email: formData.email,
        phone: formData.phone,
        partnerType: formData.partnerType,
        companyOrHandle: formData.companyOrHandle,
        portfolioOrGithub: formData.portfolioOrGithub,
        skillsOrFocus: formData.skillsOrFocus,
        collaborationProposal: formData.collaborationProposal,
        compensationModel: formData.compensationModel,
        inviteCodeUsed: formData.inviteCodeUsed,
      });

      // Dispatch Zeptomail confirmation to applicant
      zeptomail.sendTransactionalEmail({
        toEmail: formData.email,
        toName: formData.applicantName,
        subject: `Partnership Application Confirmed – Pansoft Technologies (BN-36S5WLAP)`,
        templateType: 'welcome',
        variables: {
          role: formData.partnerType.toUpperCase(),
        },
      });

      setSubmittedApplication(partnership);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to submit partnership request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-16">
      
      {/* 1. Hero Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
          <Handshake className="w-4 h-4" />
          <span>Ecosystem & Talent Network</span>
          <span aria-hidden="true">·</span>
          <span>Open Engineering Partnerships</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
          Work & Partner With Movin Juma
        </h1>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Are you a talented software engineer, fintech developer, or agency looking to co-build high-impact systems? 
          At <strong>Pansoft Technologies</strong>, we actively onboard skilled developers to subcontract on peak client delivery days, enhance our in-house SaaS platforms (like <em>Housika</em>), and build complex payment and cloud integrations. 
          <strong>We pay our partners on time as per negotiated agreement.</strong>
        </p>
      </div>

      {/* 2. Success Banner */}
      {submittedApplication && (
        <div className="p-8 rounded-2xl border border-emerald-500/50 bg-emerald-950/40 space-y-4 animate-in fade-in">
          <div className="flex items-center gap-3 text-emerald-400">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <h2 className="text-xl font-bold text-white">Partnership Application Dispatched & Recorded</h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            Thank you, <strong className="text-white">{submittedApplication.applicantName}</strong>. 
            Your collaboration proposal for track <strong className="text-emerald-300">{submittedApplication.partnerType.toUpperCase()}</strong> (ID: <code className="text-white font-mono">{submittedApplication.id}</code>) has been submitted into our D1 partnership registry. 
            CEO Movin Juma and our technical operations desk will review your repository and proposal.
          </p>
          <div className="pt-2 flex items-center gap-4 text-xs text-slate-400 font-mono">
            <span>Notice dispatched via Zeptomail</span>
            <span>·</span>
            <span>Ref: {submittedApplication.id}</span>
          </div>
        </div>
      )}

      {/* 3. Three Partnership Tracks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3 relative group hover:border-slate-700 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800/80 flex items-center justify-center text-blue-400">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Developer Peak-Days Subcontracting</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Join our core bench for surge days. Subcontract on Node.js/TS architectures, Cloudflare Workers, and database optimization. Paid promptly upon milestone review.
          </p>
          <div className="text-[11px] text-blue-400 font-mono font-semibold">Compensation: Hourly or Milestone Payouts</div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3 relative group hover:border-slate-700 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Fintech & Payment Specialists</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Collaborate on East African payments: M-Pesa Daraja 2.0 (STK Push), Pesapal gateways, Paystack webhooks, and multi-currency settlement engines.
          </p>
          <div className="text-[11px] text-emerald-400 font-mono font-semibold">Compensation: Negotiated Integration Fee</div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3 relative group hover:border-slate-700 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800/80 flex items-center justify-center text-purple-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Agency & System Integrators</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Co-pitch enterprise clients with Pansoft. We provide high-throughput edge backends, automated test suites, and SRE maintenance for your client projects.
          </p>
          <div className="text-[11px] text-purple-400 font-mono font-semibold">Compensation: Revenue Share & Retainers</div>
        </div>

      </div>

      {/* 4. Partnership Application Form */}
      <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-8">
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Partnership Application Form</h2>
            <p className="text-xs text-slate-400">Directly reviewed by CEO Movin Juma and technical operations.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Guaranteed on-time payment terms</span>
          </div>
        </div>

        {/* Basic Applicant Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">Your Full Name <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={formData.applicantName}
              onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
              placeholder="e.g., Alex Kiprono"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
            {errors.applicantName && <p className="text-[11px] text-red-400">{errors.applicantName}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">Email Address <span className="text-red-400">*</span></label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="alex@devcloud.io"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
            {errors.email && <p className="text-[11px] text-red-400">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">Phone / WhatsApp Number <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+254 711 000 000"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
            {errors.phone && <p className="text-[11px] text-red-400">{errors.phone}</p>}
          </div>

        </div>

        {/* Track and Online Presence */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">Partnership Type</label>
            <select
              value={formData.partnerType}
              onChange={(e) => setFormData({ ...formData, partnerType: e.target.value as any })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="developer">Developer (Subcontractor / Peak Days)</option>
              <option value="agency">Agency / Technology Partner</option>
              <option value="affiliate_promoter">Affiliate & Regional Promoter</option>
              <option value="enterprise_collaborator">Enterprise Software Collaborator</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">GitHub Profile / Portfolio Link</label>
            <input
              type="text"
              value={formData.portfolioOrGithub || ''}
              onChange={(e) => setFormData({ ...formData, portfolioOrGithub: e.target.value })}
              placeholder="https://github.com/username"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">Preferred Compensation Model</label>
            <select
              value={formData.compensationModel}
              onChange={(e) => setFormData({ ...formData, compensationModel: e.target.value as any })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="contract_freelance">Milestone / Hourly Contract (Guaranteed On-Time)</option>
              <option value="revenue_share">Revenue Share on Enterprise Engagements</option>
              <option value="referral_commission">Negotiated Referral Commission Split</option>
              <option value="negotiated_split">Custom Negotiated Partnership Split</option>
            </select>
          </div>

        </div>

        {/* Skills Selector */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-300">Your Technical Focus & Core Skills</label>
          <div className="flex flex-wrap gap-2">
            {availableSkills.map((skill) => {
              const active = formData.skillsOrFocus.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                    active
                      ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/30 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>
          {errors.skillsOrFocus && <p className="text-[11px] text-red-400">{errors.skillsOrFocus}</p>}
        </div>

        {/* Collaboration Proposal */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-300">
            Tell Us How You Want to Collaborate With Movin Juma & Pansoft <span className="text-red-400">*</span>
          </label>
          <textarea
            rows={4}
            value={formData.collaborationProposal}
            onChange={(e) => setFormData({ ...formData, collaborationProposal: e.target.value })}
            placeholder="Describe your engineering background, your availability (e.g. weekends, 10 hrs/week, or full-time sprints), and past payment/cloud systems you've built."
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
          />
          {errors.collaborationProposal && <p className="text-[11px] text-red-400">{errors.collaborationProposal}</p>}
        </div>

        {/* Invite Code Verification Field */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 max-w-lg">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Ticket className="w-4 h-4 text-blue-400" />
            <span>Have an Invite Code? (Optional)</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.inviteCodeUsed || ''}
              onChange={(e) => {
                setFormData({ ...formData, inviteCodeUsed: e.target.value });
                setInviteStatus({});
              }}
              placeholder="e.g. PANSOFT-DEV-PEAK or PANSOFT-EA-2026"
              className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono uppercase placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleVerifyInvite}
              disabled={inviteStatus.checking || !formData.inviteCodeUsed}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
            >
              {inviteStatus.checking ? 'Checking...' : 'Verify'}
            </button>
          </div>
          {inviteStatus.message && (
            <p className={`text-[11px] ${inviteStatus.valid ? 'text-emerald-400' : 'text-red-400'}`}>
              {inviteStatus.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            Registered: <strong className="text-slate-200">BN-36S5WLAP</strong> · Contact: <strong className="text-slate-200">0141380666</strong>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30"
          >
            {isSubmitting ? (
              <span>Submitting to D1 Database...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Partnership Application</span>
              </>
            )}
          </button>
        </div>

      </form>

      {/* 5. Invite Code Generator Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/30 to-purple-950/30 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
            <Ticket className="w-4 h-4" />
            <span>Pansoft Partner & Colleague Invite Generator</span>
          </div>
          <h3 className="text-base font-bold text-white">Invite Other Developers to the Network</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Generate an exclusive invite code for trusted software engineers, code reviewers, and agencies. 
            Applicants using your invite code are fast-tracked for active sprint allocation.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          {generatedInvite ? (
            <div className="p-3 rounded-xl bg-slate-900 border border-blue-500/50 flex items-center gap-3">
              <div>
                <div className="text-[10px] text-slate-400">Your Shareable Invite Code:</div>
                <div className="font-mono font-bold text-blue-400 text-sm">{generatedInvite.code}</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(generatedInvite.code);
                  alert(`Copied ${generatedInvite.code} to clipboard!`);
                }}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
              >
                Copy
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleGenerateInvite}
              disabled={isGeneratingInvite}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2"
            >
              <Ticket className="w-4 h-4 text-blue-400" />
              <span>{isGeneratingInvite ? 'Generating...' : 'Generate Invite Code'}</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
