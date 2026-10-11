import React from 'react';
import { User } from '../types';

interface SidebarProps {
  activePath: string;
  onNavigate: (path: string) => void;
  currentUser: User;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePath, onNavigate, currentUser }) => {
  const isOfficer = currentUser.role === 'officer';

  const navItemsTop = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', role: 'all' },
    { id: 'new-application', label: 'New Application', icon: 'post_add', role: 'applicant' },
    { id: 'my-applications', label: 'My Applications', icon: 'folder_shared', role: 'all' },
    { id: 'document-vault', label: 'Document Vault', icon: 'verified_user', role: 'all' },
    { id: 'appointment-booking', label: 'Appointment Booking', icon: 'calendar_month', role: 'all' },
    { id: 'application-tracking', label: 'Application Tracking', icon: 'timeline', role: 'all' },
  ];

  const navItemsAdmin = [
    { id: 'officer-console', label: 'Officer Console', icon: 'gavel', role: 'all' },
    { id: 'notifications-settings', label: 'Notifications & Settings', icon: 'settings', role: 'all' },
  ];

  return (
    <aside className="fixed top-16 left-0 bottom-0 w-64 bg-[#FFFFFF] border-r border-[#E7DED6] z-40 flex flex-col justify-between overflow-y-auto">
      <div className="py-4">
        {/* Adjudication & Intake Header */}
        <div className="px-4 pb-2 mb-2 border-b border-[#E7DED6]">
          <span className="text-[11px] font-semibold text-[#82746D] uppercase tracking-wider">
            Adjudication &amp; Intake
          </span>
        </div>

        {/* Primary Navigation Links */}
        <nav className="flex flex-col gap-1 px-2">
          {navItemsTop.map((item) => {
            const isActive = activePath === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                type="button"
                className={`flex items-center gap-3 px-3 py-2 rounded transition-colors text-[13px] font-medium text-left w-full ${
                  isActive
                    ? 'bg-[#6F4E37] text-white border-r-2 border-[#6F4E37] font-semibold shadow-xs'
                    : 'text-[#50453E] hover:bg-[#F8ECE5] hover:text-[#201A17]'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-white' : 'text-[#6F4E37]'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Administrative Divider */}
          <div className="my-2 pt-2 border-t border-[#E7DED6] px-2">
            <span className="text-[11px] font-semibold text-[#82746D] uppercase tracking-wider">
              Administrative
            </span>
          </div>

          {/* Admin Navigation Links */}
          {navItemsAdmin.map((item) => {
            const isActive = activePath === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                type="button"
                className={`flex items-center gap-3 px-3 py-2 rounded transition-colors text-[13px] font-medium text-left w-full ${
                  isActive
                    ? 'bg-[#6F4E37] text-white border-r-2 border-[#6F4E37] font-semibold shadow-xs'
                    : 'text-[#50453E] hover:bg-[#F8ECE5] hover:text-[#201A17]'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-white' : 'text-[#6F4E37]'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {item.id === 'officer-console' && (
                  <span className={`ml-auto text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-[#4B3621] text-[#FECAA5]' : 'bg-[#FECAA5] text-[#795336]'
                  }`}>
                    Desk
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status Strip */}
      <div className="p-4 border-t border-[#E7DED6] bg-[#FEF1EA]/60">
        <div className="flex items-center justify-between text-[#50453E]">
          <span className="text-[11px] font-medium">System Status</span>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#4F3A25]">
            <span className="w-2 h-2 rounded-full bg-[#2E6F40] animate-pulse"></span>
            Encrypted
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between text-[10px] text-[#82746D] font-mono">
          <span>PORTAL: v4.2</span>
          <span>R25-SEC-OK</span>
        </div>
      </div>
    </aside>
  );
};
