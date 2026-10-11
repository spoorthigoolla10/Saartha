import React from 'react';
import { NotificationItem } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkRead: (id: number) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#29231F]/30 backdrop-blur-xs">
      <div 
        className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-[#E7DED6] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 bg-[#F8ECE5] border-b border-[#E7DED6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#6F4E37]">notifications_active</span>
            <h3 className="font-semibold text-sm text-[#201A17]">Consular Dispatch Notifications</h3>
            <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-[#FECAA5] text-[#795336]">
              {notifications.filter(n => !n.is_read).length} Unread
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#756B63] hover:text-[#201A17] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto divide-y divide-[#E7DED6]/60 p-2">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-[#756B63] text-sm">
              <span className="material-symbols-outlined text-[32px] text-[#A67B5B] mb-2 block">task_alt</span>
              No pending notifications. Your application records are up to date.
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-lg transition-colors flex items-start gap-3 ${
                  item.is_read ? 'hover:bg-[#F8F5F2]' : 'bg-[#FEF1EA] hover:bg-[#F8ECE5]'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#F2E6DF] flex items-center justify-center text-[#6F4E37] shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">
                    {item.type === 'appointment' ? 'calendar_today' : item.type === 'document' ? 'description' : 'verified'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-semibold text-[#201A17] truncate">{item.title}</h4>
                    <span className="text-[10px] text-[#756B63] whitespace-nowrap">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-[#50453E] mt-1 leading-relaxed">{item.message}</p>
                  {!item.is_read && (
                    <button
                      onClick={() => onMarkRead(item.id)}
                      className="mt-2 text-[11px] font-semibold text-[#6F4E37] hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">done</span>
                      Mark as acknowledged
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-3 bg-[#FFF8F5] border-t border-[#E7DED6] text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium rounded bg-[#F8ECE5] text-[#201A17] hover:bg-[#F2E6DF]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
