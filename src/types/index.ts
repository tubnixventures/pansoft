/**
 * Pansoft Technologies – System Type Definitions
 * Company Registration: BN-36S5WLAP
 * Founder & CEO: Movin Juma
 */

export type UserRole = 'admin' | 'client' | 'freelancer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company?: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface HonoJwtToken {
  token: string;
  payload: {
    sub: string;
    email: string;
    name: string;
    role: UserRole;
    iat: number;
    exp: number;
  };
}

export interface Inquiry {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  company: string;
  clientMode?: 'layman' | 'technical';
  projectType: string;
  budget: string;
  timeline: string;
  techStack: string[];
  description: string;
  
  // Guided Consulting & Layman Architecture Preferences
  consultingNeeds?: string[];
  preferredEmail?: string;
  preferredDatabase?: string;
  preferredCompute?: string;
  preferredCaching?: string;
  preferredCloud?: string;
  preferredMessaging?: string;
  preferredAi?: string;
  businessGoals?: string;

  r2AttachmentKey?: string;
  r2AttachmentName?: string;
  status: 'new' | 'in_review' | 'proposal_sent' | 'contract_signed';
  createdAt: string;
}

export type PartnerType = 'developer' | 'agency' | 'affiliate_promoter' | 'enterprise_collaborator';

export interface PartnershipRequest {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  partnerType: PartnerType;
  companyOrHandle?: string;
  portfolioOrGithub?: string;
  skillsOrFocus: string[];
  collaborationProposal: string;
  compensationModel: 'contract_freelance' | 'revenue_share' | 'referral_commission' | 'negotiated_split';
  inviteCodeUsed?: string;
  status: 'pending' | 'under_review' | 'approved' | 'onboarded' | 'declined';
  reviewNotes?: string;
  createdAt: string;
}

export interface InviteCode {
  code: string;
  creatorName: string;
  creatorEmail: string;
  type: 'partner' | 'referral' | 'freelancer';
  usesCount: number;
  maxUses: number;
  createdAt: string;
}

export interface FreelanceSubmission {
  id: string;
  freelancerName: string;
  email: string;
  phone: string;
  specialty: 'Full-Stack TS' | 'Cloudflare Edge & Workers' | 'Code Reviewer' | 'Paystack & Fintech' | 'QA & Automated Testing';
  repositoryUrl?: string;
  notes: string;
  zipFileName: string;
  zipFileSize: number;
  zipFileCount: number;
  r2Key: string;
  r2PresignedUrl: string;
  reviewStatus: 'pending' | 'in_review' | 'approved' | 'changes_requested';
  negotiatedFee: string;
  payoutStatus: 'pending' | 'scheduled' | 'paid';
  fileTree?: string[];
  submittedAt: string;
}

export interface Referral {
  id: string;
  referrerName: string;
  referrerEmail: string;
  referrerPhone: string;
  leadName: string;
  leadCompany: string;
  leadEmail: string;
  leadPhone?: string;
  estimatedProjectSize: string;
  negotiatedRewardRate: string; // e.g., "12% of contract" or "$1,200 milestone bonus"
  status: 'negotiating' | 'approved' | 'converted' | 'paid';
  notes?: string;
  createdAt: string;
}

export interface ZeptomailLog {
  id: string;
  toEmail: string;
  toName: string;
  subject: string;
  templateType: 'welcome' | 'inquiry_received' | 'password_reset' | 'code_review_submitted' | 'payout_processed' | 'referral_confirmed';
  status: 'delivered' | 'queued' | 'bounced';
  messageId: string;
  timestamp: string;
  bodySnippet: string;
}

export interface R2StoredFile {
  key: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  presignedUrl: string;
  uploadedAt: string;
  fileTree?: string[];
  dataBlob?: Blob;
}
