import React, { useState } from 'react';
import type { Party, PartyStatus } from '../types';
import { Bell, Utensils, XCircle, ExternalLink, Clock, Users } from 'lucide-react';


interface QueueTableProps {
  parties: Party[];
  onNotify: (partyId: string) => Promise<void>;
  onOpenSeatModal: (party: Party) => void;
  onCancel: (partyId: string) => Promise<void>;
  onOpenGuestView: (partyId: string) => void;
}

export const QueueTable: React.FC<QueueTableProps> = ({
  parties,
  onNotify,
  onOpenSeatModal,
  onCancel,
  onOpenGuestView,
}) => {
  const [filter, setFilter] = useState<'active' | 'all' | 'seated' | 'cancelled'>('active');

  const filteredParties = parties.filter((p) => {
    if (filter === 'active') return p.status === 'waiting' || p.status === 'notified';
    if (filter === 'seated') return p.status === 'seated';
    if (filter === 'cancelled') return p.status === 'cancelled' || p.status === 'no_show';
    return true;
  });

  const getStatusBadge = (status: PartyStatus) => {
    switch (status) {
      case 'waiting':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Waiting
          </span>
        );
      case 'notified':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse">
            SMS Sent
          </span>
        );
      case 'seated':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Seated
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700/50 text-slate-400 border border-slate-700">
            Cancelled
          </span>
        );
      case 'no_show':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
            No Show
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Table Header & Filters */}
      <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/50">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-amber-400" />
          <h3 className="font-semibold text-white">Waitlist Queue</h3>
          <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-0.5 rounded-full font-mono">
            {filteredParties.length}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
          {(['active', 'all', 'seated', 'cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all ${
                filter === tab
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Queue Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 text-xs uppercase tracking-wider font-semibold">
              <th className="py-3.5 px-4">Party</th>
              <th className="py-3.5 px-4">Size</th>
              <th className="py-3.5 px-4">Wait Quote</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Guest Tracker</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredParties.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
                  No parties found in this view.
                </td>
              </tr>
            ) : (
              filteredParties.map((party) => {
                const isActive = party.status === 'waiting' || party.status === 'notified';

                return (
                  <tr key={party.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{party.guest_name}</div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">{party.phone_number}</div>
                      {party.notes && (
                        <div className="text-xs text-amber-400/90 italic mt-0.5">"{party.notes}"</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-200">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {party.party_size}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {party.quoted_wait_min} min
                      </span>
                    </td>

                    <td className="py-3.5 px-4">{getStatusBadge(party.status)}</td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => onOpenGuestView(party.id)}
                        className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 hover:underline"
                      >
                        <span>View Live</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {isActive ? (
                        <div className="flex items-center justify-end gap-1.5">
                          {party.status === 'waiting' && (
                            <button
                              title="Notify Party via SMS"
                              onClick={() => onNotify(party.id)}
                              className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/20 transition-colors"
                            >
                              <Bell className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            title="Seat Party"
                            onClick={() => onOpenSeatModal(party)}
                            className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/20 transition-colors"
                          >
                            <Utensils className="w-4 h-4" />
                          </button>
                          <button
                            title="Cancel / No Show"
                            onClick={() => onCancel(party.id)}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
