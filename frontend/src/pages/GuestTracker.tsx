import React, { useState, useEffect } from 'react';
import type { Party } from '../types';
import { api } from '../services/api';
import { Clock, Users, ArrowLeft, AlertTriangle, CheckCircle2, BellRing, Sparkles, UtensilsCrossed } from 'lucide-react';

interface GuestTrackerProps {
  partyId: string;
  onBackToDashboard: () => void;
}

export const GuestTracker: React.FC<GuestTrackerProps> = ({ partyId, onBackToDashboard }) => {
  const [party, setParty] = useState<Party | null>(null);
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const loadData = async () => {
    try {
      const [currentParty, allParties] = await Promise.all([
        api.getParty(partyId),
        api.getWaitlist(),
      ]);
      setParty(currentParty);
      setParties(allParties);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, [partyId]);

  const handleLeaveLine = async () => {
    if (!party) return;
    if (!window.confirm('Are you sure you want to leave the waitlist? This will give up your spot in line.')) {
      return;
    }

    setCancelling(true);
    try {
      await api.cancelParty(party.id);
      setCancelled(true);
      await loadData();
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5f0] flex items-center justify-center p-4">
        <div className="font-serif text-[#b85422] text-lg font-semibold animate-pulse">
          Locating your table status...
        </div>
      </div>
    );
  }

  if (!party) {
    return (
      <div className="min-h-screen bg-[#f7f5f0] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#2a241e] mb-2">Reservation Expired</h2>
        <p className="text-sm text-[#716657] mb-6">This waitlist entry is no longer active.</p>
        <button
          onClick={onBackToDashboard}
          className="px-5 py-2.5 bg-[#b85422] text-white rounded-xl text-sm font-semibold shadow-xs"
        >
          Return to Host Console
        </button>
      </div>
    );
  }

  const activeQueue = parties.filter((p) => p.status === 'waiting' || p.status === 'notified');
  const positionIndex = activeQueue.findIndex((p) => p.id === party.id);
  const position = positionIndex >= 0 ? positionIndex + 1 : null;

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#2a241e] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      {/* Mobile Guest Card Frame */}
      <div className="w-full max-w-sm bg-white border border-[#e8e2d8] rounded-3xl p-7 shadow-[0_4px_24px_-4px_rgba(40,30,20,0.06)] space-y-6 text-center relative overflow-hidden">
        {/* Top Accent Strip */}
        <div className="h-1.5 bg-[#b85422] absolute top-0 left-0 right-0"></div>

        {/* Back Link & Brand */}
        <div className="flex items-center justify-between pb-3 border-b border-[#f0eae1]">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1 text-xs text-[#8c8275] hover:text-[#2a241e] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Host Stand</span>
          </button>
          <div className="flex items-center gap-1.5 font-serif font-bold text-[#b85422] text-sm">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>TableHop</span>
          </div>
        </div>

        {/* Guest Greeting */}
        <div className="space-y-1">
          <span className="text-[10px] font-semibold text-[#8c8275] tracking-widest uppercase">
            Guest Live Tracker
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#2a241e]">{party.guest_name}</h1>
          <div className="inline-flex items-center gap-1.5 text-xs text-[#5c5346] bg-[#faf8f4] px-3 py-1 rounded-full border border-[#e8e2d8] mt-1">
            <Users className="w-3.5 h-3.5 text-[#b85422]" />
            <span>Party of {party.party_size}</span>
          </div>
        </div>

        {/* Dynamic Status Blocks */}
        {party.status === 'notified' ? (
          <div className="bg-[#edf3f8] border border-[#d2e0ec] rounded-2xl p-6 space-y-2.5 text-center animate-bounce">
            <BellRing className="w-10 h-10 text-[#2c5282] mx-auto" />
            <h3 className="font-serif text-xl font-bold text-[#2c5282]">Your Table is Ready!</h3>
            <p className="text-xs text-[#4a5568] leading-relaxed">
              Please present this screen to the maître d' at the front desk.
            </p>
          </div>
        ) : party.status === 'seated' ? (
          <div className="bg-[#edf5f0] border border-[#d0e5d8] rounded-2xl p-6 space-y-2.5 text-center">
            <CheckCircle2 className="w-10 h-10 text-[#226343] mx-auto" />
            <h3 className="font-serif text-xl font-bold text-[#226343]">You are Seated</h3>
            <p className="text-xs text-[#4a5568]">We hope you enjoy your dining experience!</p>
          </div>
        ) : party.status === 'cancelled' || cancelled ? (
          <div className="bg-[#faf8f4] border border-[#e8e2d8] rounded-2xl p-6 space-y-2.5 text-center">
            <AlertTriangle className="w-10 h-10 text-[#b85422] mx-auto" />
            <h3 className="font-serif text-xl font-bold text-[#2a241e]">Party Removed</h3>
            <p className="text-xs text-[#8c8275]">
              You have left the waitlist. Speak to the host if this was done in error.
            </p>
          </div>
        ) : (
          /* Active Waiting Queue Position */
          <div className="bg-[#faf8f4] border border-[#e8e2d8] rounded-2xl p-6 space-y-4">
            <div>
              <p className="text-[11px] font-semibold text-[#8c8275] uppercase tracking-wider">
                Position in Line
              </p>
              <div className="font-serif text-6xl font-black text-[#b85422] mt-1">
                {position ? `#${position}` : '—'}
              </div>
              <p className="text-xs text-[#716657] mt-1 font-medium">
                {position === 1 ? 'You are next to be seated!' : `${(position || 1) - 1} parties ahead of you`}
              </p>
            </div>

            <div className="pt-4 border-t border-[#e8e2d8] grid grid-cols-2 gap-2 text-center">
              <div>
                <span className="text-[10px] text-[#8c8275] uppercase font-semibold flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3 text-[#b85422]" />
                  Est. Wait
                </span>
                <p className="text-lg font-serif font-bold text-[#2a241e] mt-0.5">
                  ~{party.quoted_wait_min}m
                </p>
              </div>
              <div className="border-l border-[#e8e2d8]">
                <span className="text-[10px] text-[#8c8275] uppercase font-semibold flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#226343]" />
                  Status
                </span>
                <p className="text-lg font-serif font-bold text-[#b85422] mt-0.5 capitalize">Waiting</p>
              </div>
            </div>
          </div>
        )}

        {/* Self-Service Cancellation */}
        {(party.status === 'waiting' || party.status === 'notified') && (
          <div className="pt-2">
            <button
              onClick={handleLeaveLine}
              disabled={cancelling}
              className="w-full py-2.5 px-4 bg-white hover:bg-[#fcf0f0] text-[#8c8275] hover:text-[#9b2c2c] border border-[#e0d9cd] hover:border-[#f5d0d0] rounded-xl text-xs font-semibold transition-all shadow-2xs"
            >
              {cancelling ? 'Updating status...' : 'Leave Waitlist / Cancel Spot'}
            </button>
            <p className="text-[11px] text-[#a89f91] mt-2">
              Plans changed? Leaving lets the kitchen pace other waiting guests.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
