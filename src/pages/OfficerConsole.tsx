import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Application, ApplicationDocument, OfficerDashboardStats, User } from '../types';

interface OfficerConsoleProps {
  currentUser: User;
  onSelectApplication: (app: Application) => void;
  onPreviewDocument: (doc: ApplicationDocument) => void;
}

export const OfficerConsole: React.FC<OfficerConsoleProps> = ({
  currentUser,
  onSelectApplication,
  onPreviewDocument,
}) => {
  const [stats, setStats] = useState<OfficerDashboardStats | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'all' | 'tatkaal' | 'flagged'>('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [actionRemarks, setActionRemarks] = useState('');
  const [actionToast, setActionToast] = useState<string | null>(null);
  const [batchModal, setBatchModal] = useState(false);
  const [flagModalApp, setFlagModalApp] = useState<Application | null>(null);
  const [flagReasonPreset, setFlagReasonPreset] = useState('Address proof document requires re-verification.');
  const [flagCustomRemarks, setFlagCustomRemarks] = useState('');
  const [consoleError, setConsoleError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [st, apps] = await Promise.all([
        api.getOfficerStats(),
        api.getApplications(),
      ]);
      setStats(st);
      setApplications(apps);
      if (apps.length > 0) {
        setSelectedApp(prev => {
          if (!prev) return apps[0];
          const updated = apps.find(a => a.id === prev.id);
          return updated || apps[0];
        });
      }
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
  }, []);

  const handleGrantPassport = async (appId: number) => {
    setConsoleError(null);
    try {
      const updated = await api.officerApprove(appId, actionRemarks || 'All verification parameters approved.');
      setActionToast(`Application ${updated.application_number} officially Approved.`);
      setTimeout(() => setActionToast(null), 3000);
      loadData();
      if (selectedApp?.id === appId) {
        setSelectedApp(updated);
      }
    } catch (e: any) {
      setConsoleError(e.message || 'Adjudication check failed.');
      setTimeout(() => setConsoleError(null), 6000);
    }
  };

  const handleOpenFlagModal = (app: Application) => {
    setFlagModalApp(app);
    setFlagReasonPreset('Address proof document requires re-verification.');
    setFlagCustomRemarks('');
    setConsoleError(null);
  };

  const handleConfirmFlagDiscrepancy = async () => {
    if (!flagModalApp) return;
    const finalReason = flagCustomRemarks.trim()
      ? `${flagReasonPreset} (${flagCustomRemarks.trim()})`
      : flagReasonPreset;

    try {
      const updated = await api.officerReject(flagModalApp.id, finalReason);
      setActionToast(`Application ${updated.application_number} flagged: ${finalReason}`);
      setTimeout(() => setActionToast(null), 3500);
      setFlagModalApp(null);
      loadData();
      if (selectedApp?.id === flagModalApp.id) {
        setSelectedApp(updated);
      }
    } catch (e: any) {
      setConsoleError(e.message || 'Flag action failed.');
    }
  };

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    if (activeTab === 'tatkaal' && app.priority !== 'Tatkaal') return false;
    if (activeTab === 'flagged' && app.status !== 'Correction Required' && app.status !== 'Rejected') return false;

    if (statusFilter !== 'all') {
      if (statusFilter === 'pending' && app.status !== 'Under Review' && app.status !== 'Submitted') return false;
      if (statusFilter === 'correction' && app.status !== 'Correction Required') return false;
    }

    if (serviceFilter !== 'all') {
      if (serviceFilter === 'fresh' && !app.application_type.includes('Fresh')) return false;
      if (serviceFilter === 'tatkaal' && app.priority !== 'Tatkaal') return false;
      if (serviceFilter === 'renewal' && !app.application_type.includes('Renewal') && !app.application_type.includes('Re-issue')) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = app.application_number.toLowerCase().includes(q);
      const matchName = app.applicant_name.toLowerCase().includes(q);
      const matchUrn = app.urn.toLowerCase().includes(q);
      return matchNum || matchName || matchUrn;
    }

    return true;
  });

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Toast Alert */}
      {actionToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#29231F] text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 text-xs border border-[#E7DED6]/30 animate-in fade-in">
          <span className="material-symbols-outlined text-[18px] text-[#FECAA5]">task_alt</span>
          <span>{actionToast}</span>
        </div>
      )}

      {/* Batch Dispatch Modal */}
      {batchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#29231F]/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-[#E7DED6] p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded bg-[#6F4E37] text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">send</span>
              </div>
              <h3 className="text-base font-bold text-[#201A17]">Batch Dispatch to Consular Security Press</h3>
            </div>
            <p className="text-xs text-[#756B63] leading-relaxed">
              Dispatching 24 approved dossiers from RPO Queue to Government Security Press for contactless e-Passport laser engraving and cryptographic signature generation.
            </p>
            <div className="p-3 bg-[#FEF1EA] rounded border border-[#E7DED6] text-[11px] font-mono text-[#50453E]">
              BATCH-ID: BDIS-2025-R25-0994 | HSM-ENC: OK
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setBatchModal(false)}
                className="px-4 py-2 rounded bg-[#F8ECE5] text-[#201A17] text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setBatchModal(false);
                  setActionToast('Batch Dispatch initiated. Trackers updated for 24 passports.');
                  setTimeout(() => setActionToast(null), 3000);
                }}
                className="px-4 py-2 rounded bg-[#6F4E37] text-white text-xs font-semibold hover:bg-[#4B3621]"
              >
                Execute Transmission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Scrutiny Header Section */}
      <section className="relative w-full rounded-xl bg-white p-6 border border-[#E7DED6] shadow-xs mb-6 overflow-hidden">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-[#F2E6DF] text-[#50453E] text-[11px] font-mono uppercase tracking-wider border border-[#E7DED6]">
                Adjudication Console v2.5
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-[#6F4E37]">
                <span className="w-2 h-2 rounded-full bg-[#6F4E37] animate-pulse"></span>
                Session Active
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#201A17] tracking-tight">
              Passport Officer Scrutiny Console
            </h1>
            <p className="text-xs text-[#756B63] flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[#201A17] font-semibold">
                <span className="material-symbols-outlined text-[16px] text-[#6F4E37]">badge</span>
                Officer Desk: Regional Passport Office (RPO)
              </span>
              <span className="text-neutral-400">•</span>
              <span className="font-mono bg-[#F8ECE5] px-2 py-0.5 rounded text-[#201A17] text-[11px]">
                Officer ID: OFF-4029
              </span>
              <span className="text-neutral-400">•</span>
              <span className="text-[#756B63]">Terminal Security: SHA-256 Validated</span>
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="px-4 py-3 bg-[#FEF1EA] rounded-lg border border-[#E7DED6] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#6F4E37] text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">pending_actions</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#756B63] uppercase tracking-wider font-semibold">Live Queue Status</span>
                <span className="text-sm font-bold text-[#201A17]">18 Applications Pending</span>
                <span className="text-[10px] text-[#82746D]">Awaiting Biometric &amp; Document Review</span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={loadData}
                className="px-3.5 py-2 rounded-lg bg-[#F8ECE5] text-[#201A17] text-xs font-semibold hover:bg-[#F2E6DF] transition-colors flex items-center gap-1.5 border border-[#E7DED6]"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">cached</span>
                <span>Sync DB</span>
              </button>
              <button
                onClick={() => setBatchModal(true)}
                className="px-4 py-2 rounded-lg bg-[#6F4E37] text-white text-xs font-semibold hover:bg-[#4B3621] transition-colors flex items-center gap-1.5 shadow-sm"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Batch Dispatch</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Metric Cards Grid (4 metrics) with visual graphs/sparklines */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Metric 1 */}
        <div className="bg-white rounded-xl p-5 border border-[#E7DED6] shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-[#756B63] uppercase tracking-wider">
                Pending Verification
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-[#201A17]">18</span>
                <span className="text-[11px] text-[#6F4E37] font-bold bg-[#F8ECE5] px-1.5 py-0.5 rounded">
                  Urgent triage
                </span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-[#F8ECE5] text-[#6F4E37]">
              <span className="material-symbols-outlined text-[20px]">assignment_late</span>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-[#E7DED6]/40 flex items-center justify-between text-xs">
            <span className="text-[#82746D]">3 Tatkaal priority items</span>
            <svg className="w-16 h-5 text-[#6F4E37] stroke-current" fill="none" viewBox="0 0 80 24">
              <path d="M0 18 Q20 22 40 10 T80 4" strokeLinecap="round" strokeWidth="2.5" />
            </svg>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-xl p-5 border border-[#E7DED6] shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-[#756B63] uppercase tracking-wider">
                Reviewed Today
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-[#201A17]">24</span>
                <span className="text-[11px] text-[#82746D]">Applications</span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-[#F8ECE5] text-[#4F3A25]">
              <span className="material-symbols-outlined text-[20px]">fact_check</span>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-[#E7DED6]/40 flex items-center justify-between text-xs">
            <span className="text-[#82746D]">+18% above quota target</span>
            <svg className="w-16 h-5 text-[#7C5639] stroke-current" fill="none" viewBox="0 0 80 24">
              <path d="M0 20 L20 16 L40 12 L60 8 L80 2" strokeLinecap="round" strokeWidth="2.5" />
            </svg>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-xl p-5 border border-[#E7DED6] shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-[#756B63] uppercase tracking-wider">
                Approved This Week
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-[#201A17]">112</span>
                <span className="text-[11px] text-[#756B63]">Cleared</span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-[#EAF5ED] text-[#2E6F40]">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-[#E7DED6]/40 flex items-center justify-between text-xs">
            <span className="text-[#82746D]">98.2% acceptance rate</span>
            <div className="w-16 bg-[#E7DED6] rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#2E6F40] h-full rounded-full" style={{ width: '86%' }}></div>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-xl p-5 border border-[#E7DED6] shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-[#756B63] uppercase tracking-wider">
                Correction Requested
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-[#201A17]">7</span>
                <span className="text-[11px] text-[#BA1A1A] font-semibold">Documents</span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-[#FFDAD6] text-[#93000A]">
              <span className="material-symbols-outlined text-[20px]">assignment_return</span>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-[#E7DED6]/40 flex items-center justify-between text-xs">
            <span className="text-[#82746D]">Awaiting citizen re-upload</span>
            <span className="px-1.5 py-0.5 rounded bg-[#F8ECE5] text-[10px] text-[#756B63] font-mono">Avg: 1.4 d</span>
          </div>
        </div>
      </section>

      {/* Filter, Search, and Sort Toolbar */}
      <section className="bg-white rounded-xl p-4 border border-[#E7DED6] shadow-xs mb-6 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#82746D] text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search by Application ID, Citizen Name, or File Number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-[#FEF1EA] text-[#201A17] text-xs rounded-lg border border-[#E7DED6] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#6F4E37] transition-all"
            />
          </div>

          {/* Filter Controls Group */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-[#FEF1EA] px-3 py-1.5 rounded-lg border border-[#E7DED6]">
              <span className="text-[11px] text-[#82746D] font-semibold">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-xs font-semibold text-[#201A17] focus:outline-none cursor-pointer"
              >
                <option value="all">All Records</option>
                <option value="pending">Pending</option>
                <option value="correction">Needs Correction</option>
              </select>
            </div>

            {/* Service Filter */}
            <div className="flex items-center gap-1.5 bg-[#FEF1EA] px-3 py-1.5 rounded-lg border border-[#E7DED6]">
              <span className="text-[11px] text-[#82746D] font-semibold">Service:</span>
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="bg-transparent text-xs font-semibold text-[#201A17] focus:outline-none cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="fresh">Fresh Normal</option>
                <option value="renewal">Renewal / Re-issue</option>
                <option value="tatkaal">Tatkaal Expedited</option>
              </select>
            </div>

            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setServiceFilter('all');
                setActiveTab('all');
              }}
              className="p-2 rounded-lg bg-[#FEF1EA] hover:bg-[#F8ECE5] text-[#756B63] transition-colors border border-[#E7DED6]"
              title="Clear Filters"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">filter_alt_off</span>
            </button>
          </div>
        </div>

        {/* Quick View Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E7DED6]/50">
          <div className="inline-flex p-1 bg-[#FEF1EA] rounded-lg gap-1 border border-[#E7DED6]">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-[#201A17] shadow-xs'
                  : 'text-[#756B63] hover:text-[#201A17]'
              }`}
            >
              All Applications ({applications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tatkaal')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1 ${
                activeTab === 'tatkaal'
                  ? 'bg-white text-[#795336] shadow-xs'
                  : 'text-[#756B63] hover:text-[#201A17]'
              }`}
            >
              <span>Priority Tatkaal</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#FECAA5] text-[#795336] text-[10px] font-bold">
                {applications.filter(a => a.priority === 'Tatkaal').length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('flagged')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1 ${
                activeTab === 'flagged'
                  ? 'bg-white text-[#93000A] shadow-xs'
                  : 'text-[#756B63] hover:text-[#201A17]'
              }`}
            >
              <span>Flagged Discrepancies</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#FFDAD6] text-[#93000A] text-[10px] font-bold">
                {applications.filter(a => a.status === 'Correction Required').length}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#82746D]">
            <span>Sort By:</span>
            <span className="text-[#201A17] font-semibold flex items-center gap-0.5">
              <span>Submission Time</span>
              <span className="material-symbols-outlined text-[15px]">arrow_downward</span>
            </span>
          </div>
        </div>
      </section>

      {/* Application Scrutiny Table Panel */}
      <section className="bg-white rounded-xl border border-[#E7DED6] shadow-xs overflow-hidden mb-6">
        <div className="p-4 bg-[#FEF1EA] border-b border-[#E7DED6] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6F4E37] text-[20px]">table_rows</span>
            <span className="text-sm font-bold text-[#201A17]">Queue Adjudication Docket</span>
            <span className="px-2 py-0.5 rounded bg-[#F2E6DF] text-[#50453E] text-[10px] font-mono">FIFO ORDER</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#756B63]">
            <button
              onClick={() => alert('Audit log exported: R25 Consular Queue Snapshot')}
              className="text-[#6F4E37] hover:underline font-semibold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Export Audit Log</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#FEF1EA]/60 text-[#756B63] text-[11px] font-semibold uppercase tracking-wider border-b border-[#E7DED6]">
                <th className="py-3 px-4">File / App ID</th>
                <th className="py-3 px-4">Applicant Name</th>
                <th className="py-3 px-4">Service Type</th>
                <th className="py-3 px-4">Submission Date</th>
                <th className="py-3 px-4">Biometric Status</th>
                <th className="py-3 px-4">Document Status</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4 text-right">Adjudication Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7DED6]/50 text-xs">
              {filteredApps.map((app) => {
                const isSelected = selectedApp?.id === app.id;
                return (
                  <tr
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#F8ECE5]/80' : 'hover:bg-[#FEF1EA]/50'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#6F4E37]">
                      {app.application_number}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#F2E6DF] text-[#201A17] flex items-center justify-center text-xs font-bold">
                          {app.applicant_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <span className="font-bold text-[#201A17] block leading-tight">{app.applicant_name}</span>
                          <span className="text-[10px] font-mono text-[#82746D]">URN: {app.urn}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-[#F8ECE5] text-[#201A17] text-[11px] font-medium">
                        {app.application_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#756B63]">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F8ECE5] text-[#6F4E37] text-[11px] font-semibold">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        {app.biometric_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                        app.status === 'Correction Required'
                          ? 'bg-[#FFDAD6] text-[#93000A]'
                          : 'bg-[#F8ECE5] text-[#201A17]'
                      }`}>
                        {app.documents_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {app.priority === 'Tatkaal' ? (
                        <span className="px-2 py-0.5 rounded bg-[#FECAA5] text-[#795336] text-[10px] font-bold">
                          High (Tatkaal)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-[#F8ECE5] text-[#756B63] text-[10px]">Normal</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedApp(app);
                        }}
                        className="px-3 py-1.5 rounded bg-[#6F4E37] text-white hover:bg-[#4B3621] text-xs font-semibold shadow-xs"
                      >
                        Scrutinize
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Interactive Adjudication Drawer / Detail Panel (Simulated Split View) */}
      {selectedApp && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Active Applicant Quick Card */}
          <div className="bg-white rounded-xl p-5 border border-[#E7DED6] shadow-xs lg:col-span-1 flex flex-col justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 bg-[#FEF1EA] px-3 py-1.5 rounded-lg border border-[#E7DED6]">
                <span className="text-[10px] font-bold text-[#82746D] uppercase">Active Inspection Dossier</span>
                <span className="text-xs font-mono font-bold text-[#6F4E37]">REC {selectedApp.application_number}</span>
              </div>

              <div className="flex items-start gap-3 mt-1">
                <img
                  className="w-16 h-20 rounded object-cover bg-[#E4D8D1] border border-[#E7DED6] shadow-xs"
                  alt="Applicant photograph"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBG7Fa_mM9Yh_Fs5GE0nRhRdSjaCzgUJD_9BYTLaTl7qoY0p_X1BAMl12fzGKC6ctx_nKuu7va8aG7ZEWM1y6C7AdX2DAnq_phLSn28H6FOlPT5BaASJ3U79URfFZz6cLIIFdUJsMSoZInOAUP2XB489wLUYOvJdUX6DgcomHNMU8YfMLsBgNIYpm6Ggf-dWn8NJOYbBtfW0Xfs_zJjLck5OBXBJ3UgJVVVDPBg-5ztU9JFBP8HdGdo_A"
                />
                <div className="flex flex-col min-w-0">
                  <h2 className="text-base font-bold text-[#201A17] truncate">{selectedApp.applicant_name}</h2>
                  <span className="text-xs text-[#756B63]">DOB: {selectedApp.dob}</span>
                  <span className="text-xs text-[#756B63]">Birthplace: {selectedApp.place_of_birth}</span>
                  <span className="text-xs font-mono text-[#6F4E37] font-semibold mt-1">
                    Nationality: {selectedApp.country_of_birth}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#FEF1EA] border border-[#E7DED6] flex flex-col gap-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#82746D]">Biometric Quality:</span>
                  <span className="font-bold text-[#6F4E37]">99.4% (Tier-A Match)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#82746D]">Police Station Code:</span>
                  <span className="font-bold text-[#201A17]">{selectedApp.police_station_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#82746D]">Prior Passports:</span>
                  <span className="text-[#201A17]">None (First Issue)</span>
                </div>
              </div>

              {selectedApp.officer_remarks && (
                <div className="p-2.5 rounded bg-[#FEF8E7] border border-[#E7DED6] text-xs text-[#756B63]">
                  <strong>Current Remarks:</strong> {selectedApp.officer_remarks}
                </div>
              )}
            </div>

            {consoleError && (
              <div className="mt-3 p-3 rounded-lg bg-[#FFDAD6] border border-[#BA1A1A]/30 text-xs text-[#93000A] flex items-start gap-2 animate-in fade-in">
                <span className="material-symbols-outlined text-[18px] shrink-0 text-[#93000A]">warning</span>
                <div className="flex-1">
                  <span className="font-bold block text-[#93000A]">Adjudication Constraint</span>
                  <span className="text-[#93000A]">{consoleError}</span>
                </div>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-[#E7DED6] flex gap-2">
              <button
                type="button"
                onClick={() => handleGrantPassport(selectedApp.id)}
                className="flex-1 py-2 rounded bg-[#6F4E37] text-white hover:bg-[#4B3621] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">check</span>
                <span>Grant Passport</span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenFlagModal(selectedApp)}
                className="py-2 px-3 rounded bg-[#FFDAD6] text-[#93000A] hover:bg-[#ffcdc8] text-xs font-bold transition-colors flex items-center gap-1"
                title="Flag Discrepancy"
              >
                <span className="material-symbols-outlined text-[16px]">flag</span>
                <span>Flag Discrepancy</span>
              </button>
            </div>
          </div>

          {/* Machine Validation & Database Cross-Check Panel */}
          <div className="bg-white rounded-xl p-5 border border-[#E7DED6] shadow-xs lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 bg-[#FEF1EA] px-3 py-2 rounded-lg border border-[#E7DED6]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#6F4E37] text-[18px]">database</span>
                  <span className="text-xs font-bold text-[#201A17]">Automated Verification Engines (R25 Engine)</span>
                </div>
                <span className="text-[10px] font-mono text-[#82746D]">Simulated Latency: 42ms</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-[#FEF1EA] border border-[#E7DED6] flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#82746D] uppercase font-bold">Aadhaar Bridge</span>
                    <span className="material-symbols-outlined text-[#6F4E37] text-[16px]">check_circle</span>
                  </div>
                  <span className="text-xs font-bold text-[#201A17]">Demographic Match</span>
                  <span className="text-[10px] text-[#82746D]">100% Name &amp; DOB Consistency</span>
                </div>

                <div className="p-3 rounded-lg bg-[#FEF1EA] border border-[#E7DED6] flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#82746D] uppercase font-bold">CCTNS Check</span>
                    <span className="material-symbols-outlined text-[#6F4E37] text-[16px]">check_circle</span>
                  </div>
                  <span className="text-xs font-bold text-[#201A17]">Zero Criminal Flags</span>
                  <span className="text-[10px] text-[#82746D]">Clearance Node: Western Zonal</span>
                </div>

                <div className="p-3 rounded-lg bg-[#FEF1EA] border border-[#E7DED6] flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#82746D] uppercase font-bold">Prior Loss DB</span>
                    <span className="material-symbols-outlined text-[#6F4E37] text-[16px]">check_circle</span>
                  </div>
                  <span className="text-xs font-bold text-[#201A17]">No Blacklist Hit</span>
                  <span className="text-[10px] text-[#82746D]">Revocation Index Clear</span>
                </div>
              </div>

              {/* Document Preview Miniature Tiles */}
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-bold text-[#756B63] uppercase tracking-wider">
                  Uploaded Verification Collateral (Click to Inspect)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(selectedApp.documents && selectedApp.documents.length > 0
                    ? selectedApp.documents
                    : [
                        { id: 101, document_type: 'Proof of Date of Birth', original_filename: 'Proof_of_Birth_Cert.pdf', file_size_kb: 1240, verification_status: 'Verified', stored_filename: 'birth.pdf', uploaded_at: '' },
                        { id: 102, document_type: 'Proof of Residential Address', original_filename: 'Electricity_Bill_Utility.pdf', file_size_kb: 840, verification_status: 'Verified', stored_filename: 'util.pdf', uploaded_at: '' },
                        { id: 103, document_type: 'Proof of Identity', original_filename: 'National_ID_Card.png', file_size_kb: 2450, verification_status: 'Verified', stored_filename: 'id.png', uploaded_at: '' },
                      ]
                  ).map((doc: any) => (
                    <div
                      key={doc.id}
                      onClick={() => onPreviewDocument(doc)}
                      className="p-2.5 rounded-lg bg-[#FEF1EA] border border-[#E7DED6] flex items-center gap-2 hover:bg-[#F8ECE5] transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[#6F4E37] text-[20px]">
                        {doc.original_filename.endsWith('.pdf') ? 'picture_as_pdf' : 'badge'}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-[#201A17] truncate">{doc.original_filename}</span>
                        <span className="text-[10px] text-[#82746D]">
                          {doc.file_size_kb} KB • {doc.verification_status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E7DED6] flex items-center justify-between text-[11px] font-mono text-[#82746D]">
              <span>Officer Decision Timestamp: Simulated Real-time</span>
              <span className="text-[#6F4E37] font-semibold">Adjudication Lock: Exclusive Hold (5m left)</span>
            </div>
          </div>
        </section>
      )}

      {/* Academic Project Notice & Simulation Disclaimer Banner */}
      <section className="w-full rounded-xl bg-[#FEF1EA] p-4 border border-[#E7DED6] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#F2E6DF] text-[#201A17] flex items-center justify-center shrink-0 border border-[#E7DED6]">
            <span className="material-symbols-outlined text-[20px]">school</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#201A17]">Academic Project Demonstration Context</span>
            <p className="text-[11px] text-[#756B63]">
              Academic Project Simulation Mode: All approvals, corrections, and biometric checks simulate MySQL state transitions and state-machine audit pipelines without triggering real governmental credential dispatches.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2.5 py-1 rounded bg-white text-[#756B63] text-[10px] font-mono border border-[#E7DED6]">
            DB: Relational_R25_PAS
          </span>
          <span className="px-2.5 py-1 rounded bg-white text-[#756B63] text-[10px] font-mono border border-[#E7DED6]">
            Role: Scrutiny_Clerk_L2
          </span>
        </div>
      </section>
      {/* Flag Discrepancy & Correction Request Modal */}
      {flagModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#29231F]/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-[#E7DED6] overflow-hidden">
            <div className="bg-[#FFDAD6] p-4 border-b border-[#BA1A1A]/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#93000A]">flag</span>
                <div>
                  <h3 className="font-bold text-sm text-[#93000A]">Flag Adjudication Discrepancy</h3>
                  <span className="text-[11px] text-[#93000A]/80 font-mono">
                    Record: {flagModalApp.application_number} • {flagModalApp.applicant_name}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFlagModalApp(null)}
                className="p-1 rounded text-[#93000A] hover:bg-[#ffcdc8] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#201A17] mb-1">
                  Select Legal Discrepancy Reason <span className="text-[#BA1A1A]">*</span>
                </label>
                <select
                  value={flagReasonPreset}
                  onChange={(e) => setFlagReasonPreset(e.target.value)}
                  className="w-full h-10 px-3 rounded bg-[#FFF8F5] border border-[#E7DED6] text-xs font-medium text-[#201A17] focus:ring-2 focus:ring-[#6F4E37] focus:outline-none"
                >
                  <option value="Address proof document requires re-verification.">Address proof document requires re-verification</option>
                  <option value="Municipal birth certificate stamp unverified or illegible.">Municipal birth certificate stamp unverified or illegible</option>
                  <option value="Demographic mismatch in civil registry OCR handshake.">Demographic mismatch in civil registry OCR handshake</option>
                  <option value="Photograph does not meet ICAO biometric standard (shadow or glare).">Photograph does not meet ICAO biometric standard</option>
                  <option value="Police station jurisdiction record mismatch.">Police station jurisdiction record mismatch</option>
                  <option value="Other legal reservation / document defect.">Other legal reservation / document defect</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#201A17] mb-1">
                  Officer Detailed Remarks & Instructions for Citizen
                </label>
                <textarea
                  rows={3}
                  value={flagCustomRemarks}
                  onChange={(e) => setFlagCustomRemarks(e.target.value)}
                  placeholder="Provide explicit instructions for the applicant regarding the correction required..."
                  className="w-full p-3 rounded bg-[#FFF8F5] border border-[#E7DED6] text-xs text-[#201A17] focus:ring-2 focus:ring-[#6F4E37] focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-lg bg-[#FEF1EA] border border-[#E7DED6] text-[11px] text-[#756B63]">
                <strong>Academic Prototype Behavior:</strong> Submitting will transition application status to <em>Correction Required</em> or <em>Rejected</em>, record audit logs, and trigger real-time applicant notification.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E7DED6]">
                <button
                  type="button"
                  onClick={() => setFlagModalApp(null)}
                  className="px-4 py-2 rounded bg-white text-[#756B63] hover:bg-[#F8ECE5] font-semibold text-xs border border-[#E7DED6]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmFlagDiscrepancy}
                  className="px-4 py-2 rounded bg-[#BA1A1A] text-white hover:bg-[#93000A] font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">flag</span>
                  <span>Confirm Discrepancy Flag</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
