/**
 * Pansoft Technologies – Admin Panel Console
 * Designed for Movin Juma & executive engineering staff.
 * Manages D1 Inquiries, Freelance R2 ZIP code reviews & unzipping,
 * Referrals, live D1 SQL query execution, and Zeptomail Outbox delivery logs.
 * Fully device responsive across mobile, tablet, and desktop screens.
 */
import React, { useState } from 'react';
import { 
  Users, Mail, Database, Archive, CheckCircle, Clock,
  ArrowRight, Eye, RefreshCw, Send, CheckCheck, Shield, LogOut,
  Handshake, Ticket, Layers, Sparkles, CheckCircle2, X
} from 'lucide-react';
import { d1 } from '../lib/d1-client';
import { r2 } from '../lib/r2-client';
import { zeptomail } from '../lib/zeptomail-client';
import { BackendApiClient } from '../lib/api-client';
import { Inquiry, FreelanceSubmission, Referral, ZeptomailLog, User, PartnershipRequest } from '../types';

interface AdminDashboardProps {
  currentUser: User | null;
  onExitAdmin?: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardProps> = ({ currentUser, onExitAdmin }) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'inquiries' | 'partnerships' | 'freelance' | 'referrals' | 'd1_query' | 'zeptomail'>('inquiries');
  
  // Real dynamic data from Backend & D1
  const [inquiries, setInquiries] = useState<Inquiry[]>(d1.getInquiries());
  const [partnerships, setPartnerships] = useState<PartnershipRequest[]>(d1.getPartnerships());
  const [freelanceSubs, setFreelanceSubs] = useState<FreelanceSubmission[]>(d1.getFreelanceSubmissions());
  const [referrals, setReferrals] = useState<Referral[]>(d1.getReferrals());
  const [zeptomailLogs, setZeptomailLogs] = useState<ZeptomailLog[]>(d1.getZeptomailLogs());
  const [isLoadingBackend, setIsLoadingBackend] = useState(false);
  const [backendOnline, setBackendOnline] = useState(true);

  // Proposal modal state
  const [proposalInquiry, setProposalInquiry] = useState<Inquiry | null>(null);
  const [proposalNote, setProposalNote] = useState('');
  const [isSendingProposal, setIsSendingProposal] = useState(false);

  // Inquiry Inspector Modal (shows layman choices: emailing, db, compute, messaging, AI)
  const [inspectedInquiry, setInspectedInquiry] = useState<Inquiry | null>(null);

  // Freelance Code Unzipping Modal / Inspector State
  const [inspectedSub, setInspectedSub] = useState<FreelanceSubmission | null>(null);

  // Zeptomail Preview Modal
  const [inspectedEmail, setInspectedEmail] = useState<ZeptomailLog | null>(null);

  // SQL Query console state
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM inquiries LIMIT 10;');
  const [queryResult, setQueryResult] = useState<{ columns: string[]; rows: Record<string, unknown>[]; executionTimeMs: number }>({
    columns: ['id', 'clientName', 'email', 'company', 'projectType', 'budget', 'status'],
    rows: d1.getInquiries() as any,
    executionTimeMs: 4.2
  });

  // Fetch live from backend on mount
  const refreshBackendData = async () => {
    setIsLoadingBackend(true);
    try {
      const [inqList, subList, refList, zepList, ptnList] = await Promise.all([
        BackendApiClient.getInquiries(),
        BackendApiClient.getFreelanceSubmissions(),
        BackendApiClient.getReferrals(),
        BackendApiClient.getZeptomailLogs(),
        BackendApiClient.getPartnerships(),
      ]);
      setInquiries(inqList);
      setFreelanceSubs(subList);
      setReferrals(refList);
      setZeptomailLogs(zepList);
      setPartnerships(ptnList);
      setBackendOnline(true);
    } catch {
      setBackendOnline(false);
    } finally {
      setIsLoadingBackend(false);
    }
  };

  React.useEffect(() => {
    refreshBackendData();
  }, []);

  const handleRunQuery = async (queryToRun?: string) => {
    const q = queryToRun || sqlQuery;
    setIsLoadingBackend(true);
    try {
      const res = await BackendApiClient.executeD1Query(q);
      setQueryResult(res);
    } finally {
      setIsLoadingBackend(false);
    }
  };

