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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1c1917]/50 backdrop-blur-xs p-4">
      <div className="bg-[#fcfbf9] border border-[#e8e2d8] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-7 py-5 border-b border-[#f0eae1] bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#edf5f0] border border-[#d0e5d8] flex items-center justify-center text-[#226343]">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2a241e]">Seat Party</h3>
              <p className="text-[11px] text-[#8c8275]">{party.guest_name} ({party.party_size} Guests)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8c8275] hover:text-[#2a241e] transition-colors p-1.5 rounded-lg hover:bg-[#f5f1ea]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-7 space-y-4">
          <div className="p-4 bg-white border border-[#e8e2d8] rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold tracking-wider text-[#8c8275] uppercase">Party Size</p>
              <p className="text-xl font-serif font-bold text-[#2a241e]">{party.party_size} Guests</p>
            </div>
            {party.notes && (
              <div className="text-right max-w-[200px]">
                <p className="text-[11px] font-semibold tracking-wider text-[#8c8275] uppercase">Hospitality Note</p>
                <p className="text-xs text-[#b85422] truncate font-medium">{party.notes}</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-[#716657] uppercase mb-2.5">
              Choose Available Dining Table
            </label>

            {availableTables.length === 0 ? (
              <div className="p-5 bg-[#fcf0f0] border border-[#f5d0d0] rounded-2xl text-center">
                <AlertCircle className="w-6 h-6 text-[#9b2c2c] mx-auto mb-1.5" />
                <p className="text-sm font-semibold text-[#9b2c2c]">No tables currently available</p>
                <p className="text-xs text-[#716657] mt-0.5">Please clear an occupied table before seating.</p>
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
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#226343] bg-[#edf5f0] ring-1 ring-[#226343]'
                          : 'border-[#e0d9cd] bg-white hover:bg-[#faf8f4]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-[#2a241e] text-sm">{table.name}</span>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            isEnoughCapacity
                              ? 'bg-[#edf5f0] text-[#226343]'
                              : 'bg-[#faf3ea] text-[#b85422]'
                          }`}
                        >
                          {table.capacity} seats
                        </span>
                      </div>
                      {!isEnoughCapacity && (
                        <p className="text-[10px] text-[#b85422] mt-1 font-medium">Under capacity</p>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-[#d6cebf] rounded-xl text-[#716657] hover:bg-[#f5f1ea] text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!selectedTableId || isSeating}
              onClick={handleSeat}
              className="flex-1 px-4 py-2.5 bg-[#226343] hover:bg-[#1a4f35] text-white rounded-xl text-sm font-semibold shadow-xs transition-colors disabled:opacity-50"
            >
              {isSeating ? 'Seating...' : 'Confirm Seating'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
