/**
 * Pansoft Technologies – Products & In-House SaaS View
 * Deep dive into Housika (House Rental Marketplace with Paystack) and Pansoft Ops Engine.
 * Features an interactive Paystack payment checkout simulator!
 */
import React, { useState } from 'react';
import { Check, ShieldCheck, Home, ArrowRight, X } from 'lucide-react';
import { zeptomail } from '../lib/zeptomail-client';

interface ProductsViewProps {
  setActiveTab: (tab: string) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({ setActiveTab }) => {
  const [showPaystackModal, setShowPaystackModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<{
    title: string;
    location: string;
    amount: number;
    currency: string;
  } | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const sampleProperties = [
    {
      id: 'prop_01',
      title: 'Modern 3-Bedroom Penthouse with Panoramic Balcony',
      location: 'Kilimani, Nairobi',
      priceMonthly: 'KES 85,000 / month',
      amount: 85000,
      currency: 'KES',
      type: 'Penthouse',
      bedrooms: 3,
      verified: true,
      tag: 'Featured Listing',
    },
    {
      id: 'prop_02',
      title: 'Executive Studio Apartment with Dedicated Workspace',
      location: 'Westlands, Nairobi',
      priceMonthly: 'KES 45,000 / month',
      amount: 45000,
      currency: 'KES',
      type: 'Studio',
      bedrooms: 1,
      verified: true,
      tag: 'High Demand',
    },
    {
      id: 'prop_03',
      title: 'Serene 2-Bedroom Garden Duplex in Gated Community',
      location: 'Lavington, Nairobi',
      priceMonthly: 'KES 65,000 / month',
      amount: 65000,
      currency: 'KES',
      type: 'Duplex',
      bedrooms: 2,
      verified: true,
      tag: 'Verified Host',
    },
  ];

  const handleOpenPaystack = (property: typeof sampleProperties[0]) => {
    setSelectedProperty(property);
    setPaymentSuccess(false);
    setShowPaystackModal(true);
  };

  const handleSimulatePayment = () => {
    if (!selectedProperty) return;
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
      // Trigger transactional email
      zeptomail.sendTransactionalEmail({
        toEmail: 'movin@pansoft.tech',
        toName: 'Movin Juma (Pansoft CEO)',
        subject: `[Housika Demo] Paystack Transaction Settled: ${selectedProperty.title}`,
        templateType: 'inquiry_received',
        variables: {
          projectType: `Housika Rental Booking (${selectedProperty.currency} ${selectedProperty.amount.toLocaleString()})`,
          budget: `Paid via Paystack Gateway (KES ${selectedProperty.amount.toLocaleString()})`,
        },
      });
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-20">
      
      {/* 1. Products Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
          <span>In-House Software & SaaS</span>
          <span aria-hidden="true">·</span>
          <span>Pansoft Technologies</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
          Housika & Internal Software Operations
        </h1>
        <p className="text-slate-300 text-base leading-relaxed">
          In addition to bespoke client engineering, Pansoft Technologies designs, operates, and scales proprietary SaaS platforms. These products streamline internal software operations and provide customer-facing dashboards that power mission-critical businesses.
        </p>
      </div>

      {/* 2. Flagship: Housika House Rental Marketplace */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 sm:p-12 space-y-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold tracking-wide">
              <span>Flagship Product</span>
              <span aria-hidden="true">·</span>
              <span>PropTech & Fintech</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Housika — The House Rental Marketplace Powered by Paystack
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed">
              Housika resolves the friction in rental property leasing across high-growth urban hubs. Built entirely on our Cloudflare edge architecture, it connects verified tenants directly with property owners and institutional landlords.
            </p>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Paystack Multi-Party Escrow:</strong> Tenant holding deposits are securely escrowed and released to landlords upon verified move-in verification.</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span><strong>Instant Edge Search (D1):</strong> Sub-15ms filtered rental queries across price, location, bedrooms, and amenities with zero database cold starts.</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span><strong>Cloudflare R2 Digital Leases:</strong> Automated PDF tenancy agreements generated, cryptographically signed, and archived in zero-egress R2 storage.</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => handleOpenPaystack(sampleProperties[0])}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-blue-600/20"
              >
                <CreditCardIcon className="w-4 h-4" />
                <span>Launch Paystack Demo Checkout</span>
              </button>
              <button
                onClick={() => setActiveTab('inquire')}
                className="px-4 py-2.5 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Inquire For White-Label Deployment →
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
              <img
                src="/src/assets/images/housika_saas_platform_1792856276944.jpg"
                alt="Housika SaaS house rental dashboard interface showing apartment listings and Paystack payment modal"
                referrerPolicy="no-referrer"
                className="w-full h-[360px] object-cover"
              />
              <div className="p-4 bg-slate-950/90 border-t border-slate-800 text-xs flex items-center justify-between">
                <span className="text-slate-400">Integrated: Paystack API Gateway · Card · M-Pesa · Transfer</span>
                <span className="font-mono text-emerald-400">99.99% Webhook Success</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Marketplace Interactive Property Strips */}
        <div className="space-y-4 pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-white">Interactive Housika Property Listings (Demo)</div>
            <span className="text-xs text-slate-400">Click any property to test Paystack checkout modal</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleProperties.map((prop) => (
              <div
                key={prop.id}
                className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{prop.location}</span>
                    <span className="text-blue-400 font-medium">{prop.tag}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {prop.title}
                  </h4>
                  <div className="text-xs text-slate-400">
                    {prop.bedrooms} Bed · Verified Landlord · Instant Booking
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold font-mono text-white">{prop.priceMonthly}</div>
                    <div className="text-[10px] text-slate-400">Powered by Paystack</div>
                  </div>
                  <button
                    onClick={() => handleOpenPaystack(prop)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-blue-600 text-slate-200 hover:text-white border border-slate-800 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Test Pay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* 3. In-House SaaS: Pansoft Ops Engine */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 sm:p-12 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold uppercase tracking-wider">
              <span>Internal Operations SaaS</span>
              <span aria-hidden="true">·</span>
              <span>Proprietary Tooling</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Pansoft Ops Engine — Streamlining Internal Operations & Dashboards
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              To deliver speed and precision, we engineered Pansoft Ops Engine. It handles our internal development orchestration: tracking freelance engineer sprints, queuing pull request code reviews, verifying Cloudflare R2 zip artifacts, and automating developer payouts.
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs text-slate-300 pt-2">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-white mb-1">Freelance Sprint Dispatcher</div>
                <div className="text-slate-400">Assigns and manages freelance code reviews during peak days with automated escrow tracking.</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-white mb-1">Zeptomail Notification Hub</div>
                <div className="text-slate-400">Dispatches real-time transactional alerts to clients and freelancers with sub-second delivery.</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-3">
              <span>PANSOFT_OPS_METRICS</span>
              <span className="text-emerald-400">EDGE_ONLINE</span>
            </div>
            <div className="space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Active Microservices:</span>
                <span className="text-white">14 Global Endpoints</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cloudflare D1 Storage:</span>
                <span className="text-white">Encrypted Distributed SQLite</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cloudflare R2 Bucket:</span>
                <span className="text-white">Zero-Egress Object Store</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Paystack Webhooks:</span>
                <span className="text-emerald-400">100% Idempotent</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Prompt Payout Guarantee:</span>
                <span className="text-blue-400">Enforced by Contract</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Paystack Checkout Simulator Modal */}
      {showPaystackModal && selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                  P
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Paystack Checkout (Housika)</div>
                  <div className="text-[10px] text-slate-400">Secured with 256-bit SSL Encryption</div>
                </div>
              </div>
              <button
                onClick={() => setShowPaystackModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {paymentSuccess ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">Payment Successful</h3>
                  <p className="text-xs text-slate-300">
                    Paystack transaction reference <span className="font-mono text-blue-400">pstk_tx_{Math.random().toString(36).substring(2, 9)}</span> settled.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    A Zeptomail transactional receipt has been dispatched to operations and recorded in Cloudflare D1.
                  </p>
                </div>
                <button
                  onClick={() => setShowPaystackModal(false)}
                  className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Close & Return
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-xs font-semibold text-white">{selectedProperty.title}</div>
                  <div className="text-[11px] text-slate-400">{selectedProperty.location}</div>
                  <div className="text-base font-bold font-mono text-emerald-400 pt-1">
                    {selectedProperty.currency} {selectedProperty.amount.toLocaleString()}
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <label className="text-slate-300 font-medium">Customer Email</label>
                  <input
                    type="email"
                    readOnly
                    value="tenant.client@pansoft.tech"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono"
                  />
                </div>

                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                  <div>• Supports M-Pesa, Visa, Mastercard, Bank Transfer</div>
                  <div>• Automated Paystack webhook will verify transaction at edge</div>
                </div>

                <button
                  onClick={handleSimulatePayment}
                  disabled={isProcessingPayment}
                  className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  {isProcessingPayment ? (
                    <span>Processing with Paystack Gateway...</span>
                  ) : (
                    <span>Confirm & Pay {selectedProperty.currency} {selectedProperty.amount.toLocaleString()}</span>
                  )}
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

function CreditCardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}
