import React, { useState } from 'react';
import { api } from '../services/api';
import { Application } from '../types';

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application;
  onBookingSuccess: () => void;
}

export const AppointmentBookingModal: React.FC<AppointmentBookingModalProps> = ({
  isOpen,
  onClose,
  application,
  onBookingSuccess,
}) => {
  const centers = [
    { name: 'PSK Central Seva Kendra', address: 'Ground Floor, Administrative Block B, Civic Center Plaza, East Gate' },
    { name: 'Post Office PSK North Gate', address: 'Main Post Office Complex, Rajpath Road, North Gate Sector 4' },
    { name: 'PSK Metro South Hub', address: 'Concourse Level 2, Metro Transit Building, South Terminal' },
  ];

  const timeSlots = [
    '09:00 AM',
    '09:45 AM',
    '10:30 AM',
    '11:15 AM',
    '02:00 PM',
    '02:45 PM',
    '03:30 PM',
  ];

  // Default date to next business day
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [selectedCenter, setSelectedCenter] = useState(centers[0].name);
  const [selectedDate, setSelectedDate] = useState(defaultDateStr);
  const [selectedSlot, setSelectedSlot] = useState(timeSlots[2]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await api.bookAppointment(application.id, selectedCenter, selectedDate, selectedSlot);
      setSuccessMsg(`Slot successfully confirmed for ${selectedDate} at ${selectedSlot}.`);
      setTimeout(() => {
        onBookingSuccess();
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to reserve appointment slot.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#29231F]/40 backdrop-blur-xs">
      <div 
        className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-[#E7DED6] overflow-hidden animate-in fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 bg-[#F8ECE5] border-b border-[#E7DED6] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#6F4E37] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">calendar_month</span>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#201A17]">Schedule PSK Biometric Window</h3>
              <p className="text-[11px] text-[#756B63]">Application {application.application_number}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-[#756B63] hover:text-[#201A17]">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleBook} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-[#FFDAD6] border border-[#BA1A1A]/30 text-[#93000A] text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-[#EAF5ED] border border-[#2E6F40]/30 text-[#2E6F40] text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Center Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#201A17] mb-1.5 uppercase tracking-wider">
              Passport Seva Kendra (PSK) Location
            </label>
            <div className="space-y-2">
              {centers.map((c) => (
                <label
                  key={c.name}
                  className={`p-3 rounded-lg border flex items-start gap-2.5 cursor-pointer transition-all ${
                    selectedCenter === c.name
                      ? 'border-[#6F4E37] bg-[#F8ECE5]'
                      : 'border-[#E7DED6] bg-white hover:bg-[#FFF8F5]'
                  }`}
                >
                  <input
                    type="radio"
                    name="center"
                    checked={selectedCenter === c.name}
                    onChange={() => setSelectedCenter(c.name)}
                    className="mt-0.5 text-[#6F4E37] accent-[#6F4E37]"
                  />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-[#201A17]">{c.name}</p>
                    <p className="text-[11px] text-[#756B63] leading-tight mt-0.5">{c.address}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-[#201A17] mb-1 uppercase tracking-wider">
              Select Appointment Date
            </label>
            <input
              type="date"
              required
              min={defaultDateStr}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full h-10 px-3 rounded bg-[#FFF8F5] border border-[#E7DED6] text-xs text-[#201A17] focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
            />
          </div>

          {/* Available Slots Grid */}
          <div>
            <label className="block text-xs font-semibold text-[#201A17] mb-1.5 uppercase tracking-wider">
              Available Queue Slots (30 min Adjudication Window)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2 px-1 text-center rounded text-xs font-medium border transition-colors ${
                    selectedSlot === slot
                      ? 'bg-[#6F4E37] text-white border-[#6F4E37] font-semibold'
                      : 'bg-white text-[#201A17] border-[#E7DED6] hover:bg-[#F8ECE5]'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#FEF1EA] text-[11px] text-[#50453E] flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#6F4E37]">verified</span>
            <span>Appointment slots prevent overlapping counter queues and ensure biometric desk availability.</span>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded bg-[#F8ECE5] text-[#201A17] hover:bg-[#F2E6DF] text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded bg-[#6F4E37] text-white hover:bg-[#4B3621] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
            >
              {loading ? (
                <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">check</span>
                  <span>Confirm Slot Reservation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
