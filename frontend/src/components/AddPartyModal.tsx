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
      // Reset form
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2 text-white font-semibold text-lg">
            <UserPlus className="w-5 h-5 text-amber-400" />
            Add Walk-in Party
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Guest Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sophia Turner"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Party Size *
              </label>
              <input
                type="number"
                min="1"
                max="12"
                required
                value={partySize}
                onChange={(e) => setPartySize(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Special Notes
            </label>
            <input
              type="text"
              placeholder="High chair, booth, anniversary..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm"
            />
          </div>

          {/* Wait Time Section */}
          <div className="p-3.5 bg-slate-800/60 border border-slate-750 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Quoted Wait Time
              </span>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 select-none">
                <input
                  type="checkbox"
                  checked={manualOverride}
                  onChange={(e) => setManualOverride(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-400"
                />
                Manual Override
              </label>
            </div>

            {manualOverride ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="180"
                  value={waitMin}
                  onChange={(e) => setWaitMin(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-amber-400"
                />
                <span className="text-sm text-slate-400">minutes (custom host quote)</span>
              </div>
            ) : (
              <p className="text-sm text-amber-300 font-medium">
                {suggestedWait} minutes{' '}
                <span className="text-xs text-slate-400 font-normal">
                  (auto-calculated: {activeWaitingCount} parties ahead × 10 min)
                </span>
              </p>
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
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add to Queue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
