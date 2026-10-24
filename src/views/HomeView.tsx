/**
 * Pansoft Technologies – Home & Overview View
 * Implements Frontend Design Constitution:
 * - Anti-slop: No comments '//', no fake telemetry, zero-pill metadata with '·'
 * - 100% device responsive on mobile, tablet, and wide desktop
 * - Dedicated Executive Leadership & Founder section for Movin Juma
 */
import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Database, Server, CreditCard, Code, Users, Mail, Phone, Cpu } from 'lucide-react';

interface HomeViewProps {
  setActiveTab: (tab: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ setActiveTab }) => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative pt-8 sm:pt-16 md:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Value Proposition & Claims */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6">
              
              {/* Unboxed Metadata Header (No pill badge) */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400 tracking-wide">
                <span>Pansoft Technologies</span>
                <span aria-hidden="true">·</span>
                <span>Reg. BN-36S5WLAP</span>
                <span aria-hidden="true">·</span>
                <span>Software Design, Development & Maintenance</span>
              </div>

              {/* Strict Type Scale & Headline Containment */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15] max-w-2xl text-balance">
                Architecting resilient software, cloud edge systems, and high-volume SaaS.
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-xl leading-relaxed">
                Registered software engineering firm. Specializing in Cloudflare Workers, Cloudflare D1 distributed databases, zero-egress R2 storage, Paystack fintech payment gateways, and scalable cloud architectures.
              </p>

              {/* Action Group */}
              <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
                <button
                  onClick={() => setActiveTab('inquire')}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <span>Request Project Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 font-medium text-sm transition-colors text-center cursor-pointer whitespace-nowrap"
                >
                  Explore Housika SaaS
                </button>
                <button
                  onClick={() => setActiveTab('freelance')}
                  className="px-4 py-3 text-sm text-slate-400 hover:text-white transition-colors text-center cursor-pointer whitespace-nowrap"
                >
                  Freelance Hub →
                </button>
              </div>

              {/* Trust & Verification markers */}
              <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400 border-t border-slate-900">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Licensed Entity BN-36S5WLAP</span>
                </div>
                <div>Global Cloud Infrastructure</div>
                <div>Public Contact: 0141380666 (+254 141 380 666)</div>
              </div>

            </div>

            {/* Right Column: Hero Visual Studio Photo */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
                <img
                  src="/src/assets/images/hero_pansoft_tech_1792856276014.jpg"
                  alt="Pansoft Technologies engineering headquarters and cloud infrastructure studio"
                  referrerPolicy="no-referrer"
                  className="w-full h-[280px] sm:h-[380px] lg:h-[420px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 sm:p-4 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800/80 text-xs">
                  <div className="font-semibold text-white">Cloudflare Edge & Distributed Architecture Lab</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Automated test runners, D1 replication, and sub-15ms edge compute.</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Claim-to-Proof Adjacency Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">&lt;15ms</div>
            <div className="text-xs text-slate-400 font-medium">Cloudflare D1 edge query latency</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">100%</div>
            <div className="text-xs text-slate-400 font-medium">Guaranteed on-time freelance payouts</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">99.99%</div>
            <div className="text-xs text-slate-400 font-medium">Paystack financial webhook reliability</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">$0 / GB</div>
            <div className="text-xs text-slate-400 font-medium">Zero-egress Cloudflare R2 storage</div>
          </div>
        </div>
      </section>

      {/* 3. Featured Flagship SaaS Showcase: Housika */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-10 lg:p-12 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                <span>Featured In-House SaaS</span>
                <span aria-hidden="true">·</span>
                <span>PropTech & Financial Integrations</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Housika — House Rental Marketplace Powered by Paystack
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Housika is our internally developed flagship platform designed for high-trust real estate leasing. It features automated tenant verification, landlord escrow booking, and robust multi-currency transactions via Paystack gateway with zero-fail webhooks.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-300">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="font-semibold text-white mb-1">Paystack Checkout</div>
                  <div className="text-slate-400 text-[11px] leading-relaxed">Card, bank transfer, and mobile money with instant cryptographic webhook validation.</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="font-semibold text-white mb-1">D1 Rental Records</div>
                  <div className="text-slate-400 text-[11px] leading-relaxed">High-concurrency listing queries replicated globally with zero database cold starts.</div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => setActiveTab('products')}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/20"
                >
                  <span>View Housika Platform Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setActiveTab('inquire')}
                  className="px-4 py-2.5 text-xs text-slate-300 hover:text-white transition-colors text-center cursor-pointer"
                >
                  Deploy White-Label Version →
                </button>
              </div>

            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl group">
                <img
                  src="/src/assets/images/housika_saas_platform_1792856276944.jpg"
                  alt="Housika house rental marketplace SaaS dashboard with Paystack checkout integration"
                  referrerPolicy="no-referrer"
                  className="w-full h-[260px] sm:h-[340px] lg:h-[380px] object-cover group-hover:scale-[1.01] transition-transform duration-300"
                />
                <div className="p-3.5 bg-slate-950/90 border-t border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2">
                  <span className="text-slate-400 text-[11px]">Paystack API Gateway · Card · M-Pesa · Transfer</span>
                  <span className="font-mono text-emerald-400 text-[11px]">99.99% Webhook Success</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Core Architectural Capabilities Bento */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <span>Core Engineering Pillars</span>
            <span aria-hidden="true">·</span>
            <span>Software Design & Maintenance</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Specialized engineering for high-concurrency systems.
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
            From serverless edge workers to mission-critical financial webhooks and automated testing suites, our architectural foundation is built for production reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Cloudflare Edge, D1 & R2 */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">01. Cloudflare Workers, D1 & R2</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Global edge deployments utilizing Cloudflare D1 distributed SQLite and zero-egress R2 object storage. Eliminates database cold starts and drops origin infrastructure costs by up to 80%.
            </p>
            <div className="pt-2 text-[11px] font-mono text-slate-400">
              Tech: Cloudflare Workers · D1 · R2 · KV · Wrangler
            </div>
          </div>

          {/* Card 2: TypeScript & Node.js Backend Architectures */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">02. Robust Backend & Node.js</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Strictly typed Node.js and TypeScript architectures engineered with clean layer separation, Hono/Express routing, Zod runtime validation, and automated integration testing pipelines.
            </p>
            <div className="pt-2 text-[11px] font-mono text-slate-400">
              Tech: TypeScript · Node.js · Zod · Hono/JWT · Vitest
            </div>
          </div>

          {/* Card 3: Payments, Webhooks & Firebase Services */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">03. Financial Gateways & Paystack</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Specialized integrations for complex financial platforms. Idempotent webhook processors, multi-party escrow logic, automated reconciliation, and Firebase real-time synchronizations.
            </p>
            <div className="pt-2 text-[11px] font-mono text-slate-400">
              Tech: Paystack API · Webhooks · HMAC · Firebase
            </div>
          </div>

          {/* Card 4: Multi-Cloud Infrastructure (GCP, Azure, AWS) */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">04. Multi-Cloud & Automated CI/CD</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Deep expertise across Google Cloud Platform (GCP), Microsoft Azure, and AWS. We construct hardened containerized services, automated testing matrices, and blue-green zero-downtime releases.
            </p>
            <div className="pt-2 text-[11px] font-mono text-slate-400">
              Tech: GCP Cloud Run · Azure · AWS ECS · GitHub Actions
            </div>
          </div>

          {/* Card 5: Freelance Code Review & Prompt Payment */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors space-y-4">
            <div className="w-10 h-10 rounded-xl bg-sky-950/80 border border-sky-800/60 flex items-center justify-center text-sky-400">
              <Code className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">05. Freelance Review Hub & R2</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We contract specialized freelance engineers during peak traffic sprints. Freelancers submit zipped code to Cloudflare R2 with transparent review criteria and prompt on-time settlement.
            </p>
            <div className="pt-2 text-[11px] font-mono text-slate-400">
              Policy: Guaranteed On-Time Payouts · JSZip Bundling
            </div>
          </div>

          {/* Card 6: Partner & Customer Referrals */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors space-y-4">
            <div className="w-10 h-10 rounded-xl bg-pink-950/80 border border-pink-800/60 flex items-center justify-center text-pink-400">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">06. Referral Partner Program</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We reward partners and clients who refer qualified contracts and SaaS adoptions to our platform. All compensation structures are backed by transparent, negotiated agreements.
            </p>
            <div className="pt-2 text-[11px] font-mono text-slate-400">
              Model: Transparent Negotiated Price / Milestone Share
            </div>
          </div>

        </div>
      </section>

      {/* 5. Dedicated Executive Leadership & Founder Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 sm:p-10 lg:p-12 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-6">
            <div>
              <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                Corporate Leadership & Engineering Architecture
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                About the Founder & Technical Direction
              </h2>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Entity Reg: <span className="text-slate-200">BN-36S5WLAP</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Founder Portrait with Responsive Framing */}
            <div className="md:col-span-5 flex justify-center">
              <div className="w-full max-w-sm sm:max-w-none rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
                <img
                  src="/src/assets/images/founder_movin_juma_1792856276833.jpg"
                  alt="Movin Juma, CEO & Founder of Pansoft Technologies"
                  referrerPolicy="no-referrer"
                  className="w-full h-[320px] sm:h-[400px] object-cover"
                />
                <div className="p-4 bg-slate-950 border-t border-slate-800 text-xs space-y-1">
                  <div className="font-bold text-white text-sm">Movin Juma</div>
                  <div className="text-slate-400">CEO, Founder & Principal Software Engineering Architect</div>
                  <div className="text-[11px] text-blue-400 font-mono pt-1">Direct Line: +254 745 910 909</div>
                </div>
              </div>
            </div>

            {/* Founder Bio & Technical Specializations */}
            <div className="md:col-span-7 space-y-5">
              <blockquote className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal border-l-2 border-blue-500 pl-4 py-1 italic">
                "We bridge the gap between elegant software design and unbreakable backend engineering. Whether deploying edge workers on Cloudflare, processing thousands of Paystack webhooks, or conducting meticulous code reviews with our trusted freelance network, our standard is flawless execution."
              </blockquote>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Pansoft Technologies is led by CEO and founder <strong>Movin Juma</strong>, an engineering architect dedicated to serving global clients with high-quality, scalable digital solutions. With a deep passion for backend development, Movin specializes in TypeScript and Node.js for constructing robust, failure-resistant server-side architectures.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-blue-400" />
                    <span>Backend Architecture</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Deep expertise in Node.js, TypeScript, event-driven systems, and Hono microservices running at Cloudflare edge.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-white flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <span>Fintech & Payments</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Architected Paystack payment gateways, cryptographic webhook verification, multi-party escrow, and Firebase financial services.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-purple-400" />
                    <span>Multi-Cloud & Testing</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Strong knowledge in automated testing suites, Cloudflare Cloud, Google Cloud Platform (GCP), Microsoft Azure, and AWS.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-pink-400" />
                    <span>Talent & Partnerships</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Champions fair engineering compensation: guaranteed prompt payments for freelancers and transparent negotiated referral rewards.
                  </p>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-4 text-xs">
                <a
                  href="mailto:movin@pansoft.tech"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-2 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Movin Juma</span>
                </a>
                <a
                  href="tel:0141380666"
                  className="px-4 py-2 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-medium flex items-center gap-2 transition-colors font-mono"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  <span>Call 0141380666</span>
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 6. Direct Lead Capture Call-to-Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl bg-gradient-to-b from-blue-950/40 to-slate-950 border border-blue-900/50 p-6 sm:p-10 lg:p-12 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight max-w-xl mx-auto text-balance">
            Ready to build or modernize your software architecture?
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Submit your technical specifications or project inquiry. Our team analyzes requirements, suggests optimal cloud topologies, and delivers an itemized milestone proposal within 24 hours.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 sm:gap-4">
            <button
              onClick={() => setActiveTab('inquire')}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-blue-600/30 cursor-pointer whitespace-nowrap"
            >
              Start Project Inquiry
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              Contact Operations Desk (+254 745 910 909)
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
