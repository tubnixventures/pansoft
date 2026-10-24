/**
 * Pansoft Technologies – Services & Solutions View
 * Comprehensive breakdown of Software Design, Development, and Maintenance services.
 */
import React from 'react';
import { ArrowRight, Code2, Server, Database, ShieldCheck, Cpu, RefreshCw, CheckCircle2 } from 'lucide-react';

interface ServicesViewProps {
  setActiveTab: (tab: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ setActiveTab }) => {
  const services = [
    {
      index: '01',
      title: 'Software Design & System Architecture',
      description: 'End-to-end technical blueprinting before writing a single line of production code. We define strict domain boundaries, event schemas, entity relationship diagrams, and cloud topology to prevent technical debt.',
      icon: Code2,
      deliverables: [
        'Domain-Driven Design (DDD) specifications',
        'Entity Relationship & Cloudflare D1 schema modeling',
        'API contracts using Zod and OpenAPI 3.1 standards',
        'Latency & throughput capacity projections',
      ],
      tech: 'TypeScript · Zod · Mermaid · Cloud Architecture',
    },
    {
      index: '02',
      title: 'Full-Stack Development (TypeScript & Node.js)',
      description: 'Engineering resilient, type-safe web applications and high-throughput APIs. We specialize in modern reactive frontends coupled with ultra-fast Node.js server architectures.',
      icon: Server,
      deliverables: [
        'Nuxt 3 / React SPA & SSR client dashboards',
        'Hono / Express backend microservices',
        'Type-safe RPC communication and JWT auth',
        'Automated Vitest / Playwright test coverage',
      ],
      tech: 'Node.js · TypeScript · Nuxt 3 · React · Hono',
    },
    {
      index: '03',
      title: 'Cloudflare Edge, Workers & D1 Integration',
      description: 'Modernizing legacy monolithic backends into globally distributed Cloudflare edge runtimes. Replicate your database instantly and eliminate cold starts across global regions.',
      icon: Database,
      deliverables: [
        'Cloudflare Workers microservice migration',
        'Cloudflare D1 distributed SQLite provisioning',
        'Zero-egress Cloudflare R2 object storage setup',
        'Cloudflare KV edge caching & rate limiting',
      ],
      tech: 'Cloudflare Workers · D1 · R2 · KV · Wrangler',
    },
    {
      index: '04',
      title: 'Paystack & Financial Platform Integrations',
      description: 'High-security payment processing and idempotent webhook engineering. Derived from our experience building the Housika rental marketplace payment core.',
      icon: ShieldCheck,
      deliverables: [
        'Paystack card, USSD, and bank transfer gateways',
        'Cryptographic HMAC SHA512 webhook listeners',
        'Multi-party split payments & automated escrow release',
        'Audit trails, financial reconciliation & refund queues',
      ],
      tech: 'Paystack API · HMAC Verification · Webhooks · D1 Ledgers',
    },
    {
      index: '05',
      title: 'Software Maintenance & Automated QA Testing',
      description: 'Ongoing technical stewardship for growing software platforms. We monitor uptime, patch security vulnerabilities, optimize query plans, and conduct thorough freelance code reviews.',
      icon: RefreshCw,
      deliverables: [
        '24/7 Edge health checks and error telemetry',
        'Security audits and dependency vulnerability remediation',
        'Automated CI/CD deployment pipelines on GitHub Actions',
        'Freelance pull request peer reviews and code quality gatekeeping',
      ],
      tech: 'Automated CI/CD · Vitest · Zeptomail Alerts · Snyk',
    },
    {
      index: '06',
      title: 'Multi-Cloud Deployments: GCP, Azure & AWS',
      description: 'Strategic hybrid and multi-cloud architectures. We ensure your core data layers remain portable while leveraging the unique advantages of Google Cloud, Azure, and AWS.',
      icon: Cpu,
      deliverables: [
        'Google Cloud Platform (Cloud Run, Secret Manager, Cloud SQL)',
        'Microsoft Azure (App Services, Blob Storage, Entra ID)',
        'Amazon Web Services (S3, ECS Fargate, Lambda, CloudFront)',
        'Zero-downtime blue/green infrastructure deployments',
      ],
      tech: 'Google Cloud Platform · Microsoft Azure · AWS · Docker',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
          <span>Enterprise Engineering</span>
          <span aria-hidden="true">·</span>
          <span>Reg. BN-36S5WLAP</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
          Software design, development and maintenance.
        </h1>
        <p className="text-slate-300 text-base leading-relaxed">
          Led by founder & CEO Movin Juma, Pansoft Technologies delivers mission-critical software solutions. Every engagement follows strict architectural discipline, type-safety, and automated verification.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.index}
              className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-950/70 border border-blue-800/60 flex items-center justify-center text-blue-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-bold font-mono text-slate-400">{s.index}</span>
                </div>

                <h3 className="text-xl font-bold text-white tracking-tight">{s.title}</h3>
                
                <p className="text-sm text-slate-300 leading-relaxed">
                  {s.description}
                </p>

                <div className="space-y-2 pt-2">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Key Deliverables</div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {s.deliverables.map((d, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400">{s.tech}</span>
                <button
                  onClick={() => setActiveTab('inquire')}
                  className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>Inquire</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA Banner */}
      <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-bold text-white">Have a specialized architectural requirement?</h3>
          <p className="text-xs text-slate-400">
            We review complex requirements, fintech payment flows, and Cloudflare migrations directly with our engineering architects.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('inquire')}
          className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shrink-0 cursor-pointer"
        >
          Request Technical Consultation
        </button>
      </div>

    </div>
  );
};
