import React, { useState, useEffect } from 'react';
import type { Party, Table, NotificationLog, AnalyticsSummary, CreatePartyInput } from '../types';
import { api } from '../services/api';
import { KPICards } from '../components/KPICards';
import { QueueTable } from '../components/QueueTable';
import { TableGrid } from '../components/TableGrid';
import { AddPartyModal } from '../components/AddPartyModal';
import { SeatModal } from '../components/SeatModal';
import { NotificationDrawer } from '../components/NotificationDrawer';
import { Plus, MessageSquare, RotateCcw, Clock, UtensilsCrossed } from 'lucide-react';

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
    <div className="min-h-screen bg-[#f7f5f0] text-[#2a241e] flex flex-col font-sans">
      {/* Top Maître D' Bar */}
      <header className="border-b border-[#e8e2d8] bg-white/80 backdrop-blur-md sticky top-0 z-30 px-8 py-4 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#faf3ea] border border-[#ebdccb] flex items-center justify-center text-[#b85422] shadow-2xs">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-black text-[#2a241e] tracking-tight">TableHop</h1>
              <p className="text-[10px] text-[#8c8275] tracking-widest uppercase font-semibold">Maître D' Console</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-[#e8e2d8]">
            <span className="bg-[#edf5f0] text-[#226343] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#d0e5d8]">
              Dinner Service Active
            </span>
            {api.isMockMode() && (
              <span className="bg-[#faf3ea] text-[#b85422] text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-[#f0dfcc]">
                Mock Store
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#5c5346] bg-[#faf8f4] px-3.5 py-2 rounded-xl border border-[#e8e2d8]">
            <Clock className="w-3.5 h-3.5 text-[#b85422]" />
            <span className="font-mono">{currentTime}</span>
          </div>

          <button
            onClick={() => setIsNotifDrawerOpen(true)}
            className="relative p-2.5 bg-white hover:bg-[#faf8f4] text-[#5c5346] hover:text-[#2a241e] rounded-xl border border-[#e0d9cd] transition-colors shadow-2xs"
            title="Simulated SMS Dispatch Log"
          >
            <MessageSquare className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#b85422] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {notifications.length}
              </span>
            )}
          </button>

          <button
            onClick={handleResetData}
            title="Reset Mock State"
            className="p-2.5 bg-white hover:bg-[#faf8f4] text-[#8c8275] hover:text-[#2a241e] rounded-xl border border-[#e0d9cd] transition-colors shadow-2xs"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#b85422] hover:bg-[#9e461b] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Walk-In</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-8">
        {/* KPI Row */}
        <KPICards summary={analytics} />

        {/* Operational Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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

      {/* Modals */}
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
