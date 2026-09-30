import React, { useState, useEffect } from 'react';
import { Trip, PackingCategory, PackingItem } from '../types';
import { DEFAULT_CATEGORIES, INITIAL_TRIPS, TEMPLATE_PRESETS } from '../data/templates';
import { X, Plane, Calendar, MapPin, Check, Sparkles } from 'lucide-react';

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveNewTrip: (tripData: Omit<Trip, 'id' | 'createdAt'>) => void;
  onUpdateTrip?: (updates: Partial<Trip>) => void;
  initialTrip?: Trip | null;
}

export const TripModal: React.FC<TripModalProps> = ({
  isOpen,
  onClose,
  onSaveNewTrip,
  onUpdateTrip,
  initialTrip,
}) => {
  const isEditing = Boolean(initialTrip);

  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [tripType, setTripType] = useState<Trip['tripType']>('leisure');
  const [selectedPreset, setSelectedPreset] = useState('preset-international');

  useEffect(() => {
    if (initialTrip) {
      setTitle(initialTrip.title);
      setDestination(initialTrip.destination);
      setDepartureDate(initialTrip.departureDate);
      setReturnDate(initialTrip.returnDate || '');
      setTripType(initialTrip.tripType);
    } else {
      // Defaults for new trip
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 14 * 86400000);
      const returnWeek = new Date(now.getTime() + 24 * 86400000);

      setTitle('');
      setDestination('');
      setDepartureDate(nextWeek.toISOString().split('T')[0]);
      setReturnDate(returnWeek.toISOString().split('T')[0]);
      setTripType('leisure');
      setSelectedPreset('preset-international');
    }
  }, [initialTrip, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !destination.trim() || !departureDate) return;

    if (isEditing && onUpdateTrip) {
      onUpdateTrip({
        title: title.trim(),
        destination: destination.trim(),
        departureDate,
        returnDate: returnDate || undefined,
        tripType,
      });
    } else {
      // Build starter items based on selected preset
      let starterItems: PackingItem[] = [];
      const presetTemplate = INITIAL_TRIPS.find(t => t.id === 'trip-japan-2026');

      if (selectedPreset === 'preset-international' && presetTemplate) {
        starterItems = presetTemplate.items.map(item => ({
          ...item,
          id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          status: 'to-pack',
        }));
      } else if (selectedPreset === 'preset-weekend') {
        const weekendTrip = INITIAL_TRIPS.find(t => t.id === 'trip-weekend-beach');
        starterItems = (weekendTrip?.items || []).map(item => ({
          ...item,
          id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          status: 'to-pack',
        }));
      } else if (selectedPreset === 'preset-business') {
        // Business conference list
        starterItems = [
          {
            id: `item-${Date.now()}-1`,
            name: 'Passport & Corporate ID / Business Cards',
            categoryId: 'cat-docs',
            status: 'to-pack',
            quantity: 1,
            luggage: 'personal_item',
            isEssential: true,
          },
          {
            id: `item-${Date.now()}-2`,
            name: 'Conference Registration QR / Hotel confirmation',
            categoryId: 'cat-docs',
            status: 'to-pack',
            quantity: 1,
            luggage: 'personal_item',
            isEssential: true,
          },
          {
            id: `item-${Date.now()}-3`,
            name: 'Tailored suit jacket / blazer',
            categoryId: 'cat-clothes',
            status: 'to-pack',
            quantity: 1,
            luggage: 'carry_on',
            isEssential: true,
          },
          {
            id: `item-${Date.now()}-4`,
            name: 'Pressed dress shirts / blouses',
            categoryId: 'cat-clothes',
            status: 'to-pack',
            quantity: 3,
            luggage: 'carry_on',
            isEssential: true,
          },
          {
            id: `item-${Date.now()}-5`,
            name: 'Dress trousers / smart trousers',
            categoryId: 'cat-clothes',
            status: 'to-pack',
            quantity: 2,
            luggage: 'carry_on',
            isEssential: false,
          },
          {
            id: `item-${Date.now()}-6`,
            name: 'Leather belt & polished dress shoes',
            categoryId: 'cat-shoes',
            status: 'to-pack',
            quantity: 1,
            luggage: 'worn',
            isEssential: true,
          },
          {
            id: `item-${Date.now()}-7`,
            name: 'Work laptop & high-wattage GaN charger',
            categoryId: 'cat-electronics',
            status: 'to-pack',
            quantity: 1,
            luggage: 'personal_item',
            isEssential: true,
          },
          {
            id: `item-${Date.now()}-8`,
            name: 'HDMI / USB-C presentation display dongle',
            categoryId: 'cat-electronics',
            status: 'to-pack',
            quantity: 1,
            luggage: 'personal_item',
            isEssential: true,
          },
          {
            id: `item-${Date.now()}-9`,
            name: 'Wireless presentation clicker',
            categoryId: 'cat-electronics',
            status: 'to-buy',
            quantity: 1,
            luggage: 'personal_item',
            isEssential: false,
          },
          {
            id: `item-${Date.now()}-10`,
            name: 'Travel lint roller & wrinkle release spray',
            categoryId: 'cat-toiletries',
            status: 'to-pack',
            quantity: 1,
            luggage: 'carry_on',
            isEssential: false,
          },
        ];
      }

      onSaveNewTrip({
        title: title.trim(),
        destination: destination.trim(),
        departureDate,
        returnDate: returnDate || undefined,
        tripType,
        categories: DEFAULT_CATEGORIES,
        items: starterItems,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Plane className="w-4 h-4 text-teal-600" />
            {isEditing ? 'Edit Trip Details' : 'Plan a New Trip Checklist'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Trip Title *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Summer in Southern Italy, London Conference"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Destination *
            </label>
            <input
              type="text"
              required
              value={destination}
              onChange={e => setDestination(e.target.value)}
              placeholder="e.g. Rome & Amalfi Coast, Italy"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Departure Date *
              </label>
              <input
                type="date"
                required
                value={departureDate}
                onChange={e => setDepartureDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Return Date (Optional)
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={e => setReturnDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-600 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Travel Style / Category
            </label>
            <select
              value={tripType}
              onChange={e => setTripType(e.target.value as Trip['tripType'])}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-600 bg-white"
            >
              <option value="leisure">Leisure & Vacation</option>
              <option value="weekend">Weekend Getaway</option>
              <option value="business">Business & Work</option>
              <option value="adventure">Outdoor Adventure & Hiking</option>
            </select>
          </div>

          {/* Preset Starter Checklist Templates (Only for new trips) */}
          {!isEditing && (
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Starter Checklist Template
              </label>
              <div className="space-y-2">
                {TEMPLATE_PRESETS.map(preset => (
                  <div
                    key={preset.id}
                    onClick={() => setSelectedPreset(preset.id)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-colors flex items-start justify-between ${
                      selectedPreset === preset.id
                        ? 'border-teal-600 bg-teal-50/50 text-slate-900'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{preset.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{preset.description}</div>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 shrink-0 ml-2">
                      ~{preset.itemCount} items
                    </div>
                  </div>
                ))}

                <div
                  onClick={() => setSelectedPreset('blank')}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-colors flex items-start justify-between ${
                    selectedPreset === 'blank'
                      ? 'border-teal-600 bg-teal-50/50 text-slate-900'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-slate-900">Blank Custom Checklist</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Start fresh with standard travel categories and add items manually.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors"
            >
              {isEditing ? 'Save Changes' : 'Create Trip Checklist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
