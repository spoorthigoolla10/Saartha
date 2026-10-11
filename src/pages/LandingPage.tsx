import React, { useState } from 'react';
import { api } from '../services/api';
import { Application } from '../types';

interface LandingPageProps {
  onNavigate: (path: string) => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenAuth }) => {
  // Track ARN State
  const [trackArn, setTrackArn] = useState('ARN-2025-88412');
  const [trackDob, setTrackDob] = useState('1994-06-14');
  const [searchResult, setSearchResult] = useState<Application | null | undefined>(undefined);
  const [searchLoading, setSearchLoading] = useState(false);

  // Matrix Filter State
  const [matrixFilter, setMatrixFilter] = useState<'all' | 'fresh' | 'minor'>('all');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<string | null>('faq-1');

  const toggleFaq = (id: string) => {
    setOpenFaq(prev => (prev === id ? null : id));
  };

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchLoading(true);
    try {
      const found = await api.getApplicationByARN(trackArn);
      setSearchResult(found || null);
    } catch {
      setSearchResult(null);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-[#F8F5F2]">
      {/* Top Notification / Status Ticker */}
      <section className="w-full bg-[#F8ECE5] py-2 px-6 border-b border-[#E7DED6]">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between text-[#50453E] text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#F2E6DF] text-[#6F4E37] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6F4E37] animate-pulse"></span>
              PASSPORT SEVA SYSTEM V4.2
            </span>
            <span className="hidden md:inline text-[#756B63]">
              System Online • Public Appointment Desks Accepting Slots for Cycle R25
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden lg:flex items-center gap-1 text-[#756B63]">
              <span className="material-symbols-outlined text-[15px]">verified_user</span> 256-Bit Cryptographic Archival
            </span>
            <a
              href="#matrix-section"
              className="text-[#6F4E37] hover:underline font-semibold flex items-center gap-1"
            >
              Document Checklist 2025 <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </a>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="w-full pt-8 pb-12 bg-[#F8F5F2] px-6">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Copy & Direct CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start gap-4">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#F2E6DF] text-[#50453E] shadow-xs border border-[#E7DED6]">
              <span className="material-symbols-outlined text-[16px] text-[#6F4E37]">school</span>
              <span className="text-[11px] font-semibold tracking-wide uppercase">
                Academic Project Demo • R25 Software Engineering
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl md:text-[40px] md:leading-[48px] text-[#201A17] tracking-tight font-semibold max-w-2xl">
              Your Passport Journey, <span className="text-[#6F4E37]">Simplified</span>.
            </h1>

            {/* Subtitle */}
            <p className="text-base text-[#756B63] max-w-xl leading-relaxed">
              Experience seamless, institutional-grade passport services. Submit biometric-ready applications online,
              reserve identity verification sessions, and audit your document lifecycle in real-time.
            </p>

            {/* CTA Action Cluster */}
            <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
              <button
                onClick={() => onNavigate('new-application')}
                className="px-6 py-3 rounded-lg bg-[#6F4E37] text-white text-[13px] font-semibold shadow-md hover:bg-[#4B3621] transition-all flex items-center gap-2 group"
              >
                <span>Apply for Passport</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">
                  arrow_forward
                </span>
              </button>
              <a
                href="#status-modal"
                className="px-6 py-3 rounded-lg bg-white text-[#201A17] text-[13px] font-semibold shadow-xs border border-[#E7DED6] hover:bg-[#F8ECE5] transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px] text-[#6F4E37]">manage_search</span>
                <span>Track Application Status</span>
              </a>
            </div>

            {/* Operational Metric Cards */}
            <div className="grid grid-cols-3 gap-4 w-full pt-4 mt-2">
              <div className="bg-white p-4 rounded-xl border border-[#E7DED6] shadow-xs flex flex-col">
                <div className="flex items-center gap-1.5 text-[#6F4E37] mb-1">
                  <span className="material-symbols-outlined text-[18px]">speed</span>
                  <span className="text-xl font-bold text-[#201A17]">7 Days</span>
                </div>
                <span className="text-[11px] text-[#756B63] uppercase tracking-wider font-semibold">Avg Processing</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#E7DED6] shadow-xs flex flex-col">
                <div className="flex items-center gap-1.5 text-[#6F4E37] mb-1">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span className="text-xl font-bold text-[#201A17]">99.4%</span>
                </div>
                <span className="text-[11px] text-[#756B63] uppercase tracking-wider font-semibold">First-Pass Approval</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#E7DED6] shadow-xs flex flex-col">
                <div className="flex items-center gap-1.5 text-[#6F4E37] mb-1">
                  <span className="material-symbols-outlined text-[18px]">document_scanner</span>
                  <span className="text-xl font-bold text-[#201A17]">100%</span>
                </div>
                <span className="text-[11px] text-[#756B63] uppercase tracking-wider font-semibold">Paperless Intake</span>
              </div>
            </div>
          </div>

          {/* Right Column: Tactile Credential Mockup & Live Security Deck */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Passport Card Container */}
            <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg border border-[#E7DED6] p-6 flex flex-col gap-4">
              {/* Card Top Bar: State Seal & Microchip Indicator */}
              <div className="flex items-start justify-between pb-2 border-b border-[#E7DED6]/70">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#F8ECE5] flex items-center justify-center text-[#6F4E37]">
                    <span className="material-symbols-outlined text-[24px]">shield</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#201A17] tracking-wider uppercase">Consular Portal</p>
                    <p className="text-[11px] text-[#756B63]">Electronic Machine Readable Travel Doc</p>
                  </div>
                </div>

                {/* Biometric Chip Symbol */}
                <div className="p-1.5 rounded bg-[#F8ECE5] text-[#6F4E37]" title="ICAO Doc 9303 Compliant e-Passport">
                  <svg className="text-[#6F4E37]" fill="none" height="20" viewBox="0 0 24 20" width="24">
                    <rect height="18" rx="2" stroke="currentColor" strokeWidth="1.5" width="22" x="1" y="1" />
                    <line stroke="currentColor" strokeWidth="1.5" x1="1" x2="23" y1="10" y2="10" />
                    <circle cx="12" cy="10" fill="none" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>

              {/* Document Identity Preview Section */}
              <div className="bg-[#FEF1EA] rounded-lg p-4 flex gap-4 items-center border border-[#E7DED6]">
                <div className="relative shrink-0">
                  <img
                    className="w-20 h-24 object-cover rounded shadow-xs bg-[#ECE0DA]"
                    alt="Official biometric passport photo"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwVxczROneSTbQ2JH4gpBsqwszu6lOrlSqNMQbIrbMGOSTmRSvGXtgTL83xgTDTyuQoEDCATQXm1EnDawbESdOKOYSjaNEW6hkIYs2kuBuf-EePsVawf63rHKs0IDn-_HFyh6IWq1wLJfJrjD3G4AKYqPQmbrwZR2E023cHjDyAviuGdAqmmGJjX2pTXWj6_pBkPYh3lhYRqQe5Ep3b-GZGt04Yf84VpQ7y-TRbZNp9aMNMAtcicmoCA"
                  />
                  <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-white text-[#6F4E37] shadow-xs">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  </span>
                </div>
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <span className="text-[11px] text-[#756B63] uppercase font-semibold">Type / National Code</span>
                  <p className="text-sm font-bold text-[#201A17] font-mono tracking-tight">P • IND-R25</p>
                  <span className="text-[11px] text-[#756B63] uppercase font-semibold mt-1">Bearer Name</span>
                  <p className="text-xs font-bold text-[#201A17] truncate">VANCE, ELEANOR S.</p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="px-2 py-0.5 rounded bg-[#F2E6DF] text-[#201A17] text-[10px] font-mono font-medium">
                      VAL: 10 YRS
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#FECAA5] text-[#795336] text-[10px] font-bold">
                      TATKAAL
                    </span>
                  </div>
                </div>
              </div>

              {/* Adjudication Checklist Micro-State */}
              <div className="flex flex-col gap-1 pt-1 text-xs">
                <div className="flex items-center justify-between text-[#50453E] py-1 px-2 rounded hover:bg-[#FEF1EA] transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#6F4E37] text-[18px]">fingerprint</span>
                    <span>Biometrics Digitally Cross-Checked</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] bg-[#F2E6DF] text-[#201A17] font-semibold">
                    99.8% Match
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#50453E] py-1 px-2 rounded hover:bg-[#FEF1EA] transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#6F4E37] text-[18px]">fact_check</span>
                    <span>Address Verification (DigiLocker)</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] bg-[#F2E6DF] text-[#201A17] font-semibold">
                    Auto-Cleared
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#50453E] py-1 px-2 rounded hover:bg-[#FEF1EA] transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#6F4E37] text-[18px]">local_police</span>
                    <span>Police Verification Status</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] bg-[#FECAA5] text-[#795336] font-semibold">
                    Dispatched
                  </span>
                </div>
              </div>

              {/* Holographic Security Thread Simulation */}
              <div className="w-full h-1.5 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#FECAA5] to-[#4B3621] opacity-80"></div>
              <div className="flex items-center justify-between text-[#756B63] text-[11px] font-mono">
                <span>FILE: 2025/DEL/004812</span>
                <span>SEC-HASH: 8F09-EA11-99C1</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Search / Quick Application Status Bar */}
      <section className="w-full bg-white py-6 px-6 shadow-xs border-y border-[#E7DED6] my-4 rounded-xl max-w-[1440px] mx-auto" id="status-modal">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F8ECE5] flex items-center justify-center text-[#6F4E37] shrink-0">
              <span className="material-symbols-outlined text-[26px]">travel_explore</span>
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#201A17]">Track an Existing Application</h2>
              <p className="text-xs text-[#756B63]">
                Enter your 15-character ARN (Application Reference Number) or File ID.
              </p>
            </div>
          </div>

          <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              required
              placeholder="e.g. ARN-2025-88412 or 9028-441-A"
              value={trackArn}
              onChange={(e) => setTrackArn(e.target.value)}
              className="h-10 px-3 w-full sm:w-60 rounded bg-[#FEF1EA] text-[#201A17] text-xs border border-[#E7DED6] focus:outline-none focus:bg-white"
            />
            <input
              type="date"
              required
              value={trackDob}
              onChange={(e) => setTrackDob(e.target.value)}
              className="h-10 px-3 w-full sm:w-44 rounded bg-[#FEF1EA] text-[#201A17] text-xs border border-[#E7DED6] focus:outline-none focus:bg-white"
            />
            <button
              type="submit"
              disabled={searchLoading}
              className="h-10 px-5 rounded bg-[#6F4E37] text-white text-xs font-semibold hover:bg-[#4B3621] transition-colors whitespace-nowrap w-full sm:w-auto flex items-center justify-center gap-1.5 shadow-sm"
            >
              {searchLoading ? (
                <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">search</span> Status
                </>
              )}
            </button>
          </form>
        </div>

        {/* Dynamic Search Result Toast / Pillow */}
        {searchResult !== undefined && (
          <div className="mt-4 p-4 rounded-lg bg-[#F8ECE5] border border-[#E7DED6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
            {searchResult ? (
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#6F4E37] text-[22px] mt-0.5">task_alt</span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-[#201A17]">{searchResult.application_number}</span>
                    <span className="text-xs text-[#756B63]">({searchResult.applicant_name})</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FECAA5] text-[#795336]">
                      {searchResult.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#50453E] mt-1">
                    <strong>Current Progress:</strong> {searchResult.current_stage}. Biometrics: {searchResult.biometric_status}.
                    {searchResult.officer_remarks && <span className="block mt-0.5 text-[#B37D14]">Officer Remarks: {searchResult.officer_remarks}</span>}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-[#93000A]">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>File #{trackArn} not found in current database records. Try testing with #PAS-2025-08492 or ARN-2025-88412.</span>
              </div>
            )}
            <button
              onClick={() => setSearchResult(undefined)}
              className="text-xs font-medium text-[#756B63] hover:text-[#201A17] self-end sm:self-center"
            >
              Dismiss
            </button>
          </div>
        )}
      </section>

      {/* Three-Step Workflow Section ("How It Works") */}
      <section className="w-full py-16 bg-[#FEF1EA]/60 px-6" id="how-it-works-section">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-8">
          <div className="flex flex-col items-center text-center gap-1 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#6F4E37] tracking-widest uppercase">
              Standard Operating Protocol
            </span>
            <h2 className="text-2xl font-bold text-[#201A17]">Three Steps to Your Passport</h2>
            <p className="text-sm text-[#756B63]">
              The standardized automated workflow guarantees verified credential issuance without repetitive counter queues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-xl p-6 border border-[#E7DED6] shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between pb-4">
                  <span className="text-2xl font-bold text-[#ECE0DA] group-hover:text-[#6F4E37] transition-colors">
                    01
                  </span>
                  <div className="w-10 h-10 rounded-full bg-[#F8ECE5] flex items-center justify-center text-[#6F4E37]">
                    <span className="material-symbols-outlined text-[20px]">edit_document</span>
                  </div>
                </div>
                <h3 className="text-base font-bold text-[#201A17] mb-2">Apply Online</h3>
                <p className="text-xs text-[#756B63] leading-relaxed">
                  Fill the standardized bio-data record form. Upload scanned credentials including identity proof and
                  birth records directly with digital tamper detection.
                </p>
              </div>
              <div className="pt-6 flex items-center gap-2 text-[#6F4E37] text-xs font-semibold">
                <span className="material-symbols-outlined text-[16px]">check</span> DigiLocker Integrated
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl p-6 border border-[#E7DED6] shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between pb-4">
                  <span className="text-2xl font-bold text-[#ECE0DA] group-hover:text-[#6F4E37] transition-colors">
                    02
                  </span>
                  <div className="w-10 h-10 rounded-full bg-[#F8ECE5] flex items-center justify-center text-[#6F4E37]">
                    <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                  </div>
                </div>
                <h3 className="text-base font-bold text-[#201A17] mb-2">Verify Documents</h3>
                <p className="text-xs text-[#756B63] leading-relaxed">
                  Select an automated appointment window at your nearest Passport Seva Kendra (PSK). Present originals
                  for instant high-speed counter biometric capture.
                </p>
              </div>
              <div className="pt-6 flex items-center gap-2 text-[#6F4E37] text-xs font-semibold">
                <span className="material-symbols-outlined text-[16px]">check</span> Biometric Fingerprint &amp; Iris
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-xl p-6 border border-[#E7DED6] shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between pb-4">
                  <span className="text-2xl font-bold text-[#ECE0DA] group-hover:text-[#6F4E37] transition-colors">
                    03
                  </span>
                  <div className="w-10 h-10 rounded-full bg-[#F8ECE5] flex items-center justify-center text-[#6F4E37]">
                    <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                  </div>
                </div>
                <h3 className="text-base font-bold text-[#201A17] mb-2">Track &amp; Receive</h3>
                <p className="text-xs text-[#756B63] leading-relaxed">
                  Track police verification audit trails and real-time press issuance. The tamper-resistant physical
                  booklet is dispatched via secured priority government postal services.
                </p>
              </div>
              <div className="pt-6 flex items-center gap-2 text-[#6F4E37] text-xs font-semibold">
                <span className="material-symbols-outlined text-[16px]">check</span> Real-time SMS &amp; Portal Alerts
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Required Documents Interactive Matrix Section */}
      <section className="w-full py-16 bg-[#F8F5F2] px-6" id="matrix-section">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#6F4E37] uppercase tracking-widest">
                Pre-Requisite Verification Framework
              </span>
              <h2 className="text-2xl font-bold text-[#201A17] mt-1">Required Documents Matrix</h2>
              <p className="text-xs text-[#756B63]">
                Review required proof categories for Fresh Application and Re-issue requests.
              </p>
            </div>

            {/* Tab Controls */}
            <div className="flex items-center gap-1 p-1 bg-[#F8ECE5] rounded-lg self-start border border-[#E7DED6]">
              <button
                onClick={() => setMatrixFilter('all')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  matrixFilter === 'all'
                    ? 'bg-white text-[#6F4E37] shadow-xs'
                    : 'text-[#50453E] hover:text-[#201A17]'
                }`}
              >
                All Requirements
              </button>
              <button
                onClick={() => setMatrixFilter('fresh')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  matrixFilter === 'fresh'
                    ? 'bg-white text-[#6F4E37] shadow-xs'
                    : 'text-[#50453E] hover:text-[#201A17]'
                }`}
              >
                Fresh (Adult)
              </button>
              <button
                onClick={() => setMatrixFilter('minor')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  matrixFilter === 'minor'
                    ? 'bg-white text-[#6F4E37] shadow-xs'
                    : 'text-[#50453E] hover:text-[#201A17]'
                }`}
              >
                Minors (&lt;18)
              </button>
            </div>
          </div>

          {/* Matrix Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Date of Birth */}
            <div className="bg-white rounded-xl p-6 border border-[#E7DED6] shadow-xs flex flex-col gap-4">
              <div className="flex items-center gap-3 pb-3 border-b border-[#E7DED6]">
                <div className="w-9 h-9 rounded bg-[#F8ECE5] flex items-center justify-center text-[#6F4E37]">
                  <span className="material-symbols-outlined text-[20px]">cake</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#201A17]">1. Proof of Date of Birth</h4>
                  <p className="text-[11px] text-[#756B63]">Mandatory one valid proof</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-xs text-[#201A17]">
                <div className="p-3 rounded-lg bg-[#FEF1EA] flex items-start gap-2 border border-[#E7DED6]/60">
                  <span className="material-symbols-outlined text-[#6F4E37] text-[18px] shrink-0 mt-0.5">verified</span>
                  <div>
                    <p className="font-semibold">Birth Certificate</p>
                    <p className="text-[11px] text-[#756B63]">Issued by Municipal Registrar or authorized authority under RBD Act, 1969.</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#FEF1EA] flex items-start gap-2 border border-[#E7DED6]/60">
                  <span className="material-symbols-outlined text-[#6F4E37] text-[18px] shrink-0 mt-0.5">verified</span>
                  <div>
                    <p className="font-semibold">School Leaving / Matriculation Certificate</p>
                    <p className="text-[11px] text-[#756B63]">Bearing candidate's full legal name and confirmed date of birth.</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#FEF1EA] flex items-start gap-2 border border-[#E7DED6]/60">
                  <span className="material-symbols-outlined text-[#6F4E37] text-[18px] shrink-0 mt-0.5">verified</span>
                  <div>
                    <p className="font-semibold">PAN Card / Official E-PAN</p>
                    <p className="text-[11px] text-[#756B63]">Issued by the Income Tax Department with matching names.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Identity Proof */}
            <div className="bg-white rounded-xl p-6 border border-[#E7DED6] shadow-xs flex flex-col gap-4">
              <div className="flex items-center gap-3 pb-3 border-b border-[#E7DED6]">
                <div className="w-9 h-9 rounded bg-[#F8ECE5] flex items-center justify-center text-[#6F4E37]">
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#201A17]">2. Proof of Identity</h4>
                  <p className="text-[11px] text-[#756B63]">Must contain photograph</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-xs text-[#201A17]">
                <div className="p-3 rounded-lg bg-[#FEF1EA] flex items-start gap-2 border border-[#E7DED6]/60">
                  <span className="material-symbols-outlined text-[#6F4E37] text-[18px] shrink-0 mt-0.5">verified</span>
                  <div>
                    <p className="font-semibold">Aadhaar Card with e-KYC</p>
                    <p className="text-[11px] text-[#756B63]">Paperless direct sync through DigiLocker UIDAI credential handshake.</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#FEF1EA] flex items-start gap-2 border border-[#E7DED6]/60">
                  <span className="material-symbols-outlined text-[#6F4E37] text-[18px] shrink-0 mt-0.5">verified</span>
                  <div>
                    <p className="font-semibold">Voter Photo Identity Card (EPIC)</p>
                    <p className="text-[11px] text-[#756B63]">State or National Election Commission official physical/digital card.</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#FEF1EA] flex items-start gap-2 border border-[#E7DED6]/60">
                  <span className="material-symbols-outlined text-[#6F4E37] text-[18px] shrink-0 mt-0.5">verified</span>
                  <div>
                    <p className="font-semibold">Driving Licence (Smart Card)</p>
                    <p className="text-[11px] text-[#756B63]">Issued by Regional Transport Authority with valid unexpired status.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Address Proof */}
            <div className="bg-white rounded-xl p-6 border border-[#E7DED6] shadow-xs flex flex-col gap-4">
              <div className="flex items-center gap-3 pb-3 border-b border-[#E7DED6]">
                <div className="w-9 h-9 rounded bg-[#F8ECE5] flex items-center justify-center text-[#6F4E37]">
                  <span className="material-symbols-outlined text-[20px]">home_pin</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#201A17]">3. Proof of Residential Address</h4>
                  <p className="text-[11px] text-[#756B63]">Present residence validation</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-xs text-[#201A17]">
                <div className="p-3 rounded-lg bg-[#FEF1EA] flex items-start gap-2 border border-[#E7DED6]/60">
                  <span className="material-symbols-outlined text-[#6F4E37] text-[18px] shrink-0 mt-0.5">verified</span>
                  <div>
                    <p className="font-semibold">Scheduled Bank Passbook / Statement</p>
                    <p className="text-[11px] text-[#756B63]">Running account in Public/Private Sector Bank with photo stamp.</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#FEF1EA] flex items-start gap-2 border border-[#E7DED6]/60">
                  <span className="material-symbols-outlined text-[#6F4E37] text-[18px] shrink-0 mt-0.5">verified</span>
                  <div>
                    <p className="font-semibold">Utility Connection Bill (Electricity/Gas)</p>
                    <p className="text-[11px] text-[#756B63]">Within the last 3 months, reflecting applicant or parent's name.</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#FEF1EA] flex items-start gap-2 border border-[#E7DED6]/60">
                  <span className="material-symbols-outlined text-[#6F4E37] text-[18px] shrink-0 mt-0.5">verified</span>
                  <div>
                    <p className="font-semibold">Registered Rent Agreement</p>
                    <p className="text-[11px] text-[#756B63]">Formally registered lease deed for minimum 1-year residency term.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Document Advisory Note */}
          <div className="p-4 rounded-xl bg-[#F8ECE5] border border-[#E7DED6] flex items-center gap-3 shadow-xs">
            <span className="material-symbols-outlined text-[#6F4E37] text-[24px] shrink-0">info</span>
            <p className="text-xs text-[#201A17] leading-normal">
              <strong>Important Consular Rule:</strong> All applicants must bring <em>original documentation</em> along with one self-attested photocopy to the physical appointment desk. DigiLocker-pulled digital records require no physical xerox duplicates.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features & Consular FAQ Section */}
      <section className="w-full py-16 bg-[#FEF1EA]/60 px-6" id="faq-section">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 flex flex-col gap-4">
            <span className="text-xs font-bold text-[#6F4E37] tracking-widest uppercase">
              Consular Help Center
            </span>
            <h2 className="text-2xl font-bold text-[#201A17]">Frequently Asked Questions</h2>
            <p className="text-sm text-[#756B63]">
              Clear answers on Tatkaal priority processing, booking modifications, and passport renewal timelines.
            </p>

            {/* Help Desk Quick Card */}
            <div className="p-6 rounded-xl bg-white border border-[#E7DED6] shadow-xs flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6F4E37] text-[22px]">support_agent</span>
                <span className="font-bold text-sm text-[#201A17]">Need Live Adjudication Assistance?</span>
              </div>
              <p className="text-xs text-[#756B63]">
                Our automated helpline operates 24/7. Citizen queries are mapped directly to corresponding regional passport officers.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#6F4E37]">
                <span>Toll Free: 1800-258-1800</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#F8ECE5] text-[#756B63]">Toll-Free</span>
              </div>
            </div>
          </div>

          {/* FAQ Accordions */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            {[
              {
                id: 'faq-1',
                q: 'What constitutes the Tatkaal Scheme and who is eligible?',
                a: 'Tatkaal is designed for expedited emergency document issuance. Applications are processed without waiting for prior police clearance report. Passports under the Tatkaal scheme are typically dispatched within 1 to 3 business days, subject to verified verification credentials and additional statutory urgency fees.',
              },
              {
                id: 'faq-2',
                q: 'How do I reschedule or cancel my reserved appointment slot?',
                a: 'Applicants are permitted up to two (2) reschedulings within a 12-month period from the original payment date. Rescheduling can be executed effortlessly from the portal dashboard under the Appointment Booking section at least 24 hours prior to the reserved slot.',
              },
              {
                id: 'faq-3',
                q: 'When can I apply for renewal / re-issue of an expiring passport?',
                a: 'You may apply for passport re-issue up to one full year (12 months) before its official date of expiration, or any time within three years after its expiration date. You must surrender the existing booklet during the physical appointment at the verification desk.',
              },
              {
                id: 'faq-4',
                q: 'Is Annexure-D still mandatory for minor applicants?',
                a: 'Yes, Annexure-D (Declaration of Parent/Guardian for issuance of passport to minor when one or both parents hold valid passports) is mandatory. It can be signed and uploaded as a self-declared digital document via our portal without requiring non-judicial stamp paper notarization.',
              },
            ].map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div key={faq.id} className="bg-white rounded-xl border border-[#E7DED6] shadow-xs overflow-hidden">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-[#FEF1EA]/50 transition-colors"
                  >
                    <span className="font-semibold text-xs text-[#201A17]">{faq.q}</span>
                    <span className={`material-symbols-outlined text-[#6F4E37] transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-[#756B63] leading-relaxed border-t border-[#E7DED6]/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Academic Project Disclosure Section */}
      <section className="w-full bg-[#F8ECE5] py-8 px-6 border-y border-[#E7DED6]">
        <div className="max-w-[1440px] mx-auto rounded-xl bg-white p-6 border border-[#E7DED6] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F8ECE5] flex items-center justify-center text-[#6F4E37] shrink-0">
              <span className="material-symbols-outlined text-[28px]">terminal</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base text-[#201A17]">Academic Project Disclosure</h3>
                <span className="px-2 py-0.5 rounded bg-[#F2E6DF] text-[#50453E] text-[11px] font-semibold border border-[#E7DED6]">
                  R25 SE Coursework
                </span>
              </div>
              <p className="text-xs text-[#756B63] max-w-2xl leading-relaxed">
                This deployment is built strictly for pedagogical and software engineering evaluation under the R25 Academic Cohort.
                Application records, mock payments, and verification outcomes do not represent real-world sovereign credential issuances.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2 rounded-lg bg-[#F8ECE5] text-[#201A17] text-xs font-semibold hover:bg-[#F2E6DF] transition-colors"
            >
              Enter Applicant Portal
            </button>
            <button
              onClick={() => onNavigate('officer-console')}
              className="px-4 py-2 rounded-lg bg-[#6F4E37] text-white text-xs font-semibold hover:bg-[#4B3621] transition-colors shadow-sm"
            >
              Enter Officer Console
            </button>
          </div>
        </div>
      </section>

      {/* Institutional Portal Quick Links Directory */}
      <section className="w-full bg-[#FEF1EA]/60 py-8 px-6">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-5 gap-4 text-[#756B63] text-xs">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] uppercase font-bold text-[#201A17]">Portal Nav</span>
            <button onClick={() => onNavigate('new-application')} className="text-left hover:text-[#6F4E37]">Fresh Intake</button>
            <button onClick={() => onNavigate('new-application')} className="text-left hover:text-[#6F4E37]">Tatkaal Desk</button>
            <button onClick={() => onNavigate('application-tracking')} className="text-left hover:text-[#6F4E37]">Tracking Console</button>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[11px] uppercase font-bold text-[#201A17]">Forms &amp; Manuals</span>
            <span className="hover:text-[#6F4E37] cursor-pointer">Annexure A through I</span>
            <span className="hover:text-[#6F4E37] cursor-pointer">Fee Calculator</span>
            <span className="hover:text-[#6F4E37] cursor-pointer">Photo Guidelines</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[11px] uppercase font-bold text-[#201A17]">Citizen Charter</span>
            <span className="hover:text-[#6F4E37] cursor-pointer">Service Standards</span>
            <span className="hover:text-[#6F4E37] cursor-pointer">Grievance Escalation</span>
            <span className="hover:text-[#6F4E37] cursor-pointer">Feedback Loop</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[11px] uppercase font-bold text-[#201A17]">Security &amp; API</span>
            <span className="hover:text-[#6F4E37] cursor-pointer">e-Passport Standards</span>
            <span className="hover:text-[#6F4E37] cursor-pointer">Public Key Directory</span>
            <span className="hover:text-[#6F4E37] cursor-pointer">Audit Compliance</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[11px] uppercase font-bold text-[#201A17]">Consular Offices</span>
            <span className="hover:text-[#6F4E37] cursor-pointer">PSK Central Seva Kendra</span>
            <span className="hover:text-[#6F4E37] cursor-pointer">Post Office PSKs</span>
            <span className="hover:text-[#6F4E37] cursor-pointer">Holiday Schedule</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-[#E7DED6] py-6 px-6">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2">
            <img
              alt="Emblem"
              className="h-6 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1UC7OtOOIgwsTtf0DLvaREWetioXLF2jL46oL2heQSno2LoNA_Ji5I1Ummut_uiqQ7YUWeTff2WihHxrLQx05rro7LhYANqjRpzLje2wPZuGIRn8qS8SfpnSLjTU1MUNn_obNqcu_2oEKChUNuYZ1mtqp5jgF4XawuaHapC-MfAfnttYJB2B98qryXuUlkeNRNKbzyKB2zcAF8Ewq0C0EwS2dFZ-5KL5Q0RISjiACY9AMH75e_yiQ4yCQCK"
            />
            <span className="font-semibold text-sm text-[#201A17]">Passport Automation System</span>
            <span className="px-2 py-0.5 rounded bg-[#F2E6DF] text-[#50453E] text-[10px] border border-[#E7DED6]">
              State Consular Services
            </span>
          </div>
          <p className="text-xs text-[#756B63]">
            © 2025 Passport Portal • R25 Software Engineering Project. Archival Records Division.
          </p>
        </div>
      </footer>
    </div>
  );
};
