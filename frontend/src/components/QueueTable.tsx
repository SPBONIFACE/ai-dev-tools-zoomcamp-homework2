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
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#faf3ea] text-[#b85422] border border-[#f0dfcc]">
            Waiting
          </span>
        );
      case 'notified':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#edf3f8] text-[#2c5282] border border-[#d2e0ec] animate-pulse">
            SMS Dispatched
          </span>
        );
      case 'seated':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#edf5f0] text-[#226343] border border-[#d0e5d8]">
            Seated
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#f5f3ef] text-[#787168] border border-[#e5e0d8]">
            Cancelled
          </span>
        );
      case 'no_show':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#fcf0f0] text-[#9b2c2c] border border-[#f5d0d0]">
            No-Show
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-[#e8e2d8] rounded-2xl overflow-hidden shadow-[0_2px_12px_-3px_rgba(40,30,20,0.04)]">
      {/* Header & Filter Tabs */}
      <div className="px-6 py-5 border-b border-[#f0eae1] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="font-serif text-xl font-bold text-[#2a241e]">Guest Waitlist</h3>
            <span className="bg-[#f5f1ea] text-[#716657] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#e5ded3]">
              {filteredParties.length}
            </span>
          </div>
          <p className="text-xs text-[#8c8275] mt-0.5">Live queue management and guest seating</p>
        </div>

        <div className="flex items-center gap-1 bg-[#f7f4ed] p-1 rounded-xl border border-[#ebe4d8] self-start sm:self-auto">
          {(['active', 'all', 'seated', 'cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                filter === tab
                  ? 'bg-white text-[#2a241e] font-semibold shadow-xs border border-[#e2dad0]'
                  : 'text-[#8c8275] hover:text-[#2a241e]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#f0eae1] bg-[#faf8f4] text-[#8c8275] text-[11px] uppercase tracking-wider font-semibold">
              <th className="py-3.5 px-6">Guest / Contact</th>
              <th className="py-3.5 px-4">Party</th>
              <th className="py-3.5 px-4">Wait Quote</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Mobile Tracker</th>
              <th className="py-3.5 px-6 text-right">Service Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f5f0e8]">
            {filteredParties.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-[#a89f91] font-serif text-base">
                  No parties currently in this view.
                </td>
              </tr>
            ) : (
              filteredParties.map((party) => {
                const isActive = party.status === 'waiting' || party.status === 'notified';

                return (
                  <tr key={party.id} className="hover:bg-[#faf7f2]/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-serif text-base font-semibold text-[#2a241e]">
                        {party.guest_name}
                      </div>
                      <div className="text-xs text-[#8c8275] font-mono mt-0.5">{party.phone_number}</div>
                      {party.notes && (
                        <div className="text-xs text-[#b85422] italic mt-1 flex items-center gap-1">
                          <span>•</span>
                          <span>{party.notes}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 font-medium text-[#4a4034] text-xs bg-[#f7f4ed] px-2.5 py-1 rounded-md border border-[#ebe4d8]">
                        <Users className="w-3.5 h-3.5 text-[#8c8275]" />
                        {party.party_size} Guests
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 text-xs text-[#4a4034]">
                        <Clock className="w-3.5 h-3.5 text-[#8c8275]" />
                        {party.quoted_wait_min} mins
                      </span>
                    </td>

                    <td className="py-4 px-4">{getStatusBadge(party.status)}</td>

                    <td className="py-4 px-4">
                      <button
                        onClick={() => onOpenGuestView(party.id)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#b85422] hover:text-[#913d14] hover:underline"
                      >
                        <span>Guest Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right">
                      {isActive ? (
                        <div className="flex items-center justify-end gap-2">
                          {party.status === 'waiting' && (
                            <button
                              title="Notify Guest via SMS"
                              onClick={() => onNotify(party.id)}
                              className="px-2.5 py-1.5 bg-[#edf3f8] hover:bg-[#dfeaf4] text-[#2c5282] border border-[#d2e0ec] rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                            >
                              <Bell className="w-3.5 h-3.5" />
                              <span>Notify</span>
                            </button>
                          )}
                          <button
                            title="Seat Party"
                            onClick={() => onOpenSeatModal(party)}
                            className="px-2.5 py-1.5 bg-[#edf5f0] hover:bg-[#ddead5] text-[#226343] border border-[#d0e5d8] rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                          >
                            <Utensils className="w-3.5 h-3.5" />
                            <span>Seat</span>
                          </button>
                          <button
                            title="Cancel / No-Show"
                            onClick={() => onCancel(party.id)}
                            className="p-1.5 text-[#8c8275] hover:text-[#9b2c2c] hover:bg-[#fcf0f0] rounded-lg transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-[#b5ad9f]">—</span>
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
