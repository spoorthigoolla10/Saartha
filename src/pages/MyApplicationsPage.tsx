import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Application, User } from '../types';

interface MyApplicationsPageProps {
  currentUser: User;
  onNavigate: (path: string) => void;
  onSelectApplication: (app: Application) => void;
  onOpenBooking: (app: Application) => void;
  onOpenPayment: (app: Application) => void;
}

export const MyApplicationsPage: React.FC<MyApplicationsPageProps> = ({
  currentUser,
  onNavigate,
  onSelectApplication,
  onOpenBooking,
  onOpenPayment,
}) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filter, setFilter] = useState<string>('all');

  const loadData = async () => {
    const apps = await api.getApplications(currentUser.role === 'applicant' ? currentUser.id : undefined);
    setApplications(apps);
  };

  useEffect(() => {
    loadData();
    const unsub = api.onDataChange(() => {
      loadData();
    });
    return unsub;
  }, [currentUser]);

  const filtered = applications.filter((app) => {
    if (filter === 'all') return true;
    if (filter === 'active') return app.status === 'Under Review' || app.status === 'Submitted' || app.status === 'Payment Pending' || app.status === 'Correction Required';
    if (filter === 'completed') return app.status === 'Approved';
    if (filter === 'draft') return app.status === 'Draft';
    return true;
  });

  return (
    <div className="flex flex-col w-full pb-16 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E7DED6]">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6F4E37]"></span>
            <span className="text-[11px] font-semibold text-[#82746D] uppercase tracking-wider">
              Citizen Filings Dossier
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#201A17] tracking-tight">My Passport Applications</h1>
          <p className="text-xs text-[#756B63] mt-0.5">
            Full repository of your draft, active, and completed passport applications.
          </p>
        </div>

        <button
          onClick={() => onNavigate('new-application')}
          className="px-4 py-2 rounded bg-[#6F4E37] text-white text-xs font-semibold hover:bg-[#4B3621] transition-colors shadow-xs flex items-center gap-1.5 self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-[16px]">add_circle</span>
          <span>New Application</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1 bg-[#FEF1EA] rounded-lg border border-[#E7DED6] self-start">
        {[
          { id: 'all', label: `All Filings (${applications.length})` },
          { id: 'active', label: 'Active Intake' },
          { id: 'completed', label: 'Completed & Issued' },
          { id: 'draft', label: 'Drafts' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              filter === tab.id
                ? 'bg-white text-[#6F4E37] shadow-xs'
                : 'text-[#756B63] hover:text-[#201A17]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Applications List Cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-8 rounded-xl bg-white border border-[#E7DED6] text-center text-[#756B63] text-xs">
            No applications match the selected filter.
          </div>
        ) : (
          filtered.map((app) => (
            <div
              key={app.id}
              className="p-6 rounded-xl bg-white border border-[#E7DED6] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-[#6F4E37]/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FEF1EA] border border-[#E7DED6] text-[#6F4E37] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">description</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-bold text-[#201A17]">{app.application_number}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      app.status === 'Approved'
                        ? 'bg-[#EAF5ED] text-[#2E6F40]'
                        : app.status === 'Correction Required'
                        ? 'bg-[#FFDAD6] text-[#93000A]'
                        : 'bg-[#FEF8E7] text-[#B37D14]'
                    }`}>
                      {app.status}
                    </span>
                    <span className="text-xs font-mono text-[#82746D]">URN: {app.urn}</span>
                  </div>
                  <p className="text-xs text-[#50453E]">
                    {app.application_type} • {app.priority} Priority • {app.booklet_pages} Pages
                  </p>
                  <p className="text-[11px] text-[#756B63] mt-1">
                    Submitted on {new Date(app.created_at).toLocaleDateString()} • Stage: {app.current_stage}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap self-end md:self-center">
                <button
                  onClick={() => onSelectApplication(app)}
                  className="px-3 py-1.5 rounded bg-[#FEF1EA] hover:bg-[#F8ECE5] text-[#6F4E37] text-xs font-semibold border border-[#E7DED6] transition-colors"
                >
                  Track Dossier
                </button>
                {app.status === 'Payment Pending' && (
                  <button
                    onClick={() => onOpenPayment(app)}
                    className="px-3 py-1.5 rounded bg-[#6F4E37] text-white hover:bg-[#4B3621] text-xs font-semibold shadow-xs"
                  >
                    Pay Statutory Fee
                  </button>
                )}
                <button
                  onClick={() => onOpenBooking(app)}
                  className="px-3 py-1.5 rounded bg-[#F8ECE5] hover:bg-[#F2E6DF] text-[#201A17] text-xs font-semibold border border-[#E7DED6] transition-colors"
                >
                  Appointment
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
