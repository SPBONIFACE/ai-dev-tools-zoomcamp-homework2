import React, { useState, useEffect } from 'react';
import type { Party, Table, NotificationLog, AnalyticsSummary, CreatePartyInput } from '../types';
import { api } from '../services/api';
import { KPICards } from '../components/KPICards';
import { QueueTable } from '../components/QueueTable';
import { TableGrid } from '../components/TableGrid';
import { AddPartyModal } from '../components/AddPartyModal';
import { SeatModal } from '../components/SeatModal';
import { NotificationDrawer } from '../components/NotificationDrawer';
import { Plus, MessageSquare, RotateCcw, Clock } from 'lucide-react';

interface HostDashboardProps {
  onOpenGuestView: (partyId: string) => void;
}

export const HostDashboard: React.FC<HostDashboardProps> = ({ onOpenGuestView }) => {
  const [parties, setParties] = useState<Party[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary>({
    active_waiting: 0,
    avg_wait_min: 0,
    total_seated_today: 0,
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [seatModalParty, setSeatModalParty] = useState<Party | null>(null);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const refreshAll = async () => {
    try {
      const [waitlistData, tablesData, notifData, analyticsData] = await Promise.all([
        api.getWaitlist(),
        api.getTables(),
        api.getNotifications(),
        api.getAnalyticsSummary(),
      ]);
      setParties(waitlistData);
      setTables(tablesData);
      setNotifications(notifData);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  // Actions
  const handleAddParty = async (data: CreatePartyInput) => {
    await api.addParty(data);
    await refreshAll();
  };

  const handleNotifyParty = async (partyId: string) => {
    await api.notifyParty(partyId);
    await refreshAll();
  };

  const handleSeatParty = async (tableId: string, partyId: string) => {
    await api.seatParty(tableId, partyId);
    await refreshAll();
  };

  const handleClearTable = async (tableId: string) => {
    await api.clearTable(tableId);
    await refreshAll();
  };

  const handleCancelParty = async (partyId: string) => {
    await api.cancelParty(partyId);
    await refreshAll();
  };

  const handleResetData = () => {
    if (window.confirm('Reset all waitlist and table data to default demo state?')) {
      api.resetMockData();
      refreshAll();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-bold text-lg text-white">
            <span className="text-2xl">🍽️</span>
            <span className="tracking-tight font-extrabold text-amber-400">TableHop</span>
          </div>
          <span className="bg-slate-800 text-slate-300 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-slate-700">
            Host Console
          </span>
          {api.isMockMode() && (
            <span className="bg-emerald-500/10 text-emerald-400 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Mock Store Active
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono">{currentTime}</span>
          </div>

          <button
            onClick={() => setIsNotifDrawerOpen(true)}
            className="relative p-2 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors"
            title="Simulated SMS Notifications"
          >
            <MessageSquare className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          <button
            onClick={handleResetData}
            title="Reset Mock State"
            className="p-2 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white rounded-lg border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-2 rounded-lg text-sm font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Party</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        {/* KPI Summary Cards */}
        <KPICards summary={analytics} />

        {/* Operational Grid: Queue (left) + Tables (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <QueueTable
              parties={parties}
              onNotify={handleNotifyParty}
              onOpenSeatModal={(party) => setSeatModalParty(party)}
              onCancel={handleCancelParty}
              onOpenGuestView={onOpenGuestView}
            />
          </div>

          <div className="lg:col-span-4 space-y-6">
            <TableGrid tables={tables} parties={parties} onClearTable={handleClearTable} />
          </div>
        </div>
      </main>

      {/* Modals & Slide-overs */}
      <AddPartyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddParty}
        activeWaitingCount={analytics.active_waiting}
      />

      <SeatModal
        isOpen={!!seatModalParty}
        party={seatModalParty}
        tables={tables}
        onClose={() => setSeatModalParty(null)}
        onConfirmSeat={handleSeatParty}
      />

      <NotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
        notifications={notifications}
      />
    </div>
  );
};
