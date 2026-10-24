/**
 * Pansoft Technologies – Full-Stack Backend API Client
 * Connects frontend client and admin portals directly to the Express + D1 backend endpoints.
 */
import { Inquiry, FreelanceSubmission, Referral, ZeptomailLog, User, PartnershipRequest, InviteCode } from '../types';
import { d1 } from './d1-client';

const API_BASE = '/api';

export class BackendApiClient {
  private static async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers || {}),
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      console.warn(`[Backend API Warning] ${endpoint}:`, err);
      throw err;
    }
  }

  // System Stats
  public static async getStats() {
    try {
      return await this.request<{
        totalInquiries: number;
        pendingInquiries: number;
        freelanceSubmissions: number;
        referralDeals: number;
        zeptomailDispatches: number;
      }>('/stats');
    } catch {
      return {
        totalInquiries: d1.getInquiries().length,
        pendingInquiries: d1.getInquiries().filter(i => i.status === 'new').length,
        freelanceSubmissions: d1.getFreelanceSubmissions().length,
        referralDeals: d1.getReferrals().length,
        zeptomailDispatches: d1.getZeptomailLogs().length,
      };
    }
  }

  // Inquiries
  public static async getInquiries(): Promise<Inquiry[]> {
    try {
      const data = await this.request<{ inquiries: Inquiry[] }>('/inquiries');
      return data.inquiries;
    } catch {
      return d1.getInquiries();
    }
  }

  public static async createInquiry(payload: any): Promise<Inquiry> {
    try {
      const res = await this.request<{ success: boolean; inquiry: Inquiry }>('/inquiries', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      // Synchronize locally as well
      d1.insertInquiry(payload);
      return res.inquiry;
    } catch {
      return d1.insertInquiry(payload);
    }
  }

  public static async updateInquiryStatus(id: string, status: string, note?: string): Promise<boolean> {
    try {
      await this.request(`/inquiries/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, note }),
      });
      d1.updateInquiryStatus(id, status as any);
      return true;
    } catch {
      return d1.updateInquiryStatus(id, status as any);
    }
  }

  // Freelance
  public static async getFreelanceSubmissions(): Promise<FreelanceSubmission[]> {
    try {
      const data = await this.request<{ submissions: FreelanceSubmission[] }>('/freelance/submissions');
      return data.submissions;
    } catch {
      return d1.getFreelanceSubmissions();
    }
  }

  public static async submitFreelance(payload: any): Promise<FreelanceSubmission> {
    try {
      const res = await this.request<{ success: boolean; submission: FreelanceSubmission }>('/freelance/submit', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      d1.insertFreelanceSubmission(payload);
      return res.submission;
    } catch {
      return d1.insertFreelanceSubmission(payload);
    }
  }

  public static async reviewFreelance(id: string, reviewStatus: string, payoutStatus?: string): Promise<boolean> {
    try {
      await this.request(`/freelance/${id}/review`, {
        method: 'PUT',
        body: JSON.stringify({ reviewStatus, payoutStatus }),
      });
      d1.updateFreelanceReviewStatus(id, reviewStatus as any, payoutStatus as any);
      return true;
    } catch {
      return d1.updateFreelanceReviewStatus(id, reviewStatus as any, payoutStatus as any);
    }
  }

  // Referrals
  public static async getReferrals(): Promise<Referral[]> {
    try {
      const data = await this.request<{ referrals: Referral[] }>('/referrals');
      return data.referrals;
    } catch {
      return d1.getReferrals();
    }
  }

  public static async createReferral(payload: any): Promise<Referral> {
    try {
      const res = await this.request<{ success: boolean; referral: Referral }>('/referrals', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      d1.insertReferral(payload);
      return res.referral;
    } catch {
      return d1.insertReferral(payload);
    }
  }

  public static async updateReferralStatus(id: string, status: string): Promise<boolean> {
    try {
      await this.request(`/referrals/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      d1.updateReferralStatus(id, status as any);
      return true;
    } catch {
      return d1.updateReferralStatus(id, status as any);
    }
  }

  // D1 SQL Runner
  public static async executeD1Query(query: string) {
    try {
      return await this.request<{
        columns: string[];
        rows: Record<string, unknown>[];
        executionTimeMs: number;
        rowCount: number;
      }>('/d1/query', {
        method: 'POST',
        body: JSON.stringify({ query }),
      });
    } catch {
      return d1.executeD1Query(query);
    }
  }

  // Zeptomail Logs
  public static async getZeptomailLogs(): Promise<ZeptomailLog[]> {
    try {
      const data = await this.request<{ logs: ZeptomailLog[] }>('/zeptomail/logs');
      return data.logs;
    } catch {
      return d1.getZeptomailLogs();
    }
  }

  // Partnerships Management (Developer & Agency Co-Building)
  public static async getPartnerships(): Promise<PartnershipRequest[]> {
    try {
      const data = await this.request<{ partnerships: PartnershipRequest[] }>('/partnerships');
      return data.partnerships;
    } catch {
      return d1.getPartnerships();
    }
  }

  public static async createPartnership(payload: Omit<PartnershipRequest, 'id' | 'createdAt' | 'status'>): Promise<PartnershipRequest> {
    try {
      const res = await this.request<{ success: boolean; partnership: PartnershipRequest }>('/partnerships', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      d1.insertPartnership(payload);
      return res.partnership;
    } catch {
      return d1.insertPartnership(payload);
    }
  }

  public static async updatePartnershipStatus(id: string, status: PartnershipRequest['status'], reviewNotes?: string): Promise<boolean> {
    try {
      await this.request(`/partnerships/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, reviewNotes }),
      });
      d1.updatePartnershipStatus(id, status, reviewNotes);
      return true;
    } catch {
      return d1.updatePartnershipStatus(id, status, reviewNotes);
    }
  }

  // Invite Codes
  public static async getInviteCodes(): Promise<InviteCode[]> {
    try {
      const data = await this.request<{ codes: InviteCode[] }>('/invites');
      return data.codes;
    } catch {
      return d1.getInviteCodes();
    }
  }

  public static async generateInviteCode(type: InviteCode['type'], creatorName: string, creatorEmail: string, maxUses: number = 10): Promise<InviteCode> {
    try {
      const res = await this.request<{ success: boolean; invite: InviteCode }>('/invites/generate', {
        method: 'POST',
        body: JSON.stringify({ type, creatorName, creatorEmail, maxUses }),
      });
      return res.invite;
    } catch {
      return d1.createInviteCode(type, creatorName, creatorEmail, maxUses);
    }
  }

  public static async verifyInviteCode(code: string): Promise<{ valid: boolean; message: string; invite?: InviteCode }> {
    try {
      return await this.request<{ valid: boolean; message: string; invite?: InviteCode }>('/invites/verify', {
        method: 'POST',
        body: JSON.stringify({ code }),
      });
    } catch {
      return d1.validateInviteCode(code);
    }
  }
}
