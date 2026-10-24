/**
 * Pansoft Technologies – Freelance Hub & Code Review Portal
 * Implements JSZip client-side bundling, Cloudflare R2 presigned storage,
 * and transparent negotiated payout tracking with guaranteed on-time settlement.
 */
import React, { useState } from 'react';
import { Archive, Upload, FileCode, CheckCircle, Clock, Plus, Trash2, ArrowUpRight, FolderGit2 } from 'lucide-react';
import { r2 } from '../lib/r2-client';
import { d1 } from '../lib/d1-client';
import { zeptomail } from '../lib/zeptomail-client';
import { BackendApiClient } from '../lib/api-client';
import { freelanceSubmissionSchema, FreelanceSubmissionInput } from '../lib/validation';
import { FreelanceSubmission } from '../types';

export const FreelanceHubView: React.FC = () => {
  const [submissions, setSubmissions] = useState<FreelanceSubmission[]>(d1.getFreelanceSubmissions());
  
  // File bundling state
  const [bundleFiles, setBundleFiles] = useState<Array<{ name: string; content: string }>>([
    {
      name: 'src/worker/middleware/auth-check.ts',
      content: `import { Context, Next } from 'hono';\nimport { verify } from 'hono/jwt';\n\nexport async function edgeAuthMiddleware(c: Context, next: Next) {\n  const authHeader = c.req.header('Authorization');\n  if (!authHeader?.startsWith('Bearer ')) {\n    return c.json({ error: 'Missing or malformed Authorization header' }, 401);\n  }\n  const token = authHeader.substring(7);\n  const payload = await verify(token, c.env.JWT_SECRET);\n  c.set('jwtPayload', payload);\n  await next();\n}`,
    },
    {
      name: 'tests/auth-check.test.ts',
      content: `import { describe, it, expect } from 'vitest';\n\ndescribe('edgeAuthMiddleware', () => {\n  it('rejects unauthorized requests with 401', async () => {\n    // Automated test assertions\n    expect(true).toBe(true);\n  });\n});`,
    },
  ]);

  const [archiveResult, setArchiveResult] = useState<{
    blob: Blob;
    fileName: string;
    fileCount: number;
    fileList: string[];
    size: number;
  } | null>(null);

  const [formInput, setFormInput] = useState<FreelanceSubmissionInput>({
    freelancerName: '',
    email: '',
    phone: '',
    specialty: 'Code Reviewer',
    repositoryUrl: '',
    notes: '',
    negotiatedFee: '$350.00 USD (Negotiated Code Review Rate)',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isZipping, setIsZipping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<FreelanceSubmission | null>(null);

  // Add a new file to the zip bundle
  const handleAddFile = () => {
    setBundleFiles([
      ...bundleFiles,
      {
        name: `src/component-${bundleFiles.length + 1}.ts`,
        content: `// Type-safe implementation for review\nexport const reviewModule = () => {};`,
      },
    ]);
  };

  const handleUpdateFileName = (idx: number, name: string) => {
    const updated = [...bundleFiles];
    updated[idx].name = name;
    setBundleFiles(updated);
  };

  const handleUpdateFileContent = (idx: number, content: string) => {
    const updated = [...bundleFiles];
    updated[idx].content = content;
    setBundleFiles(updated);
  };

  const handleRemoveFile = (idx: number) => {
    setBundleFiles(bundleFiles.filter((_, i) => i !== idx));
  };

  // Generate ZIP using JSZip
  const handleCreateZip = async () => {
    if (bundleFiles.length === 0) {
      alert('Please add at least one file to compress into the review archive.');
      return;
    }
    setIsZipping(true);
    try {
      const result = await r2.createZipArchive(
        bundleFiles,
        `pansoft-review-${formInput.specialty.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}.zip`
      );
      setArchiveResult(result);
    } catch (err) {
      console.error(err);
      alert('Failed to compress code files.');
    } finally {
      setIsZipping(false);
    }
  };

  // Handle final submission to Cloudflare R2 + D1
  const handleSubmitToR2AndD1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const valResult = freelanceSubmissionSchema.safeParse(formInput);
    if (!valResult.success) {
      const errMap: Record<string, string> = {};
      valResult.error.issues.forEach((err) => {
        if (err.path[0]) errMap[err.path[0] as string] = err.message;
      });
      setErrors(errMap);
      return;
    }

    if (!archiveResult) {
      alert('Please click "Bundle Files into ZIP Archive" before submitting to Cloudflare R2.');
      return;
    }

    setIsUploading(true);

    try {
      // 1. Generate presigned Cloudflare R2 URL
      const presign = r2.generatePresignedUploadUrl(archiveResult.fileName, 'submissions/freelance');

      // 2. Upload zip archive blob to Cloudflare R2
      await r2.uploadToR2(
        presign.key,
        archiveResult.blob,
        archiveResult.fileName,
        presign.uploadUrl,
        archiveResult.fileList
      );

      // 3. Insert record in Cloudflare D1 and Full-stack backend
      const submissionData = {
        freelancerName: formInput.freelancerName,
        email: formInput.email,
        phone: formInput.phone,
        specialty: formInput.specialty,
        repositoryUrl: formInput.repositoryUrl,
        notes: formInput.notes,
        zipFileName: archiveResult.fileName,
        zipFileSize: archiveResult.size,
        zipFileCount: archiveResult.fileCount,
        r2Key: presign.key,
        r2PresignedUrl: presign.uploadUrl,
        negotiatedFee: formInput.negotiatedFee,
        fileTree: archiveResult.fileList,
      };

      const created = d1.insertFreelanceSubmission(submissionData);
      try {
        await BackendApiClient.submitFreelance(submissionData);
      } catch (err) {
        console.warn('Backend sync warning:', err);
      }

      // 4. Dispatch transactional email via Zeptomail
      zeptomail.sendTransactionalEmail({
        toEmail: formInput.email,
        toName: formInput.freelancerName,
        subject: `Pansoft Freelance Hub: Code Submission Received (${archiveResult.fileName})`,
        templateType: 'code_review_submitted',
        variables: {
          zipName: archiveResult.fileName,
          fee: formInput.negotiatedFee,
        },
      });

      setSubmissionSuccess(created);
      setSubmissions(d1.getFreelanceSubmissions());
      setArchiveResult(null);
    } catch (err) {
      console.error(err);
      alert('An error occurred during Cloudflare R2 upload.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      
      {/* 1. Policy & Value Proposition Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
          <span>Freelance Hub & Code Review</span>
          <span aria-hidden="true">·</span>
          <span>Guaranteed Prompt Payouts</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
          Peak-Capacity Engineering & Code Review Network
        </h1>
        <p className="text-slate-300 text-base leading-relaxed">
          Pansoft Technologies hires independent software engineers and code reviewers during peak project cycles. We respect engineering labor: <strong>all rates are as per negotiated agreement, and we guarantee prompt, on-time payments</strong> upon approved deliverables.
        </p>
      </div>

      {/* 2. Guaranteed Policies Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">01. On-Time Settlement</div>
          <div className="text-sm font-bold text-white">Prompt Payments Enforced</div>
          <div className="text-xs text-slate-400 leading-relaxed">
            Approved freelance submissions are settled promptly upon code review completion via bank or mobile money.
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">02. Transparent Rates</div>
          <div className="text-sm font-bold text-white">Negotiated Fee Structure</div>
          <div className="text-xs text-slate-400 leading-relaxed">
            Every task has a clear scope and mutually agreed compensation before work begins.
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">03. Secure R2 Zipping</div>
          <div className="text-sm font-bold text-white">Cloudflare R2 Object Store</div>
          <div className="text-xs text-slate-400 leading-relaxed">
            Code files are zipped client-side and uploaded directly via presigned URLs to zero-egress Cloudflare R2.
          </div>
        </div>
      </div>

      {/* 3. Interactive Code Submission & Zipping Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Multi-File Code Editor & JSZip Bundler */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Code File Stager & JSZip Bundler</h2>
              <p className="text-xs text-slate-400">Add implementation files or patch diffs to compress into a review bundle.</p>
            </div>
            <button
              onClick={handleAddFile}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-blue-400" />
              <span>Add File</span>
            </button>
          </div>

          <div className="space-y-4">
            {bundleFiles.map((file, idx) => (
              <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/60 border-b border-slate-800/80">
                  <div className="flex items-center gap-2 flex-1 mr-3">
                    <FileCode className="w-4 h-4 text-blue-400 shrink-0" />
                    <input
                      type="text"
                      value={file.name}
                      onChange={(e) => handleUpdateFileName(idx, e.target.value)}
                      className="bg-transparent text-xs font-mono text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1.5 py-0.5 w-full"
                      placeholder="filepath/filename.ts"
                    />
                  </div>
                  {bundleFiles.length > 1 && (
                    <button
                      onClick={() => handleRemoveFile(idx)}
                      className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Remove file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <textarea
                  rows={4}
                  value={file.content}
                  onChange={(e) => handleUpdateFileContent(idx, e.target.value)}
                  className="w-full p-3 bg-slate-950 text-xs font-mono text-slate-300 focus:outline-none resize-y selection:bg-blue-600"
                  placeholder="// Paste file contents or test assertions here..."
                />
              </div>
            ))}
          </div>

          {/* Zipping Action Bar */}
          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-center sm:text-left">
              <div className="text-xs font-semibold text-white">Compress Deliverable</div>
              <div className="text-[11px] text-slate-400">
                Bundles {bundleFiles.length} file{bundleFiles.length > 1 ? 's' : ''} using JSZip DEFLATE level 9 compression.
              </div>
            </div>
            <button
              onClick={handleCreateZip}
              disabled={isZipping}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer whitespace-nowrap shadow-md shadow-blue-600/20"
            >
              <Archive className="w-4 h-4" />
              <span>{isZipping ? 'Compressing Bundle...' : 'Bundle into ZIP Archive'}</span>
            </button>
          </div>

          {/* Compressed ZIP Inspection Details */}
          {archiveResult && (
            <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-300">ZIP Archive Generated & Verified</span>
                </div>
                <span className="text-xs font-mono text-slate-400">{(archiveResult.size / 1024).toFixed(1)} KB</span>
              </div>
              <div className="text-xs font-mono text-slate-300 bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 space-y-1">
                <div className="text-slate-400">Archive: {archiveResult.fileName}</div>
                <div className="text-slate-400">Files ({archiveResult.fileCount}):</div>
                <ul className="pl-4 list-disc text-slate-200">
                  {archiveResult.fileList.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
              <p className="text-[11px] text-slate-400">
                Ready for presigned Cloudflare R2 upload. Complete the details on the right to finalize submission.
              </p>
            </div>
          )}

        </div>

        {/* Right Column: Submission Details & Negotiated Rate */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handleSubmitToR2AndD1}
            className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-5"
          >
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Freelancer Submission Details</h3>
              <p className="text-xs text-slate-400">Registers submission in Cloudflare D1 and archives in R2.</p>
            </div>

            {submissionSuccess && (
              <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800 text-xs text-blue-200 space-y-1">
                <div className="font-semibold text-white">Submission Stored Successfully</div>
                <div>ID: <span className="font-mono">{submissionSuccess.id}</span></div>
                <div>R2 Object: <span className="font-mono">{submissionSuccess.zipFileName}</span></div>
                <div>A confirmation email was dispatched via Zeptomail to {submissionSuccess.email}.</div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Full Name</label>
              <input
                type="text"
                value={formInput.freelancerName}
                onChange={(e) => setFormInput({ ...formInput, freelancerName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                placeholder="e.g. David Omondi"
              />
              {errors.freelancerName && <p className="text-[11px] text-rose-400">{errors.freelancerName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Email Address</label>
                <input
                  type="email"
                  value={formInput.email}
                  onChange={(e) => setFormInput({ ...formInput, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  placeholder="name@gmail.com"
                />
                {errors.email && <p className="text-[11px] text-rose-400">{errors.email}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Phone (Payouts)</label>
                <input
                  type="tel"
                  value={formInput.phone}
                  onChange={(e) => setFormInput({ ...formInput, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  placeholder="07... or +254..."
                />
                {errors.phone && <p className="text-[11px] text-rose-400">{errors.phone}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Engineering Specialty</label>
              <select
                value={formInput.specialty}
                onChange={(e) => setFormInput({ ...formInput, specialty: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Code Reviewer">Code Reviewer (Peer Review & Security)</option>
                <option value="Full-Stack TS">Full-Stack TypeScript & Node.js</option>
                <option value="Cloudflare Edge & Workers">Cloudflare Edge & Workers</option>
                <option value="Paystack & Fintech">Paystack & Financial Platform</option>
                <option value="QA & Automated Testing">QA & Automated Testing</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Negotiated Rate / Agreed Fee</label>
              <input
                type="text"
                value={formInput.negotiatedFee}
                onChange={(e) => setFormInput({ ...formInput, negotiatedFee: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                placeholder="e.g. $350.00 USD (As per negotiated agreement)"
              />
              <p className="text-[10px] text-slate-400">All freelance work is compensated as per negotiated agreement.</p>
              {errors.negotiatedFee && <p className="text-[11px] text-rose-400">{errors.negotiatedFee}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Git Repository Link (Optional)</label>
              <input
                type="url"
                value={formInput.repositoryUrl}
                onChange={(e) => setFormInput({ ...formInput, repositoryUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                placeholder="https://github.com/..."
              />
              {errors.repositoryUrl && <p className="text-[11px] text-rose-400">{errors.repositoryUrl}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Review Notes & Test Instructions</label>
              <textarea
                rows={3}
                value={formInput.notes}
                onChange={(e) => setFormInput({ ...formInput, notes: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
                placeholder="Explain what was implemented, edge cases addressed, and test commands..."
              />
              {errors.notes && <p className="text-[11px] text-rose-400">{errors.notes}</p>}
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/25"
            >
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'Presigning & Uploading to R2...' : 'Submit Code to Cloudflare R2'}</span>
            </button>
          </form>
        </div>

      </div>

      {/* 4. Live Freelance Submissions & Payout Status Board */}
      <div className="space-y-4 pt-8 border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-white">Active Freelance Review & Payout Tracker</h2>
            <p className="text-xs text-slate-400">Live records retrieved directly from Cloudflare D1 distributed database.</p>
          </div>
          <div className="text-xs text-emerald-400 font-mono">
            Guaranteed On-Time Payout Policy
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/30 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3">Freelancer</th>
                <th className="px-5 py-3">Specialty</th>
                <th className="px-5 py-3">R2 Archive (ZIP)</th>
                <th className="px-5 py-3">Negotiated Fee</th>
                <th className="px-5 py-3">Review Status</th>
                <th className="px-5 py-3">Payout Status</th>
                <th className="px-5 py-3">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white">{sub.freelancerName}</div>
                    <div className="text-[11px] text-slate-400">{sub.email}</div>
                  </td>
                  <td className="px-5 py-4 font-mono text-[11px] text-slate-300">
                    {sub.specialty}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 font-mono text-blue-400">
                      <Archive className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[160px]">{sub.zipFileName}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {(sub.zipFileSize / 1024).toFixed(1)} KB · {sub.zipFileCount} files
                    </div>
                  </td>
                  <td className="px-5 py-4 font-medium text-white">
                    {sub.negotiatedFee}
                  </td>
                  <td className="px-5 py-4">
                    {sub.reviewStatus === 'approved' && (
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Approved
                      </span>
                    )}
                    {sub.reviewStatus === 'in_review' && (
                      <span className="text-amber-400 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> In Review
                      </span>
                    )}
                    {sub.reviewStatus === 'pending' && (
                      <span className="text-slate-400 font-medium">Pending Review</span>
                    )}
                    {sub.reviewStatus === 'changes_requested' && (
                      <span className="text-rose-400 font-medium">Changes Requested</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {sub.payoutStatus === 'paid' && (
                      <span className="text-emerald-400 font-mono font-semibold">Settled / Paid</span>
                    )}
                    {sub.payoutStatus === 'scheduled' && (
                      <span className="text-blue-400 font-mono font-semibold">Scheduled On-Time</span>
                    )}
                    {sub.payoutStatus === 'pending' && (
                      <span className="text-slate-400 font-mono">Pending Review</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-[11px] text-slate-400 font-mono">
                    {new Date(sub.submittedAt).toLocaleDateString()}
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
