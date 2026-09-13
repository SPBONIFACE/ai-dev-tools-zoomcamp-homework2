import React, { useState } from 'react';
import { X, Utensils, AlertCircle } from 'lucide-react';
import type { Party, Table } from '../types';

interface SeatModalProps {
  isOpen: boolean;
  party: Party | null;
  tables: Table[];
  onClose: () => void;
  onConfirmSeat: (tableId: string, partyId: string) => Promise<void>;
}

export const SeatModal: React.FC<SeatModalProps> = ({
  isOpen,
  party,
  tables,
  onClose,
  onConfirmSeat,
}) => {
  const [selectedTableId, setSelectedTableId] = useState<string>('');
  const [isSeating, setIsSeating] = useState(false);

  if (!isOpen || !party) return null;

  const availableTables = tables.filter((t) => t.status === 'available');

  const handleSeat = async () => {
    if (!selectedTableId) return;
    setIsSeating(true);
    try {
      await onConfirmSeat(selectedTableId, party.id);
      setSelectedTableId('');
      onClose();
    } finally {
      setIsSeating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2 text-white font-semibold text-lg">
            <Utensils className="w-5 h-5 text-emerald-400" />
            Seat Party: {party.guest_name}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-3.5 bg-slate-800/60 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Party Size</p>
              <p className="text-lg font-bold text-white">{party.party_size} Guests</p>
            </div>
            {party.notes && (
              <div className="text-right max-w-[200px]">
                <p className="text-xs text-slate-400">Notes</p>
                <p className="text-xs text-amber-300 truncate">{party.notes}</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Available Table
            </label>

            {availableTables.length === 0 ? (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                <AlertCircle className="w-6 h-6 text-red-400 mx-auto mb-1" />
                <p className="text-sm font-medium text-red-300">No tables are currently available</p>
                <p className="text-xs text-slate-400 mt-0.5">Please clear an occupied table first.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {availableTables.map((table) => {
                  const isEnoughCapacity = table.capacity >= party.party_size;
                  const isSelected = selectedTableId === table.id;

                  return (
                    <button
                      key={table.id}
                      type="button"
                      onClick={() => setSelectedTableId(table.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500'
                          : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white text-sm">{table.name}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            isEnoughCapacity
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {table.capacity} seats
                        </span>
                      </div>
                      {!isEnoughCapacity && (
                        <p className="text-[11px] text-amber-400/90 mt-1">Smaller than party size</p>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!selectedTableId || isSeating}
              onClick={handleSeat}
              className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {isSeating ? 'Seating...' : 'Confirm Seating'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
