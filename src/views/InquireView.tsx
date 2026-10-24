/**
 * Pansoft Technologies – Client Project & Consulting Inquiry
 * Dual-Mode: Layman/Business Owner (Guided Tech Advisory) & Technical Spec (Engineers/CTOs).
 * East African localized budgets (KES, TZS, UGX, RWF, BIF, ETB, USD),
 * Zod validation, Cloudflare D1 persistence, and Zeptomail edge dispatch.
 */
import React, { useState } from 'react';
import { 
  Send, CheckCircle2, ShieldCheck, Sparkles, Database, Mail, 
  Cpu, Zap, Cloud, MessageSquare, Bot, HelpCircle, Layers, 
  ArrowRight, Check, Compass
} from 'lucide-react';
import { d1 } from '../lib/d1-client';
import { zeptomail } from '../lib/zeptomail-client';
import { BackendApiClient } from '../lib/api-client';
import { inquirySchema, InquiryInput } from '../lib/validation';
import { Inquiry } from '../types';
import { 
  EastAfricanCurrency, 
  EAST_AFRICAN_CURRENCIES, 
  EAST_AFRICAN_BUDGET_TIERS, 
  formatCurrency 
} from '../lib/currency';
import { CurrencySelector } from '../components/CurrencySelector';

interface InquireViewProps {
  onInquirySuccess?: () => void;
  initialCurrency?: EastAfricanCurrency;
}

