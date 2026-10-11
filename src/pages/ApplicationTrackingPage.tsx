import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Application, User } from '../types';

interface ApplicationTrackingPageProps {
  currentUser: User;
  initialApplication?: Application | null;
}

export const ApplicationTrackingPage: React.FC<ApplicationTrackingPageProps> = ({
  currentUser,
  initialApplication,
}) => {
  const [searchArn, setSearchArn] = useState(initialApplication?.application_number || 'PAS-2025-08492');
  const [selectedApp, setSelectedApp] = useState<Application | null>(initialApplication || null);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    if (initialApplication) {
      setSelectedApp(initialApplication);
      setSearchArn(initialApplication.application_number);
    } else {
      // Default load Eleanor's active app
      api.getApplicationByARN('PAS-2025-08492').then(app => {
        if (app) setSelectedApp(app);
      });
    }

    const unsub = api.onDataChange(async () => {
      if (selectedApp) {
        const refreshed = await api.getApplicationById(selectedApp.id);
        if (refreshed) setSelectedApp(refreshed);
      }
    });
    return unsub;
  }, [initialApplication, selectedApp?.id]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearchError(null);
    try {
      const found = await api.getApplicationByARN(searchArn);
      if (found) {
        setSelectedApp(found);
      } else {
        setSearchError(`No consular record found for "${searchArn}". Verify the reference number.`);
      }
    } catch {
      setSearchError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full pb-16 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E7DED6]">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6F4E37]"></span>
            <span className="text-[11px] font-semibold text-[#82746D] uppercase tracking-wider">
              Consular Lifecycle Adjudication Audit
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#201A17] tracking-tight">Application Tracking Console</h1>
          <p className="text-xs text-[#756B63] mt-0.5">
            Audit your sovereign credential lifecycle, police clearance status, and expected next action in real-time.
          </p>
        </div>
      </div>

      {/* ARN Search Box */}
      <div className="p-5 rounded-xl bg-white border border-[#E7DED6] shadow-xs">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#82746D] text-[20px]">
              search
            </span>
            <input
              type="text"
              required
              placeholder="Enter Application Reference Number (e.g. #PAS-2025-08492 or URN: 9028-441-A)"
              value={searchArn}
              onChange={(e) => setSearchArn(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded bg-[#FEF1EA] border border-[#E7DED6] text-xs text-[#201A17] font-mono font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#6F4E37]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="h-10 px-6 rounded bg-[#6F4E37] text-white hover:bg-[#4B3621] text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap w-full sm:w-auto"
          >
            {loading ? (
              <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">travel_explore</span>
                <span>Track Application</span>
              </>
            )}
          </button>
        </form>

        {searchError && (
          <p className="text-xs text-[#BA1A1A] mt-2 font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">error</span>
            <span>{searchError}</span>
          </p>
        )}
      </div>

      {/* Tracking Details View */}
      {selectedApp && (
        <div className="space-y-6 animate-in fade-in">
          {/* Top Dossier Summary Card */}
          <div className="p-6 rounded-xl bg-white border border-[#E7DED6] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FEF1EA] border border-[#E7DED6] text-[#6F4E37] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[26px]">badge</span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-lg font-bold text-[#201A17]">{selectedApp.application_number}</span>
                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                    selectedApp.status === 'Approved'
                      ? 'bg-[#EAF5ED] text-[#2E6F40]'
                      : selectedApp.status === 'Correction Required'
                      ? 'bg-[#FFDAD6] text-[#93000A]'
                      : 'bg-[#FEF8E7] text-[#B37D14]'
                  }`}>
                    {selectedApp.status}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#F8ECE5] text-[#756B63] text-[11px] font-mono">
                    URN: {selectedApp.urn}
                  </span>
                </div>
                <p className="text-xs text-[#756B63]">
                  {selectedApp.application_type} • Applicant: <strong>{selectedApp.applicant_name}</strong>
                </p>
                <p className="text-xs text-[#50453E] mt-1">
                  <strong>Current Stage:</strong> {selectedApp.current_stage}
                </p>
              </div>
            </div>

            {/* Expected Next Action Pill Box */}
            <div className="p-4 rounded-xl bg-[#FEF1EA] border border-[#E7DED6] flex flex-col gap-1 lg:max-w-xs w-full">
              <span className="text-[10px] font-bold text-[#82746D] uppercase tracking-wider">
                Expected Next Action
              </span>
              <span className="text-xs font-bold text-[#201A17]">
                {selectedApp.status === 'Approved'
                  ? 'SpeedPost Courier Delivery to Residence'
                  : selectedApp.status === 'Correction Required'
                  ? 'Re-upload Corrected Proof of Address'
                  : selectedApp.status === 'Payment Pending'
                  ? 'Complete Simulated Statutory Fee Payment'
                  : 'Attend PSK Biometric Window (Friday 10:30 AM)'}
              </span>
              <span className="text-[11px] text-[#756B63]">
                {selectedApp.status === 'Approved' ? 'Tracking ID: SP-IND-9028-441' : 'Desk #12 SLA active'}
              </span>
            </div>
          </div>

          {/* Stepper Timeline Visual */}
          <div className="p-6 rounded-xl bg-white border border-[#E7DED6] shadow-xs space-y-6">
            <h3 className="text-xs font-bold text-[#201A17] uppercase tracking-wider">
              Chronological Adjudication Milestones
            </h3>

            <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E7DED6]">
              {/* Milestone 1: Submission */}
              <div className="relative">
                <div className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-[#2E6F40] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[13px]">check</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#201A17]">Application Submitted &amp; Digitally Signed</span>
                    <span className="text-[11px] font-mono text-[#82746D]">
                      {new Date(selectedApp.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-[#756B63] mt-0.5">
                    Official Form P-1 lodged with SHA-256 tamper seal. Fee reference: TXN-PAS-2025-88412-A1.
                  </p>
                </div>
              </div>

              {/* Milestone 2: Document Verification */}
              <div className="relative">
                <div className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center text-white ${
                  selectedApp.status === 'Draft' ? 'bg-[#E7DED6]' : 'bg-[#2E6F40]'
                }`}>
                  <span className="material-symbols-outlined text-[13px]">check</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#201A17]">Civil Records &amp; Aadhaar e-KYC Verification</span>
                    <span className="text-[11px] font-mono text-[#82746D]">Verified</span>
                  </div>
                  <p className="text-xs text-[#756B63] mt-0.5">
                    Municipal birth record, identity card, and billing utilities cross-checked against DigiLocker.
                  </p>
                </div>
              </div>

              {/* Milestone 3: Biometrics & Scrutiny */}
              <div className="relative">
                <div className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center ${
                  selectedApp.status === 'Approved'
                    ? 'bg-[#2E6F40] text-white'
                    : 'bg-[#FEF8E7] text-[#B37D14] ring-2 ring-[#B37D14]'
                }`}>
                  <span className="material-symbols-outlined text-[13px]">
                    {selectedApp.status === 'Approved' ? 'check' : 'sync'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#201A17]">Consular Officer Adjudication (Desk 12)</span>
                    <span className="text-[11px] font-semibold text-[#B37D14]">In Progress</span>
                  </div>
                  <p className="text-xs text-[#756B63] mt-0.5">
                    Inspector review, biometric fingerprint consistency check (99.4% Tier-A), and police station clearance handshake.
                  </p>
                  {selectedApp.officer_remarks && (
                    <div className="mt-2 p-3 rounded-lg bg-[#FEF8E7] border border-[#E7DED6] text-xs text-[#50453E]">
                      <strong>Officer Remarks:</strong> {selectedApp.officer_remarks}
                    </div>
                  )}
                </div>
              </div>

              {/* Milestone 4: Final Issuance */}
              <div className="relative">
                <div className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center ${
                  selectedApp.status === 'Approved'
                    ? 'bg-[#2E6F40] text-white'
                    : 'bg-[#ECE0DA] text-[#82746D]'
                }`}>
                  <span className="material-symbols-outlined text-[13px]">
                    {selectedApp.status === 'Approved' ? 'check' : 'local_shipping'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${selectedApp.status === 'Approved' ? 'text-[#201A17]' : 'text-[#82746D]'}`}>
                      Document Production &amp; Postal SpeedPost Dispatch
                    </span>
                    {selectedApp.status === 'Approved' && (
                      <span className="text-[11px] font-semibold text-[#2E6F40]">Dispatched</span>
                    )}
                  </div>
                  <p className="text-xs text-[#82746D] mt-0.5">
                    Laser-engraved polycarbonate data page with contactless chip. Dispatched via secured government courier.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
