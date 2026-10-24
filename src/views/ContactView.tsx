/**
 * Pansoft Technologies – Contact Us & R2 Presigned File Attachment
 * Registered: BN-36S5WLAP · Phone: 0141380666 · Founder & CEO: Movin Juma
 * Integrates Cloudflare R2 presigned upload flow for client specifications.
 */
import React, { useState } from 'react';
import { Mail, Phone, MapPin, ShieldCheck, Upload, FileCheck, CheckCircle2, Send, Paperclip } from 'lucide-react';
import { r2 } from '../lib/r2-client';
import { d1 } from '../lib/d1-client';
import { zeptomail } from '../lib/zeptomail-client';
import { contactSchema, ContactInput } from '../lib/validation';

export const ContactView: React.FC = () => {
  const [formData, setFormData] = useState<ContactInput>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPresigning, setIsPresigning] = useState(false);
  const [r2UploadedMeta, setR2UploadedMeta] = useState<{
    key: string;
    uploadUrl: string;
    fileName: string;
    fileSize: number;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Handle file attachment selection and presigned upload to R2
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsPresigning(true);

    try {
      // 1. Generate presigned URL from Cloudflare R2 service
      const presign = r2.generatePresignedUploadUrl(file.name, 'contact_attachments');

      // 2. Upload file directly to Cloudflare R2
      await r2.uploadToR2(
        presign.key,
        file,
        file.name,
        presign.uploadUrl,
        [file.name]
      );

      setR2UploadedMeta({
        key: presign.key,
        uploadUrl: presign.uploadUrl,
        fileName: file.name,
        fileSize: file.size,
      });
    } catch (err) {
      console.error(err);
      alert('Failed to generate presigned Cloudflare R2 upload URL.');
    } finally {
      setIsPresigning(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(formData);
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
      // Store inquiry in D1
      d1.insertInquiry({
        clientName: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: 'Contact Inbound',
        projectType: 'Custom Enterprise App',
        budget: 'Consultation Scope',
        timeline: 'Immediate Discovery',
        techStack: ['Direct Consultation', 'Cloudflare Edge'],
        description: `Subject: ${formData.subject}\n\n${formData.message}`,
        r2AttachmentKey: r2UploadedMeta?.key,
        r2AttachmentName: r2UploadedMeta?.fileName,
      });

      // Dispatch Zeptomail transactional alert
      zeptomail.sendTransactionalEmail({
        toEmail: formData.email,
        toName: formData.name,
        subject: `Contact Inquiry Received: ${formData.subject} – Pansoft Technologies`,
        templateType: 'inquiry_received',
        variables: {
          projectType: `Direct Inquiry: ${formData.subject}`,
          budget: r2UploadedMeta ? `Attached via R2: ${r2UploadedMeta.fileName}` : 'Direct Specification',
        },
      });

      setSubmittedSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setSelectedFile(null);
      setR2UploadedMeta(null);
    } catch (err) {
      console.error(err);
      alert('Failed to submit message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
          <span>Official Corporate Office</span>
          <span aria-hidden="true">·</span>
          <span>Reg. BN-36S5WLAP</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
          Contact Pansoft Technologies
        </h1>
        <p className="text-slate-300 text-base leading-relaxed">
          Reach our executive engineering team and CEO Movin Juma directly. Upload project briefs, software requirements, or architectural diagrams through our zero-egress Cloudflare R2 presigned upload pipeline.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Official Contact & Company Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-6">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Corporate Registration & Direct Channels
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-white">Registered Business Entity</div>
                  <div className="text-slate-400">Registration Number: <strong className="text-slate-200">BN-36S5WLAP</strong></div>
                  <div className="text-slate-400">Nature: Software Design, Development and Maintenance</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-white">Official Telephone / Line</div>
                  <div className="text-slate-200 font-mono text-sm font-bold">0141380666 / +254 141 380 666</div>
                  <div className="text-slate-400 text-[11px]">Official Corporate Contact & Technical Support</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-white">Direct Email Inquiries</div>
                  <div className="text-slate-200 font-mono">movin@pansoft.tech</div>
                  <div className="text-slate-400 text-[11px]">Monitored 24/7 by Principal Engineering Architects</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-white">Executive Leadership</div>
                  <div className="text-slate-200">Movin Juma · CEO & Founder</div>
                  <div className="text-slate-400 text-[11px]">Nairobi, Kenya · Serving Global Distributed Clients</div>
                </div>
              </div>
            </div>
          </div>

          {/* R2 Presigned Pipeline Explanation */}
          <div className="p-6 rounded-2xl bg-slate-900/20 border border-slate-800/80 space-y-3 text-xs text-slate-300">
            <div className="font-semibold text-white flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-blue-400" />
              <span>Cloudflare R2 Presigned Upload Protocol</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Files attached on this form bypass application servers and are streamed directly into our private Cloudflare R2 bucket (<code className="text-slate-300">pansoft-tech-production-r2</code>) using pre-authenticated cryptographically signed URLs.
            </p>
          </div>
        </div>

        {/* Right Column: Contact Form with R2 Upload */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-5"
          >
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Send a Message</h3>
              <p className="text-xs text-slate-400">We respond promptly to all corporate and technical inquiries.</p>
            </div>

            {submittedSuccess && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-200 space-y-1">
                <div className="font-semibold text-white">Message Dispatched & Stored in D1</div>
                <div>A confirmation email was dispatched to your inbox via Zeptomail API.</div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Movin Juma"
                />
                {errors.name && <p className="text-[11px] text-rose-400">{errors.name}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  placeholder="name@company.com"
                />
                {errors.email && <p className="text-[11px] text-rose-400">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Telephone / Mobile *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  placeholder="+254 745 910 909 or 0745..."
                />
                {errors.phone && <p className="text-[11px] text-rose-400">{errors.phone}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Subject *</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Cloudflare D1 Architecture Consultation"
                />
                {errors.subject && <p className="text-[11px] text-rose-400">{errors.subject}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Message / Inbound Brief *</label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 resize-y"
                placeholder="Describe your inquiry, requested start date, or technical questions..."
              />
              {errors.message && <p className="text-[11px] text-rose-400">{errors.message}</p>}
            </div>

            {/* Cloudflare R2 Presigned File Attachment Input */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-blue-400" />
                  <span>Attach Specifications / Architecture PDF (Cloudflare R2)</span>
                </label>
                <span className="text-[10px] text-slate-400">Presigned PUT upload</span>
              </div>

              <input
                type="file"
                onChange={handleFileChange}
                disabled={isPresigning}
                className="block w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-slate-900 file:text-blue-400 hover:file:bg-slate-800 cursor-pointer"
              />

              {isPresigning && (
                <div className="text-[11px] text-blue-400 animate-pulse">
                  Generating signed Cloudflare R2 pre-auth token & uploading...
                </div>
              )}

              {r2UploadedMeta && (
                <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-800/50 flex items-center justify-between text-xs font-mono text-slate-300">
                  <div className="flex items-center gap-2 truncate">
                    <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">{r2UploadedMeta.fileName}</span>
                    <span className="text-[10px] text-slate-400">({(r2UploadedMeta.fileSize / 1024).toFixed(1)} KB)</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 shrink-0">R2 Stored</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/25"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Recording in Cloudflare D1 & Notifying Ops...' : 'Dispatch Message to Operations'}</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
