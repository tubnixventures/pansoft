/**
 * Pansoft Technologies – Zod Validation Schemas
 * Type-safe runtime validations for client forms and edge API endpoints
 */
import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email('Please enter a valid work or personal email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const signUpSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(7, 'Please provide a valid contact number').optional().or(z.literal('')),
  company: z.string().optional(),
  role: z.enum(['client', 'freelancer', 'admin']).default('client'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter the email associated with your Pansoft account'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(4, 'Reset token is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string().min(6, 'Please confirm your new password'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const inquirySchema = z.object({
  clientName: z.string().min(2, 'Your name is required'),
  email: z.string().email('Valid business or personal email is required'),
  phone: z.string().min(7, 'Valid contact phone number is required'),
  company: z.string().min(2, 'Company, Organization or Name is required'),
  clientMode: z.enum(['layman', 'technical']).default('layman'),
  projectType: z.string().min(2, 'Please select your project or consultation category'),
  budget: z.string().min(2, 'Please select a targeted budget range'),
  timeline: z.string().min(2, 'Please select your estimated timeline'),
  techStack: z.array(z.string()).default([]),
  description: z.string().min(15, 'Please provide at least 15 characters describing what you want to achieve or build'),
  
  // Layman & Consulting Architectural Preferences
  consultingNeeds: z.array(z.string()).optional(),
  preferredEmail: z.string().optional(),
  preferredDatabase: z.string().optional(),
  preferredCompute: z.string().optional(),
  preferredCaching: z.string().optional(),
  preferredCloud: z.string().optional(),
  preferredMessaging: z.string().optional(),
  preferredAi: z.string().optional(),
  businessGoals: z.string().optional(),
});

export const partnershipSchema = z.object({
  applicantName: z.string().min(2, 'Your full name is required'),
  email: z.string().email('Valid email address is required'),
  phone: z.string().min(7, 'Contact phone number is required'),
  partnerType: z.enum(['developer', 'agency', 'affiliate_promoter', 'enterprise_collaborator']),
  companyOrHandle: z.string().optional(),
  portfolioOrGithub: z.string().optional(),
  skillsOrFocus: z.array(z.string()).min(1, 'Please select at least one skill or collaboration focus'),
  collaborationProposal: z.string().min(20, 'Please provide at least 20 characters describing your collaboration ideas or background'),
  compensationModel: z.enum(['contract_freelance', 'revenue_share', 'referral_commission', 'negotiated_split']).default('contract_freelance'),
  inviteCodeUsed: z.string().optional(),
});

export const freelanceSubmissionSchema = z.object({
  freelancerName: z.string().min(2, 'Freelancer full name is required'),
  email: z.string().email('Valid contact email is required'),
  phone: z.string().min(7, 'Phone number is required for payout verification'),
  specialty: z.enum([
    'Full-Stack TS',
    'Cloudflare Edge & Workers',
    'Code Reviewer',
    'Paystack & Fintech',
    'QA & Automated Testing'
  ]),
  repositoryUrl: z.string().url('Must be a valid GitHub or GitLab repository link').optional().or(z.literal('')),
  notes: z.string().min(10, 'Please include submission notes or test instructions'),
  negotiatedFee: z.string().min(1, 'Agreed fee / rate is required'),
});

export const referralSchema = z.object({
  referrerName: z.string().min(2, 'Your full name is required'),
  referrerEmail: z.string().email('Your contact email is required'),
  referrerPhone: z.string().min(7, 'Your phone number is required for reward settlement'),
  leadName: z.string().min(2, 'Prospective client name is required'),
  leadCompany: z.string().min(2, 'Prospective client company is required'),
  leadEmail: z.string().email('Prospective client email is required'),
  leadPhone: z.string().optional(),
  estimatedProjectSize: z.string().min(2, 'Please select an estimated project scale'),
  notes: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Your name is required'),
  email: z.string().email('Valid email address is required'),
  phone: z.string().min(7, 'Valid phone number is required'),
  subject: z.string().min(3, 'Subject line is required'),
  message: z.string().min(15, 'Message must be at least 15 characters long'),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type InquiryInput = z.infer<typeof inquirySchema>;
export type FreelanceSubmissionInput = z.infer<typeof freelanceSubmissionSchema>;
export type ReferralInput = z.infer<typeof referralSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type PartnershipInput = z.infer<typeof partnershipSchema>;
