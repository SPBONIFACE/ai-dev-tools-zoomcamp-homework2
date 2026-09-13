import React from 'react';
import { X, MessageSquare, Clock, Smartphone } from 'lucide-react';
import type { NotificationLog } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationLog[];
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#1c1917]/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#fcfbf9] border-l border-[#e8e2d8] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        <div className="px-7 py-5 border-b border-[#f0eae1] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#edf3f8] border border-[#d2e0ec] flex items-center justify-center text-[#2c5282]">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#2a241e]">SMS Dispatch Log</h3>
              <p className="text-[11px] text-[#8c8275]">Simulated guest notifications</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8c8275] hover:text-[#2a241e] p-1.5 rounded-lg hover:bg-[#f5f1ea] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-3 bg-[#faf5ee] border-b border-[#ebdccb] text-xs text-[#8c522e] flex items-center gap-2">
          <Smartphone className="w-4 h-4 shrink-0 text-[#b85422]" />
          <span>Simulated cellular dispatch feed for testing.</span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3.5">
          {notifications.length === 0 ? (
            <div className="text-center py-20 text-[#a89f91]">
              <MessageSquare className="w-10 h-10 mx-auto mb-2.5 opacity-30" />
              <p className="font-serif text-base text-[#716657]">No SMS alerts sent yet</p>
              <p className="text-xs text-[#8c8275] mt-1">Click "Notify" on any waiting party to simulate.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className="bg-white border border-[#e8e2d8] rounded-2xl p-4 space-y-2.5 shadow-2xs text-left"
              >
                <div className="flex items-center justify-between text-xs text-[#8c8275]">
                  <span className="font-mono text-[#b85422] font-semibold">{notif.phone_number}</span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3" />
                    {new Date(notif.sent_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-xs text-[#4a4034] bg-[#faf8f4] p-3 rounded-xl border border-[#ede7de] leading-relaxed">
                  {notif.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
