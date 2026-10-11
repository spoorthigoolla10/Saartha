import React, { useState } from 'react';
import { User, NotificationItem } from '../types';
import { api } from '../services/api';

interface NotificationsSettingsPageProps {
  currentUser: User;
  notifications: NotificationItem[];
  onUpdateUser: (u: User) => void;
  onRefreshNotifications: () => void;
}

export const NotificationsSettingsPage: React.FC<NotificationsSettingsPageProps> = ({
  currentUser,
  notifications,
  onUpdateUser,
  onRefreshNotifications,
}) => {
  const [fullName, setFullName] = useState(currentUser.full_name);
  const [phone, setPhone] = useState(currentUser.phone || '+1 (555) 234-5678');
  const [email] = useState(currentUser.email);
  const [savedToast, setSavedToast] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...currentUser,
      full_name: fullName,
      phone,
    };
    api.switchUser(updated);
    onUpdateUser(updated);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleMarkAllRead = async () => {
    for (const notif of notifications) {
      if (!notif.is_read) {
        await api.markNotificationRead(notif.id);
      }
    }
    onRefreshNotifications();
  };

  return (
    <div className="flex flex-col w-full pb-16 space-y-6">
      {/* Toast Alert */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#29231F] text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 text-xs border border-[#E7DED6]/30 animate-in fade-in">
          <span className="material-symbols-outlined text-[18px] text-[#FECAA5]">task_alt</span>
          <span>Profile configuration saved to consular identity registry.</span>
        </div>
      )}

      {/* Header */}
      <div className="pb-4 border-b border-[#E7DED6]">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6F4E37]"></span>
          <span className="text-[11px] font-semibold text-[#82746D] uppercase tracking-wider">
            Identity &amp; Terminal Configuration
          </span>
        </div>
        <h1 className="text-2xl font-bold text-[#201A17] tracking-tight">Notifications &amp; Settings</h1>
        <p className="text-xs text-[#756B63] mt-0.5">
          Manage your verified citizen profile, contact communications, and security credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Profile Card (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-[#E7DED6] shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E7DED6]">
            <span className="material-symbols-outlined text-[#6F4E37] text-[20px]">manage_accounts</span>
            <h3 className="text-xs font-bold text-[#201A17] uppercase tracking-wider">
              Permitted Profile Details
            </h3>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#201A17] mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-10 px-3 rounded bg-[#FFF8F5] border border-[#E7DED6] text-xs text-[#201A17] focus:ring-2 focus:ring-[#6F4E37]"
              />
              <span className="text-[11px] text-[#82746D]">Must match municipal records</span>
            </div>

            <div>
              <label className="block font-semibold text-[#201A17] mb-1">Registered Email (Read-Only Identity Key)</label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full h-10 px-3 rounded bg-[#F8ECE5] border border-[#E7DED6] text-xs text-[#756B63] cursor-not-allowed font-mono"
              />
              <span className="text-[11px] text-[#82746D]">Immutable sovereign account identifier</span>
            </div>

            <div>
              <label className="block font-semibold text-[#201A17] mb-1">Primary Mobile Contact</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 px-3 rounded bg-[#FFF8F5] border border-[#E7DED6] text-xs text-[#201A17] focus:ring-2 focus:ring-[#6F4E37]"
              />
              <span className="text-[11px] text-[#82746D]">Used for real-time dispatch alerts and 2FA authentication</span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded bg-[#6F4E37] text-white hover:bg-[#4B3621] font-semibold text-xs transition-colors shadow-xs"
              >
                Save Profile Updates
              </button>
            </div>
          </form>
        </div>

        {/* Notifications & System Audit (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-[#E7DED6] shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E7DED6]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#6F4E37] text-[20px]">notifications</span>
              <h3 className="text-xs font-bold text-[#201A17] uppercase tracking-wider">
                Recent Portal Alerts
              </h3>
            </div>
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-[#6F4E37] hover:underline font-semibold"
            >
              Mark all as read
            </button>
          </div>

          <div className="space-y-3">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-lg border text-xs transition-colors ${
                  item.is_read ? 'bg-white border-[#E7DED6]' : 'bg-[#FEF1EA] border-[#E7DED6]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-[#201A17]">{item.title}</h4>
                  <span className="text-[10px] text-[#82746D]">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-[#50453E] mt-1 leading-relaxed text-[11px]">{item.message}</p>
              </div>
            ))}
          </div>

          {/* Academic Prototype Reset Button */}
          <div className="pt-4 border-t border-[#E7DED6] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#201A17] block">Prototype Data Sandbox</span>
              <span className="text-[11px] text-[#82746D]">Reset local database to initial demo state</span>
            </div>
            <button
              onClick={() => {
                api.resetDemo();
                onRefreshNotifications();
                setSavedToast(true);
              }}
              className="px-3 py-1.5 rounded bg-[#FEF1EA] text-[#BA1A1A] hover:bg-[#FFDAD6] text-xs font-semibold border border-[#FFDAD6] transition-colors"
            >
              Reset Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
