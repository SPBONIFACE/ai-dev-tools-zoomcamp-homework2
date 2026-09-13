import React, { useState, useEffect } from 'react';
import { X, UserPlus, Sparkles } from 'lucide-react';
import type { CreatePartyInput } from '../types';

interface AddPartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePartyInput) => Promise<void>;
  activeWaitingCount: number;
}

export const AddPartyModal: React.FC<AddPartyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  activeWaitingCount,
}) => {
  const suggestedWait = (activeWaitingCount + 1) * 10;

  const [name, setName] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [manualOverride, setManualOverride] = useState(false);
  const [waitMin, setWaitMin] = useState(suggestedWait);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!manualOverride) {
      setWaitMin(suggestedWait);
    }
  }, [suggestedWait, manualOverride]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        guest_name: name.trim(),
        party_size: Number(partySize),
        phone_number: phone.trim(),
        notes: notes.trim() || undefined,
        quoted_wait_min: manualOverride ? Number(waitMin) : suggestedWait,
      });
      setName('');
      setPartySize(2);
      setPhone('');
      setNotes('');
      setManualOverride(false);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1c1917]/50 backdrop-blur-xs p-4">
      <div className="bg-[#fcfbf9] border border-[#e8e2d8] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-7 py-5 border-b border-[#f0eae1] bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#faf3ea] border border-[#ebd7bf] flex items-center justify-center text-[#b85422]">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2a241e]">Add Walk-In Party</h3>
              <p className="text-[11px] text-[#8c8275]">Intake guest into active waitlist</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8c8275] hover:text-[#2a241e] transition-colors p-1.5 rounded-lg hover:bg-[#f5f1ea]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-7 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-[#716657] uppercase mb-1.5">
              Primary Guest Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Eleanor Vance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-[#e0d9cd] rounded-xl px-4 py-2.5 text-[#2a241e] placeholder-[#a89f91] focus:outline-none focus:border-[#b85422] focus:ring-1 focus:ring-[#b85422] text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold tracking-wider text-[#716657] uppercase mb-1.5">
                Party Size *
              </label>
              <input
                type="number"
                min="1"
                max="12"
                required
                value={partySize}
                onChange={(e) => setPartySize(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-white border border-[#e0d9cd] rounded-xl px-4 py-2.5 text-[#2a241e] focus:outline-none focus:border-[#b85422] focus:ring-1 focus:ring-[#b85422] text-sm"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold tracking-wider text-[#716657] uppercase mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white border border-[#e0d9cd] rounded-xl px-4 py-2.5 text-[#2a241e] placeholder-[#a89f91] focus:outline-none focus:border-[#b85422] focus:ring-1 focus:ring-[#b85422] text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-[#716657] uppercase mb-1.5">
              Hospitality Notes & Preferences
            </label>
            <input
              type="text"
              placeholder="Corner booth, high chair, birthday..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-[#e0d9cd] rounded-xl px-4 py-2.5 text-[#2a241e] placeholder-[#a89f91] focus:outline-none focus:border-[#b85422] focus:ring-1 focus:ring-[#b85422] text-sm"
            />
          </div>

          {/* Wait Time Quote Box */}
          <div className="p-4 bg-white border border-[#e8e2d8] rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#4a4034] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#b85422]" />
                Quoted Wait Time
              </span>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#8c8275] select-none">
                <input
                  type="checkbox"
                  checked={manualOverride}
                  onChange={(e) => setManualOverride(e.target.checked)}
                  className="rounded border-[#d6cebf] text-[#b85422] focus:ring-[#b85422]"
                />
                Custom Quote
              </label>
            </div>

            {manualOverride ? (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="number"
                  min="0"
                  max="180"
                  value={waitMin}
                  onChange={(e) => setWaitMin(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-24 bg-[#faf8f4] border border-[#d6cebf] rounded-lg px-3 py-1.5 text-[#2a241e] text-sm font-semibold focus:outline-none focus:border-[#b85422]"
                />
                <span className="text-xs text-[#716657]">minutes (host override)</span>
              </div>
            ) : (
              <p className="text-sm text-[#b85422] font-semibold pt-1">
                {suggestedWait} minutes{' '}
                <span className="text-xs text-[#8c8275] font-normal">
                  (~10 min × {activeWaitingCount} parties in line)
                </span>
              </p>
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
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-[#b85422] hover:bg-[#9e461b] text-white rounded-xl text-sm font-semibold shadow-xs transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add to Waitlist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
