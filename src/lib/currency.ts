/**
 * Pansoft Technologies – East African Currency Utility
 * Specialized for Kenya (KES - Primary), Tanzania (TZS), Uganda (UGX),
 * Rwanda (RWF), Burundi (BIF), Ethiopia (ETB), and International (USD).
 */

export type EastAfricanCurrency = 'KES' | 'TZS' | 'UGX' | 'RWF' | 'BIF' | 'ETB' | 'USD';

export interface CurrencyConfig {
  code: EastAfricanCurrency;
  symbol: string;
  name: string;
  country: string;
  flag: string;
  ratePerKes: number; // 1 KES = X currency
  decimalPlaces: number;
}

export const EAST_AFRICAN_CURRENCIES: Record<EastAfricanCurrency, CurrencyConfig> = {
  KES: {
    code: 'KES',
    symbol: 'KSh',
    name: 'Kenyan Shilling',
    country: 'Kenya',
    flag: '🇰🇪',
    ratePerKes: 1.0,
    decimalPlaces: 0,
  },
  TZS: {
    code: 'TZS',
    symbol: 'TSh',
    name: 'Tanzanian Shilling',
    country: 'Tanzania',
    flag: '🇹🇿',
    ratePerKes: 20.2,
    decimalPlaces: 0,
  },
  UGX: {
    code: 'UGX',
    symbol: 'USh',
    name: 'Ugandan Shilling',
    country: 'Uganda',
    flag: '🇺🇬',
    ratePerKes: 28.5,
    decimalPlaces: 0,
  },
  RWF: {
    code: 'RWF',
    symbol: 'FRw',
    name: 'Rwandan Franc',
    country: 'Rwanda',
    flag: '🇷🇼',
    ratePerKes: 10.6,
    decimalPlaces: 0,
  },
  BIF: {
    code: 'BIF',
    symbol: 'FBu',
    name: 'Burundian Franc',
    country: 'Burundi',
    flag: '🇧🇮',
    ratePerKes: 22.4,
    decimalPlaces: 0,
  },
  ETB: {
    code: 'ETB',
    symbol: 'Br',
    name: 'Ethiopian Birr',
    country: 'Ethiopia',
    flag: '🇪🇹',
    ratePerKes: 0.96,
    decimalPlaces: 0,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    country: 'International',
    flag: '🌐',
    ratePerKes: 1 / 130, // 1 USD ≈ 130 KES
    decimalPlaces: 0,
  },
};

/**
 * Convert an amount from KES to the target currency
 */
export function convertFromKes(amountKes: number, targetCurrency: EastAfricanCurrency): number {
  const config = EAST_AFRICAN_CURRENCIES[targetCurrency];
  if (!config) return amountKes;
  return amountKes * config.ratePerKes;
}

/**
 * Format an amount in the specified East African currency
 */
export function formatCurrency(amountKes: number, currency: EastAfricanCurrency = 'KES'): string {
  const config = EAST_AFRICAN_CURRENCIES[currency];
  const converted = convertFromKes(amountKes, currency);
  
  if (currency === 'USD') {
    return `$${Math.round(converted).toLocaleString()}`;
  }

  const rounded = Math.round(converted);
  return `${config.symbol} ${rounded.toLocaleString()}`;
}

/**
 * Budget options in East African context (base is KES)
 */
export interface BudgetTier {
  id: string;
  label: string;
  baseKesMin: number;
  baseKesMax: number;
  description: string;
}

export const EAST_AFRICAN_BUDGET_TIERS: BudgetTier[] = [
  {
    id: 'starter',
    label: 'KSh 35,000 – KSh 100,000',
    baseKesMin: 35000,
    baseKesMax: 100000,
    description: 'MVP, Webhook/Payment setup, or single-service edge migration',
  },
  {
    id: 'growth',
    label: 'KSh 100,000 – KSh 350,000',
    baseKesMin: 100000,
    baseKesMax: 350000,
    description: 'Full-stack SaaS module, Paystack integration, or database optimization',
  },
  {
    id: 'scale',
    label: 'KSh 350,000 – KSh 1,200,000',
    baseKesMin: 350000,
    baseKesMax: 1200000,
    description: 'Complete Housika white-label clone, multi-tenant portal, or multi-cloud cluster',
  },
  {
    id: 'enterprise',
    label: 'KSh 1,200,000+ (Enterprise Custom)',
    baseKesMin: 1200000,
    baseKesMax: 5000000,
    description: 'Mission-critical fintech engine, 24/7 dedicated engineering sprint team',
  },
  {
    id: 'consulting_hourly',
    label: 'Consulting Sprint (As Negotiated)',
    baseKesMin: 25000,
    baseKesMax: 80000,
    description: 'Targeted architectural review, code auditing, or tech stack selection session',
  },
];
