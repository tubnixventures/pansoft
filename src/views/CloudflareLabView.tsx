/**
 * Pansoft Technologies – Cloudflare Workers & Nuxt 3 Architecture Lab
 * Provides complete source code inspection and one-click ZIP download
 * for wrangler.toml, schema.sql, worker/index.ts, and nuxt.config.ts.
 */
import React, { useState } from 'react';
import { Copy, Check, Download, Terminal, Database, Server, Cloud, ExternalLink } from 'lucide-react';
import { CODE_TEMPLATES } from '../lib/code-templates';
import { r2 } from '../lib/r2-client';

export const CloudflareLabView: React.FC = () => {
  const [activeFile, setActiveFile] = useState<'wrangler' | 'schema' | 'worker' | 'nuxt'>('wrangler');
  const [copied, setCopied] = useState<string | null>(null);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  const getActiveCode = () => {
    switch (activeFile) {
      case 'wrangler': return CODE_TEMPLATES.wranglerToml;
      case 'schema': return CODE_TEMPLATES.schemaSql;
      case 'worker': return CODE_TEMPLATES.workerHono;
      case 'nuxt': return CODE_TEMPLATES.nuxtConfig;
    }
  };

  const getActiveFileName = () => {
    switch (activeFile) {
      case 'wrangler': return 'wrangler.toml';
      case 'schema': return 'schema.sql (Cloudflare D1)';
      case 'worker': return 'src/worker.ts (Hono / JWT)';
      case 'nuxt': return 'nuxt.config.ts (Nuxt 3 + Cloudflare)';
    }
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(activeFile);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownloadAllZip = async () => {
    setIsDownloadingZip(true);
    try {
      const filesToBundle = [
        { name: 'wrangler.toml', content: CODE_TEMPLATES.wranglerToml },
        { name: 'schema.sql', content: CODE_TEMPLATES.schemaSql },
        { name: 'src/worker.ts', content: CODE_TEMPLATES.workerHono },
        { name: 'nuxt.config.ts', content: CODE_TEMPLATES.nuxtConfig },
        {
          name: 'README.md',
          content: `# Pansoft Technologies – Cloudflare Workers & Nuxt 3 Engine\nCompany Reg: BN-36S5WLAP\nCEO & Founder: Movin Juma\nContact: 0141380666\n\n## Deployment Steps\n1. Install dependencies: \`npm install\`\n2. Create D1 database: \`npx wrangler d1 create pansoft_production_d1\`\n3. Apply schema: \`npx wrangler d1 execute pansoft_production_d1 --file=./schema.sql\`\n4. Create R2 bucket: \`npx wrangler r2 bucket create pansoft-tech-production-r2\`\n5. Set secrets: \`npx wrangler secret put ZEPTOMAIL_API_KEY\`\n6. Deploy: \`npm run deploy\` or \`npx wrangler deploy\`\n`,
        },
      ];

      const { blob, fileName } = await r2.createZipArchive(filesToBundle, 'pansoft-cloudflare-nuxt-stack.zip');
      
      // Trigger browser download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Failed to bundle code files.');
    } finally {
      setIsDownloadingZip(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      
      {/* 1. Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-8">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <span>Cloudflare Edge Architecture Lab</span>
            <span aria-hidden="true">·</span>
            <span>Nuxt 3 + Workers + D1 + R2 + Zeptomail</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Production Cloudflare Stack Blueprints
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Every file required to deploy Pansoft Technologies onto Cloudflare Pages / Workers with D1 SQLite, zero-egress R2, Hono JWT token verification, and Zeptomail transactional dispatch.
          </p>
        </div>

        <button
          onClick={handleDownloadAllZip}
          disabled={isDownloadingZip}
          className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-lg shadow-blue-600/30 whitespace-nowrap self-start lg:self-center"
        >
          <Download className="w-4 h-4" />
          <span>{isDownloadingZip ? 'Bundling ZIP...' : 'Download Complete Stack (.ZIP)'}</span>
        </button>
      </div>

      {/* 2. Architecture Visual Topology */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs">
        <div className="space-y-1 p-3 rounded-lg bg-slate-950 border border-slate-800/80">
          <div className="font-bold text-white flex items-center gap-2">
            <Cloud className="w-4 h-4 text-orange-400" />
            <span>Nuxt 3 Nitro Engine</span>
          </div>
          <div className="text-slate-400">SSR & SSG pre-rendered at Cloudflare 300+ Edge locations.</div>
        </div>

        <div className="space-y-1 p-3 rounded-lg bg-slate-950 border border-slate-800/80">
          <div className="font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-400" />
            <span>Cloudflare D1 (SQLite)</span>
          </div>
          <div className="text-slate-400">Distributed relational schema with instant global replication.</div>
        </div>

        <div className="space-y-1 p-3 rounded-lg bg-slate-950 border border-slate-800/80">
          <div className="font-bold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <span>Cloudflare R2 Storage</span>
          </div>
          <div className="text-slate-400">Zero-egress object storage for contact files & freelancer ZIP bundles.</div>
        </div>

        <div className="space-y-1 p-3 rounded-lg bg-slate-950 border border-slate-800/80">
          <div className="font-bold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-purple-400" />
            <span>Hono / JWT & Zeptomail</span>
          </div>
          <div className="text-slate-400">Ultra-fast microservice routing, JWT validation & transactional email.</div>
        </div>
      </div>

      {/* 3. Code Inspector */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
        
        {/* File Tabs */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveFile('wrangler')}
              className={`px-3 py-1.5 rounded-lg font-mono transition-colors cursor-pointer ${
                activeFile === 'wrangler' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              wrangler.toml
            </button>
            <button
              onClick={() => setActiveFile('schema')}
              className={`px-3 py-1.5 rounded-lg font-mono transition-colors cursor-pointer ${
                activeFile === 'schema' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              schema.sql (D1)
            </button>
            <button
              onClick={() => setActiveFile('worker')}
              className={`px-3 py-1.5 rounded-lg font-mono transition-colors cursor-pointer ${
                activeFile === 'worker' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              src/worker.ts (Hono)
            </button>
            <button
              onClick={() => setActiveFile('nuxt')}
              className={`px-3 py-1.5 rounded-lg font-mono transition-colors cursor-pointer ${
                activeFile === 'nuxt' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              nuxt.config.ts
            </button>
          </div>

          <button
            onClick={() => handleCopyCode(getActiveCode())}
            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1.5 cursor-pointer"
          >
            {copied === activeFile ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content Display */}
        <div className="p-6 overflow-x-auto max-h-[500px] overflow-y-auto bg-slate-950 font-mono text-xs leading-relaxed text-slate-300">
          <pre>{getActiveCode()}</pre>
        </div>

        <div className="px-6 py-3 bg-slate-900/60 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Active File: {getActiveFileName()}</span>
          <span>Zero Build Step Overhead · Cloudflare Workers Compatible</span>
        </div>

      </div>

      {/* 4. Deployment CLI Runbook */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-400" />
          <span>Cloudflare CLI Deployment Runbook</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-slate-300">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-slate-400 font-sans text-xs font-semibold">1. Initialize D1 Distributed Database</div>
            <div className="text-blue-400">$ npx wrangler d1 create pansoft_production_d1</div>
            <div className="text-blue-400">$ npx wrangler d1 execute pansoft_production_d1 --file=./schema.sql</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-slate-400 font-sans text-xs font-semibold">2. Provision R2 Bucket & Secrets</div>
            <div className="text-blue-400">$ npx wrangler r2 bucket create pansoft-tech-production-r2</div>
            <div className="text-blue-400">$ npx wrangler secret put ZEPTOMAIL_API_KEY</div>
          </div>
        </div>
      </div>

    </div>
  );
};