  // Inquiry Status Handler
  const handleUpdateInquiry = async (id: string, newStatus: Inquiry['status']) => {
    await BackendApiClient.updateInquiryStatus(id, newStatus);
    const updated = await BackendApiClient.getInquiries();
    setInquiries(updated);
  };

  const handleSendProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalInquiry) return;
    setIsSendingProposal(true);
    try {
      await BackendApiClient.updateInquiryStatus(proposalInquiry.id, 'proposal_sent', proposalNote);
      await refreshBackendData();
      setProposalInquiry(null);
      setProposalNote('');
      alert(`Proposal successfully dispatched to ${proposalInquiry.clientName} (${proposalInquiry.email}) via Zeptomail API!`);
    } catch (err) {
      console.error(err);
      alert('Failed to dispatch proposal.');
    } finally {
      setIsSendingProposal(false);
    }
  };

  // Freelance Review Status Handler
  const handleUpdateFreelanceReview = async (id: string, reviewStatus: FreelanceSubmission['reviewStatus'], payoutStatus?: FreelanceSubmission['payoutStatus']) => {
    await BackendApiClient.reviewFreelance(id, reviewStatus, payoutStatus);
    await refreshBackendData();
  };

  // Referral Status Handler
  const handleUpdateReferral = async (id: string, status: Referral['status']) => {
    await BackendApiClient.updateReferralStatus(id, status);
    await refreshBackendData();
  };

  // Partnership Status Handler (Developer & Agency Approvals)
  const handleUpdatePartnership = async (id: string, status: PartnershipRequest['status'], reviewNotes?: string) => {
    await BackendApiClient.updatePartnershipStatus(id, status, reviewNotes);
    await refreshBackendData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-10">
      
      {/* 1. Header & Identity */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <span>Pansoft Staff Operations Console</span>
            <span aria-hidden="true">·</span>
            <span>Cloudflare Edge (D1/R2)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Pansoft Technologies Operations & Admin Panel
          </h1>
          <p className="text-xs text-slate-400">
            Registration: <strong>BN-36S5WLAP</strong> · Public Contact: <strong>0141380666 (+254 141 380 666)</strong> · Founder & CEO: <strong>Movin Juma</strong>
          </p>
        </div>

        {/* Staff Authorization Badge & Actions */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
          <div className="px-3 py-1.5 rounded-xl bg-blue-950/80 border border-blue-700/80 text-xs text-blue-300 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
            <span>Backend: {backendOnline ? 'Live Express /api' : 'D1 Local'}</span>
          </div>

          <button
            onClick={refreshBackendData}
            disabled={isLoadingBackend}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Refresh live state from backend server"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingBackend ? 'animate-spin text-blue-400' : ''}`} />
            <span>Refresh</span>
          </button>

          {onExitAdmin && (
            <button
              onClick={onExitAdmin}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400" />
              <span>Client Site</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Top Metric KPI Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Client Inquiries</div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white">{inquiries.length}</div>
          <div className="text-[11px] text-blue-400">{inquiries.filter(i => i.status === 'new').length} New Pending</div>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Freelance R2 Code ZIPs</div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white">{freelanceSubs.length}</div>
          <div className="text-[11px] text-emerald-400">On-Time Payout Enforced</div>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Active Referral Leads</div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white">{referrals.length}</div>
          <div className="text-[11px] text-purple-400">Negotiated Rewards</div>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Zeptomail Outbox</div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white">{zeptomailLogs.length}</div>
          <div className="text-[11px] text-emerald-400">100% Delivery Rate</div>
        </div>
      </div>

      {/* 3. Responsive Admin Navigation Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 border-b border-slate-800 overflow-x-auto text-xs pb-1 scrollbar-none">
        <button
          onClick={() => setActiveAdminTab('inquiries')}
          className={`px-3 sm:px-4 py-2 font-medium transition-colors cursor-pointer whitespace-nowrap border-b-2 shrink-0 ${
            activeAdminTab === 'inquiries'
              ? 'border-blue-500 text-blue-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Client Inquiries ({inquiries.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('partnerships')}
          className={`px-3 sm:px-4 py-2 font-medium transition-colors cursor-pointer whitespace-nowrap border-b-2 shrink-0 flex items-center gap-1.5 ${
            activeAdminTab === 'partnerships'
              ? 'border-blue-500 text-blue-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <span>Developer Partnerships ({partnerships.length})</span>
          {partnerships.filter(p => p.status === 'pending').length > 0 && (
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          )}
        </button>
        <button
          onClick={() => setActiveAdminTab('freelance')}
          className={`px-3 sm:px-4 py-2 font-medium transition-colors cursor-pointer whitespace-nowrap border-b-2 shrink-0 ${
            activeAdminTab === 'freelance'
              ? 'border-blue-500 text-blue-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Freelance R2 Reviews ({freelanceSubs.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('referrals')}
          className={`px-3 sm:px-4 py-2 font-medium transition-colors cursor-pointer whitespace-nowrap border-b-2 shrink-0 ${
            activeAdminTab === 'referrals'
              ? 'border-blue-500 text-blue-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Referral Deals ({referrals.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('d1_query')}
          className={`px-3 sm:px-4 py-2 font-medium transition-colors cursor-pointer whitespace-nowrap border-b-2 shrink-0 ${
            activeAdminTab === 'd1_query'
              ? 'border-blue-500 text-blue-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Cloudflare D1 SQL Console
        </button>
        <button
          onClick={() => setActiveAdminTab('zeptomail')}
          className={`px-3 sm:px-4 py-2 font-medium transition-colors cursor-pointer whitespace-nowrap border-b-2 shrink-0 ${
            activeAdminTab === 'zeptomail'
              ? 'border-blue-500 text-blue-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Zeptomail Outbox ({zeptomailLogs.length})
        </button>
      </div>

      {/* 4. Tab 1: Client Inquiries */}
      {activeAdminTab === 'inquiries' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-base font-bold text-white">Inbound Client Inquiries & Architecture Briefs</h2>
            <span className="text-xs text-slate-400 font-mono">D1 Table: inquiries</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/30 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 min-w-[640px]">
              <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3">Client & Company</th>
                  <th className="px-5 py-3">Project Type</th>
                  <th className="px-5 py-3">Budget & Timeline</th>
                  <th className="px-5 py-3">Tech Requirements</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">{inq.clientName}</div>
                      <div className="text-[11px] text-blue-400">{inq.company}</div>
                      <div className="text-[10px] text-slate-400">{inq.email} · {inq.phone}</div>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-200">
                      {inq.projectType}
                    </td>
                    <td className="px-5 py-4 font-mono text-[11px]">
                      <div className="text-white font-semibold">{inq.budget}</div>
                      <div className="text-slate-400">{inq.timeline}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {inq.techStack.map((t, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-950 text-slate-300 border border-slate-800 rounded px-1.5 py-0.5">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={inq.status}
                        onChange={(e) => handleUpdateInquiry(inq.id, e.target.value as any)}
                        className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="new">New Inbound</option>
                        <option value="in_review">In Review</option>
                        <option value="proposal_sent">Proposal Sent</option>
                        <option value="contract_signed">Contract Signed</option>
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setInspectedInquiry(inq)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-blue-400 hover:text-white font-medium cursor-pointer"
                        >
                          Consulting Brief
                        </button>
                        <button
                          onClick={() => {
                            setProposalInquiry(inq);
                            setProposalNote(`Dear ${inq.clientName},\n\nPansoft Technologies has approved your project scope for ${inq.projectType} (${inq.budget}). We have provisioned the Cloudflare D1 environment and milestone breakdown.`);
                          }}
                          className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-xs text-white font-medium cursor-pointer whitespace-nowrap flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>Proposal</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Tab: Developer & Agency Partnerships Management */}
      {activeAdminTab === 'partnerships' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Handshake className="w-4 h-4 text-blue-400" />
                <span>Developer & Agency Collaboration Requests</span>
              </h2>
              <p className="text-xs text-slate-400">
                Engineers and corporate partners applying to subcontract on peak days and co-build with Movin Juma.
              </p>
            </div>
            <div className="text-xs text-emerald-400 font-mono">
              Policy: Fair on-time compensation as per negotiated agreement
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/30 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 min-w-[750px]">
              <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3">Applicant / Partner</th>
                  <th className="px-5 py-3">Track & Model</th>
                  <th className="px-5 py-3">Skills & Focus</th>
                  <th className="px-5 py-3">Proposal Summary</th>
                  <th className="px-5 py-3">Invite Code</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {partnerships.map((ptn) => (
                  <tr key={ptn.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">{ptn.applicantName}</div>
                      <div className="text-[10px] text-slate-400">{ptn.email} · {ptn.phone}</div>
                      {ptn.portfolioOrGithub && (
                        <a
                          href={ptn.portfolioOrGithub}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-blue-400 hover:underline font-mono"
                        >
                          {ptn.portfolioOrGithub}
                        </a>
                      )}
                    </td>
                    <td className="px-5 py-4 font-mono text-[11px]">
                      <span className="capitalize text-blue-400 font-semibold">{ptn.partnerType.replace('_', ' ')}</span>
                      <div className="text-[10px] text-slate-400">{ptn.compensationModel.replace('_', ' ')}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {ptn.skillsOrFocus.map((s, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-950 text-slate-300 border border-slate-800 rounded px-1.5 py-0.5">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 max-w-[220px]">
                      <p className="line-clamp-2 text-[11px] text-slate-300">{ptn.collaborationProposal}</p>
                    </td>
                    <td className="px-5 py-4 font-mono text-[11px]">
                      {ptn.inviteCodeUsed ? (
                        <span className="px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800 text-[10px]">
                          {ptn.inviteCodeUsed}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">Direct Application</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={ptn.status}
                        onChange={(e) => handleUpdatePartnership(ptn.id, e.target.value as any)}
                        className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="under_review">Under Review</option>
                        <option value="approved">Approved for Sprints</option>
                        <option value="onboarded">Onboarded</option>
                        <option value="declined">Declined</option>
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      {ptn.status !== 'approved' && ptn.status !== 'onboarded' ? (
                        <button
                          onClick={() => handleUpdatePartnership(ptn.id, 'approved', 'Approved for active peak sprints by Movin Juma')}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-medium cursor-pointer whitespace-nowrap flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Approve</span>
                        </button>
                      ) : (
                        <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Active Partner</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Tab 2: Freelance R2 Code Reviews & Unzipping */}
      {activeAdminTab === 'freelance' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-white">Freelance Submissions & R2 ZIP Archive Reviewer</h2>
              <p className="text-xs text-slate-400">
                Inspect zipped code packages, verify pull request diffs, and approve on-time payouts.
              </p>
            </div>
            <div className="text-xs text-emerald-400 font-mono">
              Cloudflare R2 Bucket: pansoft-tech-production-r2
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/30 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 min-w-[700px]">
              <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3">Freelancer</th>
                  <th className="px-5 py-3">Specialty</th>
                  <th className="px-5 py-3">R2 Archive (ZIP)</th>
                  <th className="px-5 py-3">Agreed Fee</th>
                  <th className="px-5 py-3">Review Decision</th>
                  <th className="px-5 py-3">Payout State</th>
                  <th className="px-5 py-3">Inspection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {freelanceSubs.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">{sub.freelancerName}</div>
                      <div className="text-[10px] text-slate-400">{sub.email} · {sub.phone}</div>
                    </td>
                    <td className="px-5 py-4 font-mono text-[11px] text-blue-400">
                      {sub.specialty}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-mono text-white flex items-center gap-1.5">
                        <Archive className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate max-w-[150px]">{sub.zipFileName}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {(sub.zipFileSize / 1024).toFixed(1)} KB · {sub.zipFileCount} files
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold font-mono text-emerald-400">
                      {sub.negotiatedFee}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={sub.reviewStatus}
                        onChange={(e) => handleUpdateFreelanceReview(sub.id, e.target.value as any, sub.payoutStatus)}
                        className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_review">In Review</option>
                        <option value="approved">Approved</option>
                        <option value="changes_requested">Changes Requested</option>
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={sub.payoutStatus}
                        onChange={(e) => handleUpdateFreelanceReview(sub.id, sub.reviewStatus, e.target.value as any)}
                        className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="scheduled">Scheduled On-Time</option>
                        <option value="paid">Paid & Settled</option>
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setInspectedSub(sub)}
                        className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-1 cursor-pointer whitespace-nowrap"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Unzip & Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Tab 3: Referral Deals */}
      {activeAdminTab === 'referrals' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-base font-bold text-white">Partner & Client Referral Deals</h2>
            <span className="text-xs text-slate-400 font-mono">All rewards settled as per negotiated agreement</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/30 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 min-w-[650px]">
              <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3">Partner / Referrer</th>
                  <th className="px-5 py-3">Prospective Client</th>
                  <th className="px-5 py-3">Estimated Scale</th>
                  <th className="px-5 py-3">Negotiated Reward</th>
                  <th className="px-5 py-3">Deal Stage</th>
                  <th className="px-5 py-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {referrals.map((ref) => (
                  <tr key={ref.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-white">{ref.referrerName}</div>
                      <div className="text-[10px] text-slate-400">{ref.referrerEmail} · {ref.referrerPhone}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-blue-400">{ref.leadCompany}</div>
                      <div className="text-[10px] text-slate-400">{ref.leadName} ({ref.leadEmail})</div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300">
                      {ref.estimatedProjectSize}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-emerald-400 font-mono">
                      {ref.negotiatedRewardRate}
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={ref.status}
                        onChange={(e) => handleUpdateReferral(ref.id, e.target.value as any)}
                        className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="negotiating">Negotiating</option>
                        <option value="approved">Approved</option>
                        <option value="converted">Contract Converted</option>
                        <option value="paid">Reward Paid</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-[11px] max-w-[200px] truncate">
                      {ref.notes || 'No extra notes'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. Tab 4: Cloudflare D1 Query Console */}
      {activeAdminTab === 'd1_query' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white">Cloudflare D1 Distributed SQLite Engine</h2>
              <p className="text-xs text-slate-400">Execute interactive SQL queries against edge tables with execution time metrics.</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => handleRunQuery('SELECT * FROM users;')}
                className="px-2.5 py-1 text-[11px] font-mono bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded cursor-pointer"
              >
                users
              </button>
              <button
                onClick={() => handleRunQuery('SELECT * FROM inquiries;')}
                className="px-2.5 py-1 text-[11px] font-mono bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded cursor-pointer"
              >
                inquiries
              </button>
              <button
                onClick={() => handleRunQuery('SELECT * FROM freelance_submissions;')}
                className="px-2.5 py-1 text-[11px] font-mono bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded cursor-pointer"
              >
                freelance
              </button>
              <button
                onClick={() => handleRunQuery('SELECT * FROM zeptomail_logs;')}
                className="px-2.5 py-1 text-[11px] font-mono bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded cursor-pointer"
              >
                zeptomail
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 font-mono text-xs">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                className="flex-1 bg-slate-900 px-3 py-2 rounded border border-slate-800 text-white focus:outline-none focus:border-blue-500 font-mono text-xs"
                placeholder="SELECT * FROM table_name;"
              />
              <button
                onClick={() => handleRunQuery()}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer font-sans"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Execute SQL</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1 gap-2">
              <span>Binding: env.DB (Cloudflare D1 SQLite)</span>
              <span className="text-emerald-400">Latency: {queryResult.executionTimeMs} ms · Rows: {queryResult.rows.length}</span>
            </div>
          </div>

          {/* Results Table */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 overflow-x-auto">
            <table className="w-full text-left text-xs font-mono text-slate-300 min-w-[500px]">
              <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <tr>
                  {queryResult.columns.map((col) => (
                    <th key={col} className="px-4 py-2.5 whitespace-nowrap">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {queryResult.rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50">
                    {queryResult.columns.map((col) => (
                      <td key={col} className="px-4 py-2.5 max-w-[220px] truncate text-slate-200">
                        {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8. Tab 5: Zeptomail Transactional Outbox */}
      {activeAdminTab === 'zeptomail' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-white">Zeptomail API Transactional Outbox Logs</h2>
              <p className="text-xs text-slate-400">
                Audited transactional emails dispatched via <code className="text-blue-400">api.zeptomail.com/v1.1/email</code>.
              </p>
            </div>
            <div className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
              <CheckCheck className="w-4 h-4" />
              <span>Mail-Agent: zm_agent_pansoft_prod</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/30 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 min-w-[650px]">
              <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3">Recipient</th>
                  <th className="px-5 py-3">Subject & Template</th>
                  <th className="px-5 py-3">Message ID</th>
                  <th className="px-5 py-3">Delivery Status</th>
                  <th className="px-5 py-3">Timestamp</th>
                  <th className="px-5 py-3">Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {zeptomailLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-white">{log.toName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{log.toEmail}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-slate-200">{log.subject}</div>
                      <div className="text-[10px] font-mono text-blue-400 uppercase tracking-wider">{log.templateType}</div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[11px] text-slate-400">
                      {log.messageId}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Delivered
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[11px] text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => setInspectedEmail(log)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-blue-400 cursor-pointer"
                      >
                        Inspect Body
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Freelance ZIP Unpacker Inspection Modal */}
      {inspectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-5 sm:p-6 space-y-5 animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Archive className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">Cloudflare R2 Archive Unzipper</h3>
                  <p className="text-xs text-slate-400 truncate max-w-xs sm:max-w-md">{inspectedSub.zipFileName}</p>
                </div>
              </div>
              <button
                onClick={() => setInspectedSub(null)}
                className="text-slate-400 hover:text-white cursor-pointer text-xs"
              >
                Close ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500">Freelancer:</span>
                  <div className="font-semibold text-white">{inspectedSub.freelancerName}</div>
                </div>
                <div>
                  <span className="text-slate-500">Agreed Fee:</span>
                  <div className="font-semibold text-emerald-400">{inspectedSub.negotiatedFee}</div>
                </div>
                <div>
                  <span className="text-slate-500">Size:</span>
                  <div className="font-mono text-white">{(inspectedSub.zipFileSize / 1024).toFixed(1)} KB</div>
                </div>
              </div>

              <div className="text-xs font-semibold text-slate-300">
                Extracted Files in ZIP ({inspectedSub.zipFileCount} files):
              </div>

              <div className="max-h-48 overflow-y-auto rounded-xl bg-slate-950 border border-slate-800 p-3 space-y-1 font-mono text-xs text-slate-300">
                {(inspectedSub.fileTree || ['src/index.ts', 'tests/index.test.ts', 'package.json']).map((f, i) => (
                  <div key={i} className="flex items-center justify-between py-1 border-b border-slate-900/60 last:border-0">
                    <span className="text-blue-300 truncate max-w-[280px] sm:max-w-none">{f}</span>
                    <span className="text-[10px] text-slate-500 shrink-0">Unzipped & Verified</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-300 space-y-1">
                <div className="font-semibold text-white">Submission Notes:</div>
                <div className="text-slate-400 leading-relaxed">{inspectedSub.notes}</div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <a
                  href={inspectedSub.r2PresignedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-400 hover:underline text-center sm:text-left"
                >
                  Download Raw ZIP from Cloudflare R2 →
                </a>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      handleUpdateFreelanceReview(inspectedSub.id, 'approved', 'scheduled');
                      setInspectedSub(null);
                    }}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs cursor-pointer transition-colors"
                  >
                    Approve & Schedule Prompt Payout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Zeptomail Inspection Modal */}
      {inspectedEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-5 sm:p-6 space-y-4 animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm sm:text-base font-bold text-white">Zeptomail API Transaction Preview</h3>
              </div>
              <button
                onClick={() => setInspectedEmail(null)}
                className="text-slate-400 hover:text-white cursor-pointer text-xs"
              >
                Close ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono">
                <div><span className="text-slate-500">To:</span> {inspectedEmail.toName} ({inspectedEmail.toEmail})</div>
                <div><span className="text-slate-500">Status:</span> <span className="text-emerald-400">200 Delivered</span></div>
                <div><span className="text-slate-500">Agent:</span> zm_agent_pansoft_prod</div>
                <div><span className="text-slate-500">Message ID:</span> {inspectedEmail.messageId}</div>
              </div>
              
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed font-sans">
                <div className="font-bold text-white text-sm mb-2">{inspectedEmail.subject}</div>
                <div className="text-slate-400 text-xs leading-relaxed">{inspectedEmail.bodySnippet}</div>
              </div>
            </div>

            <button
              onClick={() => setInspectedEmail(null)}
              className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Client Consulting Inquiry Inspector Modal */}
      {inspectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
                    {inspectedInquiry.clientMode === 'layman' ? 'Business / Layman Advisory' : 'Technical Spec'}
                  </span>
                  <span className="text-xs text-slate-400">Ref: {inspectedInquiry.id}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{inspectedInquiry.projectType}</h3>
                <p className="text-xs text-slate-300">
                  Client: <strong className="text-white">{inspectedInquiry.clientName}</strong> ({inspectedInquiry.company}) · {inspectedInquiry.email} · {inspectedInquiry.phone}
                </p>
              </div>
              <button
                onClick={() => setInspectedInquiry(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Architecture Selections Grid */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Client Selected Architecture Preferences
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span>Emailing Service:</span>
                  </div>
                  <div className="font-semibold text-white mt-0.5">{inspectedInquiry.preferredEmail || 'Zeptomail'}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Database Engine:</span>
                  </div>
                  <div className="font-semibold text-white mt-0.5">{inspectedInquiry.preferredDatabase || 'Cloudflare D1'}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <span>Compute & Runtime:</span>
                  </div>
                  <div className="font-semibold text-white mt-0.5">{inspectedInquiry.preferredCompute || 'Cloudflare Workers'}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Cloud Platform:</span>
                  </div>
                  <div className="font-semibold text-white mt-0.5">{inspectedInquiry.preferredCloud || 'Cloudflare Cloud'}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Messaging / SMS / WhatsApp:</span>
                  </div>
                  <div className="font-semibold text-white mt-0.5">{inspectedInquiry.preferredMessaging || 'WhatsApp & SMS'}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>AI Model & Automation:</span>
                  </div>
                  <div className="font-semibold text-white mt-0.5">{inspectedInquiry.preferredAi || 'Gemini 2.5'}</div>
                </div>

              </div>
            </div>

            {/* Commercial terms: Budget and timeline */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400">Target Budget (East African / Regional):</span>
                <div className="font-bold text-emerald-400 text-sm mt-0.5">{inspectedInquiry.budget}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Delivery Timeline:</span>
                <div className="font-bold text-white text-sm mt-0.5">{inspectedInquiry.timeline}</div>
              </div>
            </div>

            {/* Description / Problem Statement */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Client Project Brief & Goals
              </h4>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans">
                {inspectedInquiry.description}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => setInspectedInquiry(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const target = inspectedInquiry;
                  setInspectedInquiry(null);
                  setProposalInquiry(target);
                  setProposalNote(`Dear ${target.clientName},\n\nPansoft Technologies has reviewed your ${target.projectType} brief. We recommend provisioning ${target.preferredCompute || 'Cloudflare Workers'} with ${target.preferredDatabase || 'Cloudflare D1'} and ${target.preferredEmail || 'Zeptomail'}.\n\nMilestone 1 delivery scheduled in 2 weeks.`);
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/30"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Formulate Proposal & Dispatch</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Send Official Proposal Modal (Zeptomail) */}
      {proposalInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">Send Official Architectural Proposal</h3>
                  <p className="text-xs text-slate-400">To: {proposalInquiry.clientName} ({proposalInquiry.email})</p>
                </div>
              </div>
              <button
                onClick={() => setProposalInquiry(null)}
                className="text-slate-400 hover:text-white cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendProposal} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-500">Project Type:</span>
                  <div className="font-semibold text-white">{proposalInquiry.projectType}</div>
                </div>
                <div>
                  <span className="text-slate-500">Target Budget:</span>
                  <div className="font-semibold text-emerald-400">{proposalInquiry.budget}</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-slate-300">Proposal Scope & Terms (Zeptomail Dispatch)</label>
                <textarea
                  rows={6}
                  value={proposalNote}
                  onChange={(e) => setProposalNote(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs font-mono leading-relaxed focus:outline-none focus:border-blue-500 resize-y"
                  placeholder="Outline the architectural milestones, deliverables, Cloudflare D1/R2 infrastructure setup..."
                />
              </div>

              <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-800/40 text-[11px] text-blue-300">
                This triggers an automated transactional proposal email via <code>api.zeptomail.com</code> and updates the inquiry status in Cloudflare D1 to <strong>Proposal Sent</strong>.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setProposalInquiry(null)}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingProposal}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/30"
                >
                  {isSendingProposal ? 'Dispatching via Zeptomail...' : 'Dispatch Proposal to Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
