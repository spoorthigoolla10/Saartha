import React, { useState } from 'react';
import { api } from '../services/api';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'register') {
        if (!fullName.trim()) throw new Error('Please enter your full legal name.');
        if (!email.trim() || !email.includes('@')) throw new Error('Please enter a valid email address.');
        if (password.length < 6) throw new Error('Password must be at least 6 characters.');
        if (password !== confirmPassword) throw new Error('Passwords do not match.');

        const user = await api.register(fullName, email, password);
        onSuccess(user);
        onClose();
      } else {
        if (!email.trim()) throw new Error('Please enter your email.');
        if (!password.trim()) throw new Error('Please enter your password.');

        const user = await api.login(email);
        onSuccess(user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: 'applicant' | 'officer') => {
    if (role === 'applicant') {
      const user = api.login('eleanor.vance@example.com');
      user.then(u => {
        onSuccess(u);
        onClose();
      });
    } else {
      const user = api.login('officer.rpo@passport.gov.in');
      user.then(u => {
        onSuccess(u);
        onClose();
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#29231F]/40 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-md bg-white rounded-xl shadow-xl border border-[#E7DED6] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="bg-[#F8ECE5] p-5 border-b border-[#E7DED6] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#6F4E37] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">shield</span>
            </div>
            <div>
              <h3 className="font-semibold text-[#201A17] text-base">
                {mode === 'login' ? 'Consular Portal Authentication' : 'Citizen Registration'}
              </h3>
              <p className="text-xs text-[#756B63]">R25 Software Engineering Project Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#756B63] hover:text-[#201A17] hover:bg-[#F2E6DF] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b border-[#E7DED6] bg-[#FEF1EA]/50">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-3 text-xs font-semibold text-center transition-colors border-b-2 ${
              mode === 'login'
                ? 'border-[#6F4E37] text-[#6F4E37] bg-white'
                : 'border-transparent text-[#756B63] hover:text-[#201A17]'
            }`}
          >
            Portal Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-3 text-xs font-semibold text-center transition-colors border-b-2 ${
              mode === 'register'
                ? 'border-[#6F4E37] text-[#6F4E37] bg-white'
                : 'border-transparent text-[#756B63] hover:text-[#201A17]'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[#FFDAD6] border border-[#BA1A1A]/30 text-[#93000A] text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Access Buttons */}
          <div className="mb-5 p-3 rounded-lg bg-[#F8ECE5]/70 border border-[#E7DED6]">
            <div className="text-[11px] font-semibold text-[#756B63] uppercase tracking-wider mb-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#6F4E37]">key</span>
              <span>One-Click Academic Evaluation Access</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('applicant')}
                className="px-2.5 py-1.5 rounded bg-white hover:bg-[#F2E6DF] text-[#201A17] text-xs font-medium border border-[#E7DED6] transition-colors flex items-center gap-1.5 justify-center shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px] text-[#6F4E37]">person</span>
                <span>Eleanor (Applicant)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('officer')}
                className="px-2.5 py-1.5 rounded bg-white hover:bg-[#F2E6DF] text-[#201A17] text-xs font-medium border border-[#E7DED6] transition-colors flex items-center gap-1.5 justify-center shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px] text-[#6F4E37]">gavel</span>
                <span>Inspector (Officer)</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-[#201A17] mb-1">
                  Full Legal Name <span className="text-[#BA1A1A]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eleanor Jane Vance"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-10 px-3 rounded bg-[#FFF8F5] border border-[#E7DED6] text-sm text-[#201A17] focus:outline-none focus:ring-2 focus:ring-[#6F4E37] focus:bg-white"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#201A17] mb-1">
                Email Address <span className="text-[#BA1A1A]">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="citizen@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 rounded bg-[#FFF8F5] border border-[#E7DED6] text-sm text-[#201A17] focus:outline-none focus:ring-2 focus:ring-[#6F4E37] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#201A17] mb-1">
                Password <span className="text-[#BA1A1A]">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 px-3 rounded bg-[#FFF8F5] border border-[#E7DED6] text-sm text-[#201A17] focus:outline-none focus:ring-2 focus:ring-[#6F4E37] focus:bg-white"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-[#201A17] mb-1">
                  Confirm Password <span className="text-[#BA1A1A]">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-10 px-3 rounded bg-[#FFF8F5] border border-[#E7DED6] text-sm text-[#201A17] focus:outline-none focus:ring-2 focus:ring-[#6F4E37] focus:bg-white"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 mt-2 rounded bg-[#6F4E37] text-white hover:bg-[#4B3621] font-medium text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">
                    {mode === 'login' ? 'login' : 'how_to_reg'}
                  </span>
                  <span>{mode === 'login' ? 'Enter Consular Portal' : 'Register Account'}</span>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[11px] text-[#756B63] mt-4">
            Protected under 256-Bit TLS. All officer decisions and submissions are simulated.
          </p>
        </div>
      </div>
    </div>
  );
};
