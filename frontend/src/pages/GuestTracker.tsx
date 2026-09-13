import React, { useState, useEffect } from 'react';
import type { Party } from '../types';
import { api } from '../services/api';
import { Clock, Users, ArrowLeft, AlertTriangle, CheckCircle2, BellRing, Sparkles } from 'lucide-react';

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
    if (!window.confirm('Are you sure you want to leave the waitlist? This will give your spot away.')) {
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-amber-400 font-medium animate-pulse">Loading queue status...</div>
      </div>
    );
  }

  if (!party) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Party Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">This waitlist entry does not exist or has expired.</p>
        <button
          onClick={onBackToDashboard}
          className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm"
        >
          Return to Host Dashboard
        </button>
      </div>
    );
  }

  // Calculate position ahead
  const activeQueue = parties.filter((p) => p.status === 'waiting' || p.status === 'notified');
  const positionIndex = activeQueue.findIndex((p) => p.id === party.id);
  const position = positionIndex >= 0 ? positionIndex + 1 : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Host Console
          </button>
          <div className="flex items-center gap-1.5 font-bold text-amber-400 text-sm tracking-wide">
            <span>🍽️ TableHop</span>
          </div>
        </div>

        {/* Guest Greeting */}
        <div className="text-center space-y-1">
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Live Waitlist Status</p>
          <h1 className="text-2xl font-bold text-white">{party.guest_name}</h1>
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full mt-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            Party of {party.party_size}
          </div>
        </div>

        {/* Status Highlight Card */}
        {party.status === 'notified' ? (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-5 text-center space-y-2 animate-bounce">
            <BellRing className="w-10 h-10 text-blue-400 mx-auto" />
            <h3 className="text-lg font-bold text-blue-300">Your Table is Ready!</h3>
            <p className="text-xs text-slate-300">
              Please proceed to the host stand immediately to be seated.
            </p>
          </div>
        ) : party.status === 'seated' ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-emerald-300">You are Seated!</h3>
            <p className="text-xs text-slate-300">Enjoy your meal at TableHop.</p>
          </div>
        ) : party.status === 'cancelled' || cancelled ? (
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 text-center space-y-2">
            <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-200">Waitlist Cancelled</h3>
            <p className="text-xs text-slate-400">
              You have left the line. Please visit the host stand if this was a mistake.
            </p>
          </div>
        ) : (
          /* Active Waiting State */
          <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Your Position</p>
              <div className="text-5xl font-black text-amber-400 mt-1">
                {position ? `#${position}` : '—'}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {position === 1 ? 'You are next in line!' : `${(position || 1) - 1} parties ahead of you`}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-700/60 flex items-center justify-around text-center">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-medium flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  Est. Wait
                </span>
                <p className="text-lg font-bold text-white mt-0.5">~{party.quoted_wait_min}m</p>
              </div>
              <div className="h-8 w-[1px] bg-slate-700"></div>
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-medium flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3 text-blue-400" />
                  Status
                </span>
                <p className="text-lg font-bold text-amber-400 mt-0.5 capitalize">Waiting</p>
              </div>
            </div>
          </div>
        )}

        {/* Self-Service Cancellation ("Leave Line") */}
        {(party.status === 'waiting' || party.status === 'notified') && (
          <div className="pt-2">
            <button
              onClick={handleLeaveLine}
              disabled={cancelling}
              className="w-full py-3 px-4 bg-slate-800/80 hover:bg-red-500/10 hover:border-red-500/30 text-slate-400 hover:text-red-400 border border-slate-800 rounded-xl text-xs font-semibold transition-all"
            >
              {cancelling ? 'Leaving Line...' : 'Leave Line / Cancel Spot'}
            </button>
            <p className="text-[11px] text-slate-500 text-center mt-2">
              Plans changed? Leaving frees your spot for other waiting guests.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
