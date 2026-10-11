import React, { useState } from 'react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User;
  activePath: string;
  onNavigate: (path: string) => void;
  onOpenAuth: () => void;
  onOpenNotifications: () => void;
  unreadCount: number;
  onSwitchUser: (role: 'applicant' | 'officer') => void;
  isLanding?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activePath,
  onNavigate,
  onOpenAuth,
  onOpenNotifications,
  unreadCount,
  onSwitchUser,
  isLanding = false,
}) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FFFFFF] border-b border-[#E7DED6]">
      <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo Zone */}
        <div 
          className="flex items-center gap-3 shrink-0 cursor-pointer"
          onClick={() => onNavigate(isLanding ? 'home' : (currentUser.role === 'officer' ? 'officer-console' : 'dashboard'))}
        >
          <img
            alt="Passport Portal Emblem"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1UC7OtOOIgwsTtf0DLvaREWetioXLF2jL46oL2heQSno2LoNA_Ji5I1Ummut_uiqQ7YUWeTff2WihHxrLQx05rro7LhYANqjRpzLje2wPZuGIRn8qS8SfpnSLjTU1MUNn_obNqcu_2oEKChUNuYZ1mtqp5jgF4XawuaHapC-MfAfnttYJB2B98qryXuUlkeNRNKbzyKB2zcAF8Ewq0C0EwS2dFZ-5KL5Q0RISjiACY9AMH75e_yiQ4yCQCK"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg text-[#201A17] tracking-tight">Passport Portal</span>
            <span className="px-2 py-0.5 rounded bg-[#F2E6DF] text-[#50453E] text-[11px] font-semibold border border-[#E7DED6] uppercase tracking-wider">
              R25 SE Project
            </span>
          </div>
        </div>

        {/* Navigation Zone (Landing Page Navigation) */}
        {isLanding ? (
          <nav className="hidden xl:flex items-center gap-6">
            <button
              onClick={() => onNavigate('home')}
              className={`h-16 flex items-center transition-colors text-[13px] ${
                activePath === 'home'
                  ? 'text-[#6F4E37] font-semibold border-b-2 border-[#6F4E37]'
                  : 'text-[#50453E] hover:text-[#201A17] font-medium'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('how-it-works-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="h-16 flex items-center text-[#50453E] hover:text-[#201A17] transition-colors text-[13px] font-medium"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('matrix-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="h-16 flex items-center text-[#50453E] hover:text-[#201A17] transition-colors text-[13px] font-medium"
            >
              Required Documents
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('faq-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="h-16 flex items-center text-[#50453E] hover:text-[#201A17] transition-colors text-[13px] font-medium"
            >
              FAQs
            </button>
            <button
              onClick={() => onNavigate('application-tracking')}
              className="h-16 flex items-center text-[#50453E] hover:text-[#201A17] transition-colors text-[13px] font-medium"
            >
              Track Application
            </button>
          </nav>
        ) : (
          <div className="hidden lg:flex items-center gap-3 text-xs text-[#756B63]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F8ECE5] text-[#6F4E37] font-medium border border-[#E7DED6]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6F4E37] animate-pulse"></span>
              {currentUser.role === 'officer' ? 'Consular Adjudication Terminal • Desk OFF-4029' : 'Citizen Records Vault • Active Session'}
            </span>
            <span className="text-neutral-400">|</span>
            <span>256-Bit Cryptographic Archival</span>
          </div>
        )}

        {/* Right Actions Cluster */}
        <div className="flex items-center gap-3 shrink-0 relative">
          {/* User Profile Pill / Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2 pr-3 border-r border-[#E7DED6] hover:opacity-90 transition-opacity text-left"
              title="Click to switch role or view details"
            >
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-[#E7DED6]"
                src={
                  currentUser.avatar_url ||
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuD2vkNJFZPDz8w5uHfHQOzOyvauO-AMVSX4A0EA2WP5qg0UZgf1c4vOTRPbWFNG1KZZo_f4v8W6G3swdbmf3G7bY9sTlfLSKRX60_n8nV-xguXOWrU7-IzUJFRyHVLQpuRKmZZQLV0aJsW4lEx45hDE6xQx46dZhRc15q9NPfH6DQnqITiPwzt4MjhvxbwI9MrgbHuCPtEFvBQBOfFeQtjqNpKDnbuXCefLS3vWKAjU8QLPbUk6t0zT4g'
                }
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[13px] font-medium text-[#201A17] leading-tight">
                  {currentUser.full_name}
                </span>
                <span className="text-[11px] text-[#756B63] leading-tight capitalize">
                  {currentUser.role === 'officer' ? `Officer (${currentUser.officer_badge || 'OFF-4029'})` : 'Applicant'}
                </span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-[#756B63]">expand_more</span>
            </button>

            {/* Profile / Role Switcher Popover */}
            {profileMenuOpen && (
              <div 
                className="absolute right-0 top-11 mt-1 w-64 bg-white rounded-lg shadow-lg border border-[#E7DED6] p-2 z-50 animate-in fade-in slide-in-from-top-1"
                onClick={() => setProfileMenuOpen(false)}
              >
                <div className="px-3 py-2 border-b border-[#E7DED6] mb-1">
                  <p className="text-xs font-semibold text-[#201A17]">{currentUser.full_name}</p>
                  <p className="text-[11px] text-[#756B63] truncate">{currentUser.email}</p>
                  <span className="inline-block mt-1 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#F8ECE5] text-[#6F4E37]">
                    Role: {currentUser.role}
                  </span>
                </div>

                <div className="p-1 space-y-1 text-xs">
                  <div className="text-[10px] uppercase text-[#756B63] font-semibold px-2 py-1">Quick Switch Demo Persona</div>
                  <button
                    onClick={() => {
                      onSwitchUser('applicant');
                      onNavigate('dashboard');
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between transition-colors ${
                      currentUser.role === 'applicant' ? 'bg-[#F8ECE5] font-semibold text-[#6F4E37]' : 'hover:bg-[#FEF1EA] text-[#201A17]'
                    }`}
                  >
                    <span>Eleanor Vance (Applicant)</span>
                    {currentUser.role === 'applicant' && <span className="material-symbols-outlined text-[14px]">check</span>}
                  </button>
                  <button
                    onClick={() => {
                      onSwitchUser('officer');
                      onNavigate('officer-console');
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between transition-colors ${
                      currentUser.role === 'officer' ? 'bg-[#F8ECE5] font-semibold text-[#6F4E37]' : 'hover:bg-[#FEF1EA] text-[#201A17]'
                    }`}
                  >
                    <span>Inspector Thorne (Officer Desk)</span>
                    {currentUser.role === 'officer' && <span className="material-symbols-outlined text-[14px]">check</span>}
                  </button>
                </div>

                <div className="border-t border-[#E7DED6] mt-2 pt-1">
                  <button
                    onClick={onOpenAuth}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-[#201A17] hover:bg-[#FEF1EA] rounded flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">manage_accounts</span>
                    <span>Sign into Another Account</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Button */}
          <button
            aria-label="Notifications"
            onClick={onOpenNotifications}
            className="relative p-2 rounded text-[#50453E] hover:text-[#201A17] hover:bg-[#F8ECE5] transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#6F4E37]"></span>
            )}
          </button>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAuth}
              className="px-3 py-1.5 rounded font-medium text-[13px] text-[#201A17] border border-[#E7DED6] hover:bg-[#F8ECE5] transition-colors whitespace-nowrap"
            >
              Sign In
            </button>
            <button
              onClick={() => onNavigate('new-application')}
              className="px-3.5 py-1.5 rounded font-medium text-[13px] bg-[#6F4E37] text-white hover:bg-[#4B3621] transition-colors shadow-sm flex items-center gap-1.5 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>New Application</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
