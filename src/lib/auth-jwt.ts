/**
 * Pansoft Technologies – Hono / JWT Authentication Engine
 * Emulates Hono framework JWT sign & verify with HS256 algorithm.
 * Manages active user sessions, role-based access control, and password recovery.
 */
import { User, HonoJwtToken } from '../types';
import { d1 } from './d1-client';
import { zeptomail } from './zeptomail-client';

const JWT_SECRET = 'pansoft_edge_secret_key_prod_831';
const SESSION_STORAGE_KEY = 'pansoft_auth_jwt_token';

// Simple edge-compatible base64url encode/decode
function base64UrlEncode(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str: string): string {
  let output = str.replace(/-/g, '+').replace(/_/g, '/');
  switch (output.length % 4) {
    case 0: break;
    case 2: output += '=='; break;
    case 3: output += '='; break;
    default: throw new Error('Illegal base64url string!');
  }
  return decodeURIComponent(escape(atob(output)));
}

export class HonoJwtAuthService {
  /**
   * Signs a JWT compliant with Hono edge middleware
   */
  public static sign(user: User): HonoJwtToken {
    const header = { alg: 'HS256', typ: 'JWT' };
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 60 * 24 * 7; // 7 days

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      iat,
      exp,
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));
    
    // Simulate HMAC SHA256 signature
    const signatureRaw = `${encodedHeader}.${encodedPayload}.${JWT_SECRET}`;
    const signature = base64UrlEncode(signatureRaw).slice(0, 43);

    const token = `${encodedHeader}.${encodedPayload}.${signature}`;

    return { token, payload };
  }

  /**
   * Verifies and decodes a Hono JWT token
   */
  public static verify(token: string): HonoJwtToken['payload'] | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payloadStr = base64UrlDecode(parts[1]);
      const payload = JSON.parse(payloadStr);

      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        return null; // Expired
      }

      return payload;
    } catch {
      return null;
    }
  }

  public static getSessionToken(): string | null {
    try {
      return localStorage.getItem(SESSION_STORAGE_KEY);
    } catch {
      return null;
    }
  }

  public static getCurrentUser(): User | null {
    const token = this.getSessionToken();
    if (!token) return null;

    const payload = this.verify(token);
    if (!payload) return null;

    const user = d1.getUserById(payload.sub);
    return user || null;
  }

  public static login(email: string): { user: User; token: string } {
    let user = d1.getUserByEmail(email);
    if (!user) {
      // Auto-provision if demo login
      user = d1.insertUser({
        email,
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        role: email.includes('admin') || email.includes('movin') ? 'admin' : 'client',
        company: 'Partner Client Ltd',
        phone: '+254745910909',
      });
    }

    const { token } = this.sign(user);
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, token);
    } catch (e) {
      console.error(e);
    }

    return { user, token };
  }

  public static register(params: {
    name: string;
    email: string;
    role: 'client' | 'freelancer' | 'admin';
    company?: string;
    phone?: string;
  }): { user: User; token: string } {
    const existing = d1.getUserByEmail(params.email);
    if (existing) {
      throw new Error('An account with this email already exists in Pansoft D1 database.');
    }

    const user = d1.insertUser({
      name: params.name,
      email: params.email,
      role: params.role,
      company: params.company || (params.role === 'freelancer' ? 'Independent Contractor' : 'Client Organization'),
      phone: params.phone || '',
    });

    const { token } = this.sign(user);
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, token);
    } catch (e) {
      console.error(e);
    }

    // Dispatch Zeptomail Welcome Email
    zeptomail.sendTransactionalEmail({
      toEmail: user.email,
      toName: user.name,
      templateType: 'welcome',
      subject: `Welcome to Pansoft Technologies – Account Provisioned (${user.role.toUpperCase()})`,
      variables: {
        userName: user.name,
        role: user.role,
        portalUrl: 'https://pansoft.tech/portal',
      },
    });

    return { user, token };
  }

  public static logout(): void {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  }

  public static requestPasswordReset(email: string): string {
    const user = d1.getUserByEmail(email);
    if (!user) {
      throw new Error('No account found with this email in Pansoft D1 records.');
    }

    const resetToken = d1.createResetToken(email);

    // Send reset code via Zeptomail
    zeptomail.sendTransactionalEmail({
      toEmail: user.email,
      toName: user.name,
      templateType: 'password_reset',
      subject: 'Pansoft Technologies – D1 Account Password Reset Request',
      variables: {
        resetToken,
        userName: user.name,
      },
    });

    return resetToken;
  }

  public static resetPassword(token: string): boolean {
    const email = d1.verifyAndConsumeResetToken(token);
    if (!email) {
      throw new Error('Invalid or expired reset token. Please request a new token.');
    }
    return true;
  }
}