export const InquireView: React.FC<InquireViewProps> = ({ 
  onInquirySuccess, 
  initialCurrency = 'KES' 
}) => {
  const [currency, setCurrency] = useState<EastAfricanCurrency>(initialCurrency);
  const [clientMode, setClientMode] = useState<'layman' | 'technical'>('layman');

  // Form State
  const [formData, setFormData] = useState<InquiryInput>({
    clientName: '',
    email: '',
    phone: '',
    company: '',
    clientMode: 'layman',
    projectType: 'Business Software Advisory & Development',
    budget: 'KSh 100,000 – KSh 350,000',
    timeline: '4 - 8 Weeks',
    techStack: ['Cloudflare Workers', 'Cloudflare D1', 'Zeptomail', 'WhatsApp API'],
    description: '',
    
    // Layman choices
    consultingNeeds: ['Emailing', 'Database', 'Cloud Platform', 'Messaging & WhatsApp'],
    preferredEmail: 'Zeptomail (Recommended by Pansoft)',
    preferredDatabase: 'Cloudflare D1 SQLite (Edge Relational)',
    preferredCompute: 'Cloudflare Workers (Sub-15ms Global Edge)',
    preferredCaching: 'Cloudflare KV & Edge Cache',
    preferredCloud: 'Cloudflare Cloud',
    preferredMessaging: 'WhatsApp Business API & Africa\'s Talking SMS',
    preferredAi: 'Gemini 2.5 Flash / Pro (Google AI)',
    businessGoals: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdInquiry, setCreatedInquiry] = useState<Inquiry | null>(null);

  // Consulting Architecture Options for Layman Selection
  const emailingOptions = [
    { id: 'zeptomail', label: 'Zeptomail (Pansoft Recommended)', desc: 'Fastest transactional inbox delivery, zero bounce penalties' },
    { id: 'sendgrid', label: 'Twilio SendGrid', desc: 'Global enterprise scale for high volume blasts' },
    { id: 'resend', label: 'Resend', desc: 'Modern developer-friendly React email templates' },
    { id: 'ses', label: 'Amazon SES', desc: 'Ultra-low cost high volume cloud dispatch' },
    { id: 'help_email', label: 'Help Me Choose (Pansoft Advisory)', desc: 'Movin Juma will evaluate your audience and pick the right one' },
  ];

  const databaseOptions = [
    { id: 'd1', label: 'Cloudflare D1 SQLite (Recommended)', desc: 'Distributed SQL at the edge, fast queries, zero server maintenance' },
    { id: 'postgres', label: 'PostgreSQL / Cloud SQL', desc: 'Robust relational database for complex multi-table financial records' },
    { id: 'supabase', label: 'Supabase / Firebase', desc: 'Instant real-time database with built-in auth and live triggers' },
    { id: 'mongodb', label: 'MongoDB Document DB', desc: 'Flexible non-relational document storage for catalogs' },
    { id: 'help_db', label: 'Help Me Choose (Pansoft Advisory)', desc: 'We examine your data structure and recommend the ideal engine' },
  ];

  const computeOptions = [
    { id: 'workers', label: 'Cloudflare Workers (Edge Serverless)', desc: 'Runs in 300+ cities near your users, no cold starts, 15ms speed' },
    { id: 'nodejs', label: 'Node.js & Express Daemon', desc: 'Standard dedicated server for continuous background workers' },
    { id: 'docker', label: 'Docker Container Cluster', desc: 'Self-contained deployable microservices on GCP or AWS' },
    { id: 'help_compute', label: 'Help Me Choose (Pansoft Advisory)', desc: 'We size your expected concurrent traffic and choose compute' },
  ];

  const cloudOptions = [
    { id: 'cloudflare', label: 'Cloudflare Cloud (Primary)', desc: 'Workers, D1, R2, KV, CDN, and DDoS mitigation in one roof' },
    { id: 'gcp', label: 'Google Cloud Platform (GCP)', desc: 'Cloud Run, BigQuery, Gemini AI, and Cloud SQL services' },
    { id: 'aws', label: 'Amazon Web Services (AWS)', desc: 'EC2, S3 buckets, RDS PostgreSQL, and Lambda functions' },
    { id: 'azure', label: 'Microsoft Azure', desc: 'Enterprise active directory and enterprise integrations' },
    { id: 'help_cloud', label: 'Help Me Choose (Pansoft Advisory)', desc: 'We match your compliance, budget, and geographic coverage' },
  ];

  const messagingOptions = [
    { id: 'whatsapp_sms', label: 'WhatsApp API + Africa\'s Talking SMS', desc: 'The golden East African standard for customer alerts & M-Pesa receipts' },
    { id: 'whatsapp_only', label: 'WhatsApp Business API Only', desc: 'Interactive conversational chat bot and customer care' },
    { id: 'sms_only', label: 'East African SMS Carrier Gateway', desc: 'Direct Safaricom, Vodacom, Airtel, and MTN SMS alerts' },
    { id: 'email_only', label: 'Email Notifications Only', desc: 'Cost-saving baseline for quiet corporate applications' },
    { id: 'help_messaging', label: 'Help Me Choose (Pansoft Advisory)', desc: 'Advise on optimal delivery rates and messaging costs' },
  ];

  const aiOptions = [
    { id: 'gemini', label: 'Gemini 2.5 Flash / Pro (Recommended)', desc: 'Next-gen reasoning, lightning-fast generation, multimodal input' },
    { id: 'openai', label: 'OpenAI / ChatGPT API', desc: 'Industry standard for text generation and structured extraction' },
    { id: 'rag_custom', label: 'Custom Business Knowledge RAG', desc: 'Search and query your private business PDFs, records, and FAQs' },
    { id: 'none', label: 'No AI Needed Currently', desc: 'Pure deterministic software logic without artificial intelligence' },
    { id: 'help_ai', label: 'Help Me Choose (Pansoft Advisory)', desc: 'Discuss AI ROI and feasibility with CEO Movin Juma' },
  ];

  // Technical stack options for CTO/Dev mode
  const technicalStackList = [
    'Cloudflare Workers',
    'Cloudflare D1 (SQLite Edge)',
    'Cloudflare R2 (Object Storage)',
    'Node.js & TypeScript',
    'Paystack Gateway & Webhooks',
    'Zeptomail Transactional Edge',
    'Nuxt 3 / Nitro Engine',
    'Hono / JWT Middleware',
    'Africa\'s Talking SMS Gateway',
    'WhatsApp Cloud API',
    'Google Cloud Platform (GCP)',
    'Amazon Web Services (AWS)',
    'Gemini 2.5 Flash / Pro AI',
    'PostgreSQL / Cloud SQL',
    'Redis Cache',
  ];

  const toggleTech = (tech: string) => {
    if (formData.techStack.includes(tech)) {
      if (formData.techStack.length > 1) {
        setFormData({
          ...formData,
          techStack: formData.techStack.filter((t) => t !== tech),
        });
      }
    } else {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, tech],
      });
    }
  };

  const handleModeChange = (mode: 'layman' | 'technical') => {
    setClientMode(mode);
    setFormData(prev => ({
      ...prev,
      clientMode: mode,
      projectType: mode === 'layman' 
        ? 'Business Advisory & Architecture Selection' 
        : 'Full-Stack Edge Application',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = inquirySchema.safeParse(formData);
    if (!result.success) {
      const errMap: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) errMap[err.path[0] as string] = err.message;
      });
      setErrors(errMap);
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Send to Express /api/inquiries backend endpoint
      const newInquiry = await BackendApiClient.createInquiry({
        clientName: formData.clientName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        clientMode: formData.clientMode,
        projectType: formData.projectType,
        budget: formData.budget,
        timeline: formData.timeline,
        techStack: formData.techStack,
        description: formData.description,
        consultingNeeds: formData.consultingNeeds,
        preferredEmail: formData.preferredEmail,
        preferredDatabase: formData.preferredDatabase,
        preferredCompute: formData.preferredCompute,
        preferredCaching: formData.preferredCaching,
        preferredCloud: formData.preferredCloud,
        preferredMessaging: formData.preferredMessaging,
        preferredAi: formData.preferredAi,
        businessGoals: formData.businessGoals,
      });

      // 2. Local D1 insert for offline/immediate reactivity
      d1.insertInquiry(newInquiry);

      // 3. Dispatch confirmation email via Zeptomail
      zeptomail.sendTransactionalEmail({
        toEmail: formData.email,
        toName: formData.clientName,
        subject: `Project & Advisory Inquiry Received: ${formData.projectType} – Pansoft Technologies (BN-36S5WLAP)`,
        templateType: 'inquiry_received',
        variables: {
          projectType: formData.projectType,
          budget: formData.budget,
        },
      });

      setCreatedInquiry(newInquiry);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to submit inquiry to Pansoft backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      
      {/* 1. Header & Layman Guidance Notice */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8">
        <div className="space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <span>Consulting & Advisory</span>
            <span aria-hidden="true">·</span>
            <span>Architecture Selection</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">East Africa & Global</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Consulting Services & Project Inquiry
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Not sure which email provider, database, cloud, messaging, or AI model fits your business? 
            <strong> You don’t need to be technical.</strong> Tell us what you want to achieve, and CEO Movin Juma and our software architects will evaluate and recommend the exact right technology stack for your budget.
          </p>
        </div>

        {/* Currency Switcher in Header */}
        <div className="flex flex-col sm:items-end gap-2 shrink-0">
          <span className="text-xs text-slate-400 font-medium">Select Currency:</span>
          <CurrencySelector
            currentCurrency={currency}
            onCurrencyChange={(curr) => {
              setCurrency(curr);
              // auto-update budget label in form
              const baseTier = EAST_AFRICAN_BUDGET_TIERS[1];
              const minStr = formatCurrency(baseTier.baseKesMin, curr);
              const maxStr = formatCurrency(baseTier.baseKesMax, curr);
              setFormData(prev => ({
                ...prev,
                budget: `${minStr} – ${maxStr}`,
              }));
            }}
          />
        </div>
      </div>

      {/* 2. Success Banner if submitted */}
      {createdInquiry && (
        <div className="p-8 rounded-2xl border border-emerald-500/50 bg-emerald-950/40 space-y-4 animate-in fade-in">
          <div className="flex items-center gap-3 text-emerald-400">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <h2 className="text-xl font-bold text-white">Inquiry Successfully Registered in D1 Database</h2>
          </div>
          <p className="text-slate-300 text-sm">
            Thank you, <strong className="text-white">{createdInquiry.clientName}</strong>. 
            Your consultation request for <strong className="text-emerald-300">{createdInquiry.projectType}</strong> (Reference: <code className="text-white font-mono">{createdInquiry.id}</code>) has been routed to Movin Juma’s engineering desk. 
            A confirmation receipt was dispatched via <strong>Zeptomail transactional API</strong> to <strong className="text-white">{createdInquiry.email}</strong>.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            {onInquirySuccess && (
              <button
                type="button"
                onClick={onInquirySuccess}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/40"
              >
                <span>View In Staff Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setCreatedInquiry(null);
                setFormData(prev => ({ ...prev, description: '', company: '' }));
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs transition-colors cursor-pointer"
            >
              Submit Another Inquiry
            </button>
          </div>
        </div>
      )}

      {/* 3. Mode Toggle: Layman / Business Advisory vs Technical Spec */}
      <div className="p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row gap-2 max-w-2xl">
        <button
          type="button"
          onClick={() => handleModeChange('layman')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            clientMode === 'layman'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Business & Founder Mode (Guided Advisory)</span>
        </button>

        <button
          type="button"
          onClick={() => handleModeChange('technical')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            clientMode === 'technical'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Technical Spec Mode (Engineers & CTOs)</span>
        </button>
      </div>

      {/* 4. The Main Inquiry Form */}
      <form onSubmit={handleSubmit} className="space-y-12">

        {/* Section A: Contact & Organization Identity */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800/80 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">01. Contact & Organization Details</h2>
              <p className="text-xs text-slate-400">Where should Movin Juma and our consulting engineers reach you?</p>
            </div>
            <span className="text-[11px] font-mono text-blue-400">Step 1 of 3</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">
                Full Name / Founder <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="e.g., Sarah Kimani or Marcus Vance"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
              {errors.clientName && <p className="text-[11px] text-red-400">{errors.clientName}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">
                Work / Contact Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="sarah@company.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
              {errors.email && <p className="text-[11px] text-red-400">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">
                Telephone / WhatsApp <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0141380666 or +254..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
              {errors.phone && <p className="text-[11px] text-red-400">{errors.phone}</p>}
            </div>

            {/* Company / Brand */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">
                Company / Organization / Project <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g., Nairobi Logistics or Personal Startup"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
              {errors.company && <p className="text-[11px] text-red-400">{errors.company}</p>}
            </div>

          </div>
        </div>

        {/* Section B: Guided Consulting Choices (Layman Mode) OR Tech Stack (Technical Mode) */}
        {clientMode === 'layman' ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 space-y-8">
            <div className="border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                <Compass className="w-4 h-4" />
                <span>Guided Architectural Consulting</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                02. Choose Your Technology Preferences (Or Let Us Advise You)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Select your preferred option for each layer below, or choose <em>"Help Me Choose"</em> if you'd like Pansoft to select the most reliable, cost-effective setup for you.
              </p>
            </div>

            {/* Dimension 1: Emailing Service */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span>1. Best Transactional Emailing Service</span>
                </div>
                <span className="text-[11px] text-slate-400">Current choice: <strong className="text-blue-300">{formData.preferredEmail}</strong></span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {emailingOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, preferredEmail: opt.label })}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      formData.preferredEmail === opt.label
                        ? 'bg-blue-950/60 border-blue-500 text-white shadow-md shadow-blue-900/30'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{opt.label}</span>
                      {formData.preferredEmail === opt.label && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Dimension 2: Database Layer */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>2. Database & Data Storage Engine</span>
                </div>
                <span className="text-[11px] text-slate-400">Current choice: <strong className="text-emerald-300">{formData.preferredDatabase}</strong></span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {databaseOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, preferredDatabase: opt.label })}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      formData.preferredDatabase === opt.label
                        ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-md shadow-emerald-900/30'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{opt.label}</span>
                      {formData.preferredDatabase === opt.label && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Dimension 3: Runtime / Compute */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Cpu className="w-4 h-4 text-amber-400" />
                  <span>3. Runtime & Compute Infrastructure</span>
                </div>
                <span className="text-[11px] text-slate-400">Current choice: <strong className="text-amber-300">{formData.preferredCompute}</strong></span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {computeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, preferredCompute: opt.label })}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      formData.preferredCompute === opt.label
                        ? 'bg-amber-950/60 border-amber-500 text-white shadow-md shadow-amber-900/30'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{opt.label}</span>
                      {formData.preferredCompute === opt.label && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Dimension 4: Cloud Platform */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Cloud className="w-4 h-4 text-cyan-400" />
                  <span>4. Primary Cloud Platform Provider</span>
                </div>
                <span className="text-[11px] text-slate-400">Current choice: <strong className="text-cyan-300">{formData.preferredCloud}</strong></span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {cloudOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, preferredCloud: opt.label })}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      formData.preferredCloud === opt.label
                        ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-md shadow-cyan-900/30'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{opt.label}</span>
                      {formData.preferredCloud === opt.label && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Dimension 5: Customer Messaging, SMS & WhatsApp */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>5. Customer Messaging, SMS & WhatsApp Gateways</span>
                </div>
                <span className="text-[11px] text-slate-400">Current choice: <strong className="text-emerald-300">{formData.preferredMessaging}</strong></span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {messagingOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, preferredMessaging: opt.label })}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      formData.preferredMessaging === opt.label
                        ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-md shadow-emerald-900/30'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{opt.label}</span>
                      {formData.preferredMessaging === opt.label && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Dimension 6: AI Integration */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Bot className="w-4 h-4 text-purple-400" />
                  <span>6. Artificial Intelligence & Smart Automation</span>
                </div>
                <span className="text-[11px] text-slate-400">Current choice: <strong className="text-purple-300">{formData.preferredAi}</strong></span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {aiOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, preferredAi: opt.label })}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      formData.preferredAi === opt.label
                        ? 'bg-purple-950/60 border-purple-500 text-white shadow-md shadow-purple-900/30'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{opt.label}</span>
                      {formData.preferredAi === opt.label && <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Dimension 7: Third-Party Integrations & East African Gateways */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>7. Third-Party Integrations (Any System With Documentation)</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-mono">M-Pesa · Pesapal · Paystack · WhatsApp</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                We integrate <strong>any third-party API or service given they have technical documentation</strong>. 
                Whether you need automated M-Pesa STK prompts on Safaricom, Pesapal card checkouts, WhatsApp booking bots, or custom banking/logistics APIs, our engineers build robust webhooks and automated verification.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { id: 'mpesa', title: 'Safaricom M-Pesa Daraja 2.0', desc: 'STK Push instant prompts, C2B Paybill/Till automation, and B2C automated disbursements.' },
                  { id: 'pesapal', title: 'Pesapal Payment Gateway', desc: 'Accept VISA, Mastercard, M-Pesa, Airtel Money, and bank transfers across East Africa.' },
                  { id: 'paystack', title: 'Paystack Gateway (like Housika)', desc: 'Recurring subscription billing, cards, and automated webhook settlement engines.' },
                  { id: 'whatsapp_api', title: 'WhatsApp Business Cloud API', desc: 'Automated booking confirmations, customer order receipts, and customer service bots.' },
                  { id: 'africas_talking', title: 'Africa\'s Talking (SMS / USSD)', desc: 'Branded alphanumeric SMS alerts, OTP verification, and USSD interactive dial menus.' },
                  { id: 'custom_api', title: 'Any Custom API With Documentation', desc: 'Accounting (QuickBooks, Xero), ERPs, CRM systems, or internal corporate data feeds.' },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-300"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs font-bold text-white">{item.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          /* Technical Mode: Select exact stack chips */
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                <Zap className="w-4 h-4" />
                <span>Technical Specifications</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                02. Direct Architecture & Tech Stack Selection
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Toggle all specific technologies required for your deployment or migration sprint.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {technicalStackList.map((tech) => {
                const selected = formData.techStack.includes(tech);
                return (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => toggleTech(tech)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                      selected
                        ? 'bg-blue-600 border-blue-500 text-white font-semibold shadow-md shadow-blue-600/30'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {tech}
                  </button>
                );
              })}
            </div>
            {errors.techStack && <p className="text-xs text-red-400">{errors.techStack}</p>}
          </div>
        )}

        {/* Section C: Budget (East African Currencies) & Timeline */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">03. Project Scope, Budget & Business Objectives</h2>
              <p className="text-xs text-slate-400">
                Priced with transparent East African currency benchmarks ({EAST_AFRICAN_CURRENCIES[currency].name} · {EAST_AFRICAN_CURRENCIES[currency].country}).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Currency:</span>
              <CurrencySelector
                currentCurrency={currency}
                onCurrencyChange={(c) => {
                  setCurrency(c);
                  const first = EAST_AFRICAN_BUDGET_TIERS[1];
                  setFormData(prev => ({
                    ...prev,
                    budget: `${formatCurrency(first.baseKesMin, c)} – ${formatCurrency(first.baseKesMax, c)}`,
                  }));
                }}
                compact
              />
            </div>
          </div>

          {/* Budget Tier Selector Cards */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-300">
              Estimated Budget Tier ({EAST_AFRICAN_CURRENCIES[currency].code}) <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {EAST_AFRICAN_BUDGET_TIERS.map((tier) => {
                const minFormatted = formatCurrency(tier.baseKesMin, currency);
                const maxFormatted = formatCurrency(tier.baseKesMax, currency);
                const label = tier.id === 'enterprise' 
                  ? `${minFormatted}+ (Enterprise Custom)` 
                  : tier.id === 'consulting_hourly'
                    ? `Consulting Review (${minFormatted} – ${maxFormatted})`
                    : `${minFormatted} – ${maxFormatted}`;

                const isSelected = formData.budget.includes(minFormatted) || formData.budget === label;

                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, budget: label })}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-950/60 border-blue-500 text-white shadow-md shadow-blue-900/30'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">{tier.description}</p>
                  </button>
                );
              })}
            </div>
            {errors.budget && <p className="text-[11px] text-red-400">{errors.budget}</p>}
          </div>

          {/* Timeline and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">Target Delivery Timeline</label>
              <select
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="1 - 2 Weeks (Urgent MVP / Bugfix Sprint)">1 - 2 Weeks (Urgent MVP / Sprint)</option>
                <option value="2 - 4 Weeks (Module / Payment Integration)">2 - 4 Weeks (Module / Payment Integration)</option>
                <option value="4 - 8 Weeks (Full SaaS Platform)">4 - 8 Weeks (Full SaaS Platform)</option>
                <option value="2 - 3 Months (Enterprise Edge Migration)">2 - 3 Months (Enterprise Edge Migration)</option>
                <option value="Ongoing Maintenance & SRE Support">Ongoing Maintenance & SRE Support</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">Project / Engagement Focus</label>
              <select
                value={formData.projectType}
                onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="Business Advisory & Architecture Selection">Business Advisory & Architecture Selection</option>
                <option value="Full-Stack SaaS Platform (like Housika)">Full-Stack SaaS Platform (like Housika)</option>
                <option value="Cloudflare Workers & D1 Edge Migration">Cloudflare Workers & D1 Edge Migration</option>
                <option value="Paystack, M-Pesa & Financial Gateway Integration">Paystack, M-Pesa & Financial Gateway Integration</option>
                <option value="WhatsApp Business API & Customer Chatbot">WhatsApp Business API & Customer Chatbot</option>
                <option value="Gemini AI & Smart Automation Workflow">Gemini AI & Smart Automation Workflow</option>
                <option value="Software Maintenance & Automated Testing">Software Maintenance & Automated Testing</option>
              </select>
            </div>

          </div>

          {/* Description & Requirements in Plain English */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-medium text-slate-300">
              {clientMode === 'layman' 
                ? 'Describe Your Business Goal, Problem or Idea (Plain Language)' 
                : 'Technical Brief & Architectural Scope'} <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={clientMode === 'layman' 
                ? "e.g., We want an automated booking and payment system where customers receive WhatsApp receipts and M-Pesa notifications, and our staff can see reservations on a clean dashboard. Please advise on the best database and emailing service." 
                : "e.g., Migrating existing Express monolithic backend to Cloudflare Workers and D1 database. Need Paystack webhook validation with idempotent signature checks and Zeptomail transactional outbox."}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
            />
            {errors.description && <p className="text-[11px] text-red-400">{errors.description}</p>}
          </div>

        </div>

        {/* Section D: Direct Submit & Statutory Commitment */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="font-semibold text-white">Registered Entity: Pansoft Technologies (BN-36S5WLAP)</div>
              <div>Official Corporate Line: <strong className="text-slate-200">0141380666 (+254 141 380 666)</strong> · Founder: Movin Juma</div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-blue-600/30"
          >
            {isSubmitting ? (
              <span>Submitting to D1 Database...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Consultation Inquiry</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
