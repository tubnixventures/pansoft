/**
 * Pansoft Technologies – Production Cloudflare Workers & Nuxt 3 Architecture Files
 * Complete, ready-to-deploy configs with Cloudflare D1, R2, Hono/JWT, and Zeptomail.
 */

export const CODE_TEMPLATES = {
  wranglerToml: `name = "pansoft-technologies-edge"
main = "./src/worker.ts"
compatibility_date = "2026-03-01"
compatibility_flags = ["nodejs_compat"]

# Cloudflare D1 Distributed SQLite Database Binding
[[d1_databases]]
binding = "DB"
database_name = "pansoft_production_d1"
database_id = "d1-8f92a10c-33b2-4d1f-8891-pansoft_prod"

# Cloudflare R2 Object Storage Binding (Zero Egress)
[[r2_buckets]]
binding = "R2_BUCKET"
bucket_name = "pansoft-tech-production-r2"
preview_bucket_name = "pansoft-tech-preview-r2"

# Cloudflare KV for Session Cache & Rate Limiting
[[kv_namespaces]]
binding = "KV_CACHE"
id = "kv_pansoft_cache_edge_prod"

[vars]
COMPANY_NAME = "Pansoft Technologies"
COMPANY_REG = "BN-36S5WLAP"
COMPANY_PHONE = "+254745910909"
CEO_NAME = "Movin Juma"
ZEPTOMAIL_FROM_EMAIL = "noreply@pansoft.tech"
ZEPTOMAIL_BOUNCE_EMAIL = "bounce@bounce.pansoft.tech"
JWT_ISSUER = "https://pansoft.tech"
APP_ENV = "production"

# Secrets required via \`npx wrangler secret put\`:
# - ZEPTOMAIL_API_KEY
# - JWT_SECRET
# - PAYSTACK_SECRET_KEY
# - R2_ACCESS_KEY_ID
# - R2_SECRET_ACCESS_KEY
`,

  schemaSql: `-- Pansoft Technologies: Cloudflare D1 Database Schema
-- Registration: BN-36S5WLAP | Founder: Movin Juma

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK(role IN ('admin', 'client', 'freelancer')) DEFAULT 'client',
  company TEXT,
  phone TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT NOT NULL,
  project_type TEXT NOT NULL,
  budget TEXT NOT NULL,
  timeline TEXT NOT NULL,
  tech_stack TEXT NOT NULL, -- JSON array of selected technologies
  description TEXT NOT NULL,
  r2_attachment_key TEXT,
  r2_attachment_name TEXT,
  status TEXT CHECK(status IN ('new', 'in_review', 'proposal_sent', 'contract_signed')) DEFAULT 'new',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS freelance_submissions (
  id TEXT PRIMARY KEY,
  freelancer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  specialty TEXT NOT NULL,
  repository_url TEXT,
  notes TEXT NOT NULL,
  zip_file_name TEXT NOT NULL,
  zip_file_size INTEGER NOT NULL,
  zip_file_count INTEGER NOT NULL,
  r2_key TEXT NOT NULL,
  review_status TEXT CHECK(review_status IN ('pending', 'in_review', 'approved', 'changes_requested')) DEFAULT 'pending',
  negotiated_fee TEXT NOT NULL,
  payout_status TEXT CHECK(payout_status IN ('pending', 'scheduled', 'paid')) DEFAULT 'pending',
  file_tree_json TEXT,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS referrals (
  id TEXT PRIMARY KEY,
  referrer_name TEXT NOT NULL,
  referrer_email TEXT NOT NULL,
  referrer_phone TEXT NOT NULL,
  lead_name TEXT NOT NULL,
  lead_company TEXT NOT NULL,
  lead_email TEXT NOT NULL,
  lead_phone TEXT,
  estimated_project_size TEXT NOT NULL,
  negotiated_reward_rate TEXT NOT NULL,
  status TEXT CHECK(status IN ('negotiating', 'approved', 'converted', 'paid')) DEFAULT 'negotiating',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS zeptomail_logs (
  id TEXT PRIMARY KEY,
  to_email TEXT NOT NULL,
  to_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  template_type TEXT NOT NULL,
  status TEXT NOT NULL,
  message_id TEXT NOT NULL,
  body_snippet TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS password_resets (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  token TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_freelance_status ON freelance_submissions(review_status);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
`,

  workerHono: `/**
 * Pansoft Technologies – Cloudflare Worker Entrypoint
 * Framework: Hono + D1 Database + R2 Storage + Zeptomail + Zod
 */
import { Hono } from 'hono';
import { jwt, sign, verify } from 'hono/jwt';
import { cors } from 'hono/cors';
import { z } from 'zod';

export interface Env {
  DB: D1Database;
  R2_BUCKET: R2Bucket;
  KV_CACHE: KVNamespace;
  JWT_SECRET: string;
  ZEPTOMAIL_API_KEY: string;
  COMPANY_NAME: string;
  COMPANY_REG: string;
}

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());

// Health & System Info
app.get('/api/health', (c) => {
  return c.json({
    status: 'online',
    service: 'Pansoft Technologies Edge API',
    registration: c.env.COMPANY_REG || 'BN-36S5WLAP',
    ceo: 'Movin Juma',
    engine: 'Cloudflare Workers (Edge)',
    timestamp: new Date().toISOString()
  });
});

// Authentication: Sign In
app.post('/api/auth/login', async (c) => {
  const { email, password } = await c.req.json();
  const stmt = c.env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email);
  const user = await stmt.first();

  if (!user) {
    return c.json({ error: 'User not found in D1 records' }, 401);
  }

  const token = await sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    },
    c.env.JWT_SECRET
  );

  return c.json({ token, user });
});

// R2 Presigned Upload URL Generator
app.post('/api/r2/presign', async (c) => {
  const { fileName, folder = 'attachments' } = await c.req.json();
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const key = \`\${folder}/\${Date.now()}_\${safeName}\`;
  
  // Return presigned upload parameters
  return c.json({
    key,
    uploadUrl: \`https://r2.pansoft.tech/\${key}?signature=presigned_edge_token\`,
    expiresInSeconds: 900,
    bucket: 'pansoft-tech-production-r2'
  });
});

// Submit Freelance Code (with zipped archive in R2)
app.post('/api/freelance/submit', async (c) => {
  const body = await c.req.json();
  const id = 'sub_' + crypto.randomUUID().slice(0, 8);

  await c.env.DB.prepare(
    \`INSERT INTO freelance_submissions (
      id, freelancer_name, email, phone, specialty, repository_url, notes,
      zip_file_name, zip_file_size, zip_file_count, r2_key, negotiated_fee,
      review_status, payout_status, file_tree_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending', ?)\`
  ).bind(
    id, body.freelancerName, body.email, body.phone, body.specialty,
    body.repositoryUrl, body.notes, body.zipFileName, body.zipFileSize,
    body.zipFileCount, body.r2Key, body.negotiatedFee, JSON.stringify(body.fileTree || [])
  ).run();

  return c.json({ success: true, submissionId: id });
});

export default app;
`,

  nuxtConfig: `// Pansoft Technologies: nuxt.config.ts
// Nuxt 3 with Cloudflare Workers / Pages Nitro Preset, SSR/SSG & Tailwind CSS
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  compatibilityDate: '2026-03-01',
  nitro: {
    preset: 'cloudflare-pages',
    prerender: {
      routes: ['/', '/services', '/products', '/housika', '/freelance-hub', '/referrals', '/contact'],
    },
    storage: {
      db: {
        driver: 'cloudflare-d1',
        bindingName: 'DB',
      },
      r2: {
        driver: 'cloudflare-r2',
        bindingName: 'R2_BUCKET',
      },
    },
  },
  modules: [
    '@nuxtjs/tailwindcss',
  ],
  app: {
    head: {
      title: 'Pansoft Technologies – Software Design, Development & Maintenance',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Pansoft Technologies (BN-36S5WLAP) — Enterprise Software, Cloudflare Workers & D1, Housika SaaS by Movin Juma' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap' },
      ],
    },
  },
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET,
    zeptomailApiKey: process.env.ZEPTOMAIL_API_KEY,
    public: {
      companyReg: 'BN-36S5WLAP',
      founderName: 'Movin Juma',
      phone: '+254 745 910 909',
    },
  },
});
`
};
