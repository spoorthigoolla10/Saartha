import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Application, User } from '../types';

interface AppointmentBookingPageProps {
  currentUser: User;
  onOpenBookingModal: (app: Application) => void;
}

export const AppointmentBookingPage: React.FC<AppointmentBookingPageProps> = ({
  currentUser,
  onOpenBookingModal,
}) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

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

  const handleCancelAppointment = async (appointmentId: number) => {
    await api.cancelAppointment(appointmentId);
    setToastMsg('Appointment slot cancelled. Biometric status reset to Pending Slot.');
    setTimeout(() => setToastMsg(null), 3000);
    loadData();
  };

  const appsWithAppointment = applications.filter(a => a.appointment && a.appointment.status === 'Scheduled');
  const appsEligibleForBooking = applications.filter(a => !a.appointment || a.appointment.status !== 'Scheduled');

  return (
    <div className="flex flex-col w-full pb-16 space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#29231F] text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 text-xs border border-[#E7DED6]/30 animate-in fade-in">
          <span className="material-symbols-outlined text-[18px] text-[#FECAA5]">event_busy</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E7DED6]">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6F4E37]"></span>
            <span className="text-[11px] font-semibold text-[#82746D] uppercase tracking-wider">
              Biometric Enrollment Scheduling
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#201A17] tracking-tight">Passport Seva Kendra Appointments</h1>
          <p className="text-xs text-[#756B63] mt-0.5">
            Reserve biometric and identity verification windows at official regional consular centers.
          </p>
        </div>
      </div>

      {/* Active Appointments Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-[#201A17] uppercase tracking-wider">
          Currently Reserved Biometric Desks
        </h2>

        {appsWithAppointment.length === 0 ? (
          <div className="p-8 rounded-xl bg-white border border-[#E7DED6] text-center text-[#756B63] text-xs">
            <span className="material-symbols-outlined text-[32px] text-[#A67B5B] mb-2 block">event_available</span>
            No active appointment reservations found. You can reserve an available window below.
          </div>
        ) : (
          appsWithAppointment.map((app) => (
            <div
              key={app.id}
              className="p-6 rounded-xl bg-white border border-[#E7DED6] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F8ECE5] text-[#6F4E37] flex items-center justify-center shrink-0 border border-[#E7DED6]">
                  <span className="material-symbols-outlined text-[24px]">calendar_today</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-[#201A17]">
                      {app.appointment?.center_name}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#EAF5ED] text-[#2E6F40] text-[10px] font-bold">
                      Confirmed
                    </span>
                    <span className="text-xs font-mono text-[#82746D]">({app.application_number})</span>
                  </div>
                  <p className="text-xs text-[#50453E]">
                    <strong>Date &amp; Time:</strong> {app.appointment?.appointment_date} at <strong>{app.appointment?.time_slot}</strong> • {app.appointment?.station_desk}
                  </p>
                  <p className="text-[11px] text-[#756B63] mt-1">
                    Applicant: <strong>{app.applicant_name}</strong> • 3 original documents required
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onOpenBookingModal(app)}
                  className="px-4 py-2 rounded bg-[#FEF1EA] text-[#6F4E37] hover:bg-[#F8ECE5] text-xs font-semibold border border-[#E7DED6] transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">edit_calendar</span>
                  <span>Reschedule</span>
                </button>
                <button
                  onClick={() => app.appointment && handleCancelAppointment(app.appointment.id)}
                  className="px-4 py-2 rounded bg-white text-[#BA1A1A] hover:bg-[#FFDAD6]/30 text-xs font-semibold border border-[#FFDAD6] transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">cancel</span>
                  <span>Cancel Slot</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Eligible Filings for Booking */}
      <div className="space-y-4 pt-4">
        <h2 className="text-sm font-bold text-[#201A17] uppercase tracking-wider">
          Available Filings Awaiting Appointment
        </h2>

        {appsEligibleForBooking.length === 0 ? (
          <div className="p-6 rounded-xl bg-[#FEF1EA] border border-[#E7DED6] text-xs text-[#50453E]">
            All current filings have scheduled appointments or are completed.
          </div>
        ) : (
          appsEligibleForBooking.map((app) => (
            <div
              key={app.id}
              className="p-5 rounded-xl bg-white border border-[#E7DED6] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-[#201A17]">{app.application_number}</h4>
                  <span className="text-xs text-[#756B63]">({app.application_type})</span>
                  <span className="px-2 py-0.2 rounded text-[10px] font-semibold bg-[#FEF8E7] text-[#B37D14]">
                    {app.status}
                  </span>
                </div>
                <p className="text-[11px] text-[#756B63] mt-1">
                  Applicant: {app.applicant_name} • Current Stage: {app.current_stage}
                </p>
              </div>

              <button
                onClick={() => onOpenBookingModal(app)}
                className="px-4 py-2 rounded bg-[#6F4E37] text-white hover:bg-[#4B3621] text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[16px]">add_task</span>
                <span>Book Biometric Slot</span>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Consular Desk Advisory */}
      <div className="p-4 rounded-xl bg-[#F8ECE5] border border-[#E7DED6] text-xs text-[#50453E] space-y-2">
        <span className="font-bold text-[#201A17] block">Standard Operating Rules for Appointments:</span>
        <p>• Applicants must arrive 15 minutes prior to their reserved window with all primary civil proofs.</p>
        <p>• Reschedulings are allowed up to 2 times within a 12-month period from payment.</p>
        <p>• Collision detection guarantees exclusive desk reservation for high-speed biometric enrollment.</p>
      </div>
    </div>
  );
};
