import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Application, User, DashboardStats } from '../types';

interface ApplicantDashboardProps {
  currentUser: User;
  onNavigate: (path: string) => void;
  onSelectApplication: (app: Application) => void;
  onOpenBooking: (app: Application) => void;
  onOpenPayment: (app: Application) => void;
}

export const ApplicantDashboard: React.FC<ApplicantDashboardProps> = ({
  currentUser,
  onNavigate,
  onSelectApplication,
  onOpenBooking,
  onOpenPayment,
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statementToast, setStatementToast] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [st, apps] = await Promise.all([
        api.getApplicantStats(currentUser.id),
        api.getApplications(currentUser.id),
      ]);
      setStats(st);
      setApplications(apps);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = api.onDataChange(() => {
      loadData();
    });
    return unsub;
  }, [currentUser]);

  const activeApp = applications.find(a => a.status === 'Under Review' || a.status === 'Submitted' || a.status === 'Payment Pending' || a.status === 'Correction Required') || applications[0];

  const handleExportStatement = () => {
    setStatementToast(true);
    setTimeout(() => setStatementToast(false), 3000);
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Toast Notification for Statement Export */}
      {statementToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#29231F] text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 text-xs border border-[#E7DED6]/30 animate-in fade-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined text-[18px] text-[#FECAA5]">download_done</span>
          <span>Official Consular Ledger Statement (.PDF) simulated and downloaded.</span>
        </div>
      )}

      {/* Top Welcome & Orientation Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4">
        <div className="flex flex-col max-w-2xl">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6F4E37]"></span>
            <span className="text-[11px] font-semibold text-[#82746D] uppercase tracking-wider">
              Citizen Intake Service • Record Vault
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#201A17] tracking-tight">
            Welcome back, {currentUser.full_name}
          </h1>
          <p className="text-sm text-[#756B63] mt-1">
            Review your active passport filings, pending biometric appointments, and document statuses.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportStatement}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-white text-[#201A17] text-xs font-semibold shadow-xs border border-[#E7DED6] hover:bg-[#F8ECE5] transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-[#756B63]">file_download</span>
            <span>Export Statement</span>
          </button>
          <button
            onClick={() => onNavigate('new-application')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[#6F4E37] text-white text-xs font-semibold shadow-sm hover:bg-[#4B3621] transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Start New Application</span>
          </button>
        </div>
      </div>

      {/* Summary Metric Cards (4 Bento Panels) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Metric 1: Total Applications */}
        <div className="p-5 rounded-xl bg-white border border-[#E7DED6] shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between mb-3">
            <span className="text-[11px] font-semibold text-[#756B63] uppercase tracking-wider">
              Total Applications
            </span>
            <div className="w-9 h-9 rounded bg-[#F8ECE5] flex items-center justify-center text-[#6F4E37]">
              <span className="material-symbols-outlined text-[20px]">folder_open</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-[#201A17]">
                {String(applications.length).padStart(2, '0')}
              </span>
              <span className="text-xs text-[#756B63]">filings</span>
            </div>
            <p className="text-xs text-[#82746D] mt-1">1 active intake • 1 archival</p>
          </div>
          <div className="mt-4 pt-2 border-t border-[#E7DED6]/40 flex items-center gap-1.5 text-[#756B63] text-xs">
            <span className="w-2 h-2 rounded-full bg-[#7C5639]"></span>
            <span className="text-[11px]">Lifecycle synchronized</span>
          </div>
        </div>

        {/* Metric 2: Pending Review */}
        <div className="p-5 rounded-xl bg-white border border-[#E7DED6] shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between mb-3">
            <span className="text-[11px] font-semibold text-[#756B63] uppercase tracking-wider">
              Pending Review
            </span>
            <div className="w-9 h-9 rounded bg-[#FECAA5]/40 flex items-center justify-center text-[#795336]">
              <span className="material-symbols-outlined text-[20px]">hourglass_top</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#201A17]">
                {String(stats?.pending_review ?? 1).padStart(2, '0')}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#FEF8E7] text-[#B37D14] font-semibold">
                Under Scrutiny
              </span>
            </div>
            <p className="text-xs text-[#82746D] mt-1">Regional Passport Office scrutiny</p>
          </div>
          <div className="mt-4 pt-2 border-t border-[#E7DED6]/40 flex items-center gap-1.5 text-xs">
            <span className="w-2 h-2 rounded-full bg-[#B37D14] animate-pulse"></span>
            <span className="text-[11px] text-[#756B63]">SLA: 48 hours remaining</span>
          </div>
        </div>

        {/* Metric 3: Biometric Appointment */}
        <div className="p-5 rounded-xl bg-white border border-[#E7DED6] shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between mb-3">
            <span className="text-[11px] font-semibold text-[#756B63] uppercase tracking-wider">
              Biometric Appointment
            </span>
            <div className="w-9 h-9 rounded bg-[#F8ECE5] flex items-center justify-center text-[#6F4E37]">
              <span className="material-symbols-outlined text-[20px]">calendar_today</span>
            </div>
          </div>
          <div>
            <span className="text-base font-bold text-[#201A17] block leading-tight">
              {stats?.next_appointment ? new Date(stats.next_appointment.appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Oct 24, 2025'}
            </span>
            <div className="flex items-center gap-1 text-[#756B63] mt-1 text-xs">
              <span className="material-symbols-outlined text-[15px]">schedule</span>
              <span className="font-medium">
                {stats?.next_appointment ? `${stats.next_appointment.time_slot} • ${stats.next_appointment.center_name}` : '10:30 AM • PSK Central'}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-[#E7DED6]/40 flex items-center justify-between text-xs text-[#756B63]">
            <span className="text-[11px] text-[#82746D]">Counter 04 reserved</span>
            {activeApp && (
              <button
                onClick={() => onOpenBooking(activeApp)}
                className="text-[11px] text-[#6F4E37] font-semibold hover:underline"
              >
                Directions
              </button>
            )}
          </div>
        </div>

        {/* Metric 4: Completed Filings */}
        <div className="p-5 rounded-xl bg-white border border-[#E7DED6] shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between mb-3">
            <span className="text-[11px] font-semibold text-[#756B63] uppercase tracking-wider">
              Completed Filings
            </span>
            <div className="w-9 h-9 rounded bg-[#EAF5ED] flex items-center justify-center text-[#2E6F40]">
              <span className="material-symbols-outlined text-[20px]">verified</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#201A17]">
                {String(stats?.completed_filings ?? 1).padStart(2, '0')}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#F8ECE5] text-[#756B63] font-mono">
                #Z891204
              </span>
            </div>
            <p className="text-xs text-[#82746D] mt-1">Regular 36-page booklet issued</p>
          </div>
          <div className="mt-4 pt-2 border-t border-[#E7DED6]/40 flex items-center gap-1.5 text-[#2E6F40] text-xs">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            <span className="text-[11px] font-semibold">Valid until May 2032</span>
          </div>
        </div>
      </div>

      {/* Primary Featured Docket: Active Application Tracker */}
      {activeApp && (
        <div className="p-6 rounded-xl bg-white border border-[#E7DED6] shadow-xs mb-6 relative overflow-hidden">
          {/* Top Info Strip */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 mb-6 border-b border-[#E7DED6]/70">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#F2E6DF] flex items-center justify-center text-[#6F4E37] shrink-0">
                <span className="material-symbols-outlined text-[26px]">badge</span>
              </div>
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xl font-bold text-[#201A17]">{activeApp.application_number}</span>
                  <span className="px-2.5 py-0.5 rounded bg-[#FEF8E7] text-[#B37D14] text-[11px] font-bold tracking-wide uppercase">
                    {activeApp.status === 'Approved' ? 'Adjudicated & Approved' : 'Under Officer Scrutiny'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#F8ECE5] text-[#756B63] text-[11px] font-medium">
                    Tracked Stream
                  </span>
                </div>
                <p className="text-xs text-[#756B63]">
                  {activeApp.application_type} • {activeApp.booklet_pages} Pages Booklet • Citizen Applicant {activeApp.applicant_name}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onSelectApplication(activeApp)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-[#FEF1EA] text-[#201A17] hover:bg-[#F8ECE5] text-xs font-semibold transition-colors border border-[#E7DED6]"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px] text-[#756B63]">description</span>
                <span>View Dossier</span>
              </button>
              <button
                onClick={handleExportStatement}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[#6F4E37] text-white hover:bg-[#4B3621] text-xs font-semibold transition-colors shadow-xs"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                <span>Download Acknowledgement</span>
              </button>
            </div>
          </div>

          {/* Stepper Timeline Strip */}
          <div className="py-4 px-6 rounded-xl bg-[#FEF1EA]/60 border border-[#E7DED6] mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {/* Step 1 */}
              <div className="flex flex-col relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#2E6F40] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  </div>
                  <div className="hidden md:block flex-1 h-0.5 bg-[#2E6F40]/30"></div>
                </div>
                <span className="text-[11px] font-semibold text-[#82746D] uppercase tracking-wider">Step 01</span>
                <span className="text-sm font-bold text-[#201A17]">Submitted</span>
                <span className="text-xs text-[#756B63] mt-0.5">Oct 12, 2025 • 14:22</span>
                <span className="text-[11px] font-semibold text-[#2E6F40] mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">done_all</span> Digitally signed &amp; paid
                </span>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#2E6F40] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  </div>
                  <div className="hidden md:block flex-1 h-0.5 bg-[#6F4E37]/40"></div>
                </div>
                <span className="text-[11px] font-semibold text-[#82746D] uppercase tracking-wider">Step 02</span>
                <span className="text-sm font-bold text-[#201A17]">Documents Verified</span>
                <span className="text-xs text-[#756B63] mt-0.5">Oct 16, 2025 • 09:40</span>
                <span className="text-[11px] font-semibold text-[#2E6F40] mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span> 4 Certs Cleared
                </span>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
                    activeApp.status === 'Approved' ? 'bg-[#2E6F40] text-white' : 'bg-[#FEF8E7] text-[#B37D14] ring-4 ring-[#FEF8E7]'
                  }`}>
                    <span className={`material-symbols-outlined text-[18px] ${activeApp.status === 'Approved' ? '' : 'animate-spin'}`}>
                      {activeApp.status === 'Approved' ? 'check' : 'sync'}
                    </span>
                  </div>
                  <div className="hidden md:block flex-1 h-0.5 bg-[#E7DED6]"></div>
                </div>
                <span className="text-[11px] font-semibold text-[#B37D14] uppercase tracking-wider">
                  Step 03 • Current
                </span>
                <span className="text-sm font-bold text-[#201A17]">Under Review</span>
                <span className="text-xs text-[#756B63] mt-0.5">Regional Office Desk 12</span>
                <span className="text-[11px] font-semibold text-[#B37D14] mt-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#B37D14] animate-ping"></span> Adjudication pending
                </span>
              </div>

              {/* Step 4 */}
              <div className={`flex flex-col relative ${activeApp.status === 'Approved' ? 'opacity-100' : 'opacity-60'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    activeApp.status === 'Approved' ? 'bg-[#2E6F40] text-white' : 'bg-[#ECE0DA] text-[#756B63]'
                  }`}>
                    <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#82746D] uppercase tracking-wider">Step 04</span>
                <span className="text-sm font-bold text-[#201A17]">Decision &amp; Dispatch</span>
                <span className="text-xs text-[#756B63] mt-0.5">
                  {activeApp.status === 'Approved' ? 'Approved & En route' : 'Estimated by Oct 28'}
                </span>
                <span className="text-[11px] text-[#82746D] mt-1">Postal SpeedPost Track</span>
              </div>
            </div>
          </div>

          {/* Active Filing Snapshot Data Pillows */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-[#F8ECE5]/50 border border-[#E7DED6] flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-white border border-[#E7DED6] flex items-center justify-center text-[#4F3A25] shrink-0">
                <span className="material-symbols-outlined text-[20px]">fingerprint</span>
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-semibold text-[#82746D] uppercase block">Next Mandatory Action</span>
                <span className="text-xs font-bold text-[#201A17] truncate block">PSK Biometric Appointment</span>
                <span className="text-xs text-[#756B63]">Confirmed for Friday, 10:30 AM</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#F8ECE5]/50 border border-[#E7DED6] flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-white border border-[#E7DED6] flex items-center justify-center text-[#4F3A25] shrink-0">
                <span className="material-symbols-outlined text-[20px]">fact_check</span>
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-semibold text-[#82746D] uppercase block">Security Verification</span>
                <span className="text-xs font-bold text-[#201A17] truncate block">Police Clearance Initiated</span>
                <span className="text-xs text-[#2E6F40] font-medium">Jurisdiction District HQ 09</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#F8ECE5]/50 border border-[#E7DED6] flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-white border border-[#E7DED6] flex items-center justify-center text-[#4F3A25] shrink-0">
                <span className="material-symbols-outlined text-[20px]">lock_reset</span>
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-semibold text-[#82746D] uppercase block">Vault Signature</span>
                <span className="text-xs font-bold text-[#201A17] truncate block">SHA-256 Validated</span>
                <span className="text-xs text-[#756B63]">Archived in Government HSM</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lower Split Section: Applications Table & Support Dossier */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Applications Ledger Table (2 cols width) */}
        <div className="xl:col-span-2 p-6 rounded-xl bg-white border border-[#E7DED6] shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E7DED6]">
            <div className="flex flex-col">
              <h2 className="text-base font-bold text-[#201A17]">Application Ledger</h2>
              <p className="text-xs text-[#756B63]">Full chronological record of submission filings and national credentials.</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#F8ECE5] text-[#50453E]">
                All Filings ({applications.length})
              </span>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#FEF1EA] text-[#756B63] text-[11px] font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4 rounded-l">Application ID</th>
                  <th className="py-3 px-4">Service Type</th>
                  <th className="py-3 px-4">Submission</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 rounded-r text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7DED6]/50 text-xs">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-[#FEF1EA]/50 transition-colors group">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-1.5 h-7 rounded-full ${app.status === 'Approved' ? 'bg-[#2E6F40]' : 'bg-[#6F4E37]'}`}></div>
                        <div>
                          <span className="font-bold text-[#201A17] block leading-tight">{app.application_number}</span>
                          <span className="text-[11px] font-mono text-[#82746D]">URN: {app.urn}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#201A17]">{app.application_type}</span>
                        <span className="text-[11px] text-[#756B63]">{app.priority} Priority</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="text-[#201A17]">{new Date(app.created_at).toLocaleDateString()}</span>
                        <span className="text-[11px] text-[#82746D]">14:22 EST</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-[#201A17]">
                        <span className={`w-2 h-2 rounded-full ${app.status === 'Approved' ? 'bg-[#2E6F40]' : 'bg-[#B37D14]'}`}></span>
                        <span className="font-medium truncate max-w-[140px]">{app.current_stage}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        app.status === 'Approved'
                          ? 'bg-[#EAF5ED] text-[#2E6F40]'
                          : app.status === 'Correction Required'
                          ? 'bg-[#FFDAD6] text-[#93000A]'
                          : 'bg-[#FEF8E7] text-[#B37D14]'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex items-center gap-1 justify-end">
                        <button
                          onClick={() => onSelectApplication(app)}
                          className="px-2.5 py-1.5 rounded text-xs font-semibold bg-[#FEF1EA] hover:bg-[#F8ECE5] text-[#6F4E37] transition-colors"
                        >
                          Track
                        </button>
                        {app.status === 'Payment Pending' && (
                          <button
                            onClick={() => onOpenPayment(app)}
                            className="px-2.5 py-1.5 rounded text-xs font-semibold bg-[#6F4E37] text-white hover:bg-[#4B3621]"
                          >
                            Pay
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footnote */}
          <div className="flex items-center justify-between pt-4 mt-2 text-[#756B63] text-xs border-t border-[#E7DED6]">
            <span className="flex items-center gap-1 text-[#82746D]">
              <span className="material-symbols-outlined text-[15px]">verified_user</span> Authenticated against National Identity Gateway
            </span>
            <button onClick={handleExportStatement} className="text-[#6F4E37] hover:underline font-semibold">
              Download Full Audit Log (.PDF)
            </button>
          </div>
        </div>

        {/* Right Side: Quick Shortcuts & Support Card */}
        <div className="flex flex-col gap-6">
          {/* Quick Action Shortcuts Panel */}
          <div className="p-6 rounded-xl bg-white border border-[#E7DED6] shadow-xs flex flex-col">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E7DED6]">
              <div className="w-8 h-8 rounded bg-[#F8ECE5] flex items-center justify-center text-[#6F4E37]">
                <span className="material-symbols-outlined text-[18px]">quick_reference_all</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#201A17]">Appointment &amp; Tasks</h3>
                <span className="text-[11px] text-[#82746D]">Self-service utilities</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {/* Item 1 */}
              <button
                onClick={() => activeApp && onOpenBooking(activeApp)}
                className="p-3 rounded-lg bg-[#FEF1EA]/70 hover:bg-[#F8ECE5] transition-colors flex items-center justify-between text-left group border border-[#E7DED6]/50"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#6F4E37] text-[20px]">edit_calendar</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#201A17] group-hover:text-[#6F4E37] transition-colors">
                      Reschedule Appointment
                    </span>
                    <span className="text-[11px] text-[#756B63]">Available up to 24 hrs prior to date</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#82746D] group-hover:translate-x-0.5 transition-transform text-[18px]">
                  arrow_forward
                </span>
              </button>

              {/* Item 2 */}
              <button
                onClick={() => onNavigate('document-vault')}
                className="p-3 rounded-lg bg-[#FEF1EA]/70 hover:bg-[#F8ECE5] transition-colors flex items-center justify-between text-left group border border-[#E7DED6]/50"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#6F4E37] text-[20px]">checklist</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#201A17] group-hover:text-[#6F4E37] transition-colors">
                      Required Document Checklist
                    </span>
                    <span className="text-[11px] text-[#756B63]">3 Original IDs required at center</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#82746D] group-hover:translate-x-0.5 transition-transform text-[18px]">
                  arrow_forward
                </span>
              </button>

              {/* Item 3 */}
              <button
                onClick={handleExportStatement}
                className="p-3 rounded-lg bg-[#FEF1EA]/70 hover:bg-[#F8ECE5] transition-colors flex items-center justify-between text-left group border border-[#E7DED6]/50"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#6F4E37] text-[20px]">download_for_offline</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#201A17] group-hover:text-[#6F4E37] transition-colors">
                      Download Annexures
                    </span>
                    <span className="text-[11px] text-[#756B63]">Standard Annexure C, E, &amp; F forms</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#82746D] group-hover:translate-x-0.5 transition-transform text-[18px]">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>

          {/* Support & PSK Central Desk Card */}
          <div className="p-6 rounded-xl bg-[#F8ECE5] border border-[#E7DED6] text-[#201A17] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#82746D]">Appointment Location</span>
                <span className="px-2 py-0.5 rounded bg-[#F2E6DF] text-[#50453E] text-[10px] font-semibold border border-[#E7DED6]">
                  Station #04
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#201A17]">PSK Central Seva Kendra</h4>
              <p className="text-xs text-[#756B63] mt-1">Ground Floor, Administrative Block B, Civic Center Plaza, East Gate</p>

              <div className="my-4 p-3 rounded-lg bg-white/90 border border-[#E7DED6] flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#756B63] text-xs">
                  <span className="material-symbols-outlined text-[18px] text-[#6F4E37]">support_agent</span>
                  <span>Helpline Toll Free:</span>
                </div>
                <span className="text-xs font-bold text-[#201A17]">1800-258-1800</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-[#756B63] text-xs">
              <span>Operating: 09:00 - 17:30</span>
              <a href="#map" onClick={(e) => { e.preventDefault(); alert('PSK Central Seva Kendra: Civic Center Plaza, East Gate (Simulated Transit Map)'); }} className="text-[#6F4E37] font-semibold hover:underline inline-flex items-center gap-0.5">
                View Transit Map <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
