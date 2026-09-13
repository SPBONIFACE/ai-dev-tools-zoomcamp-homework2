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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-white">Simulated SMS Log</h3>
            <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-full font-mono">
              {notifications.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
          <Smartphone className="w-4 h-4 shrink-0" />
          <span>Simulated SMS environment for Lean Option C (Homework MVP).</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No SMS alerts sent yet.</p>
              <p className="text-xs text-slate-600 mt-1">Click "Notify" on a waiting party to test.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className="bg-slate-800/70 border border-slate-750 rounded-xl p-3.5 space-y-2 text-left"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-amber-400 font-medium">{notif.phone_number}</span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3" />
                    {new Date(notif.sent_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-sm text-slate-200 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
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
