import React, { useState, useRef, useEffect } from 'react';
import { Trip } from '../types';
import { Plus, Luggage, ChevronDown, Check, Plane, Calendar, MapPin } from 'lucide-react';

interface HeaderProps {
  currentTrip: Trip;
  allTrips: Trip[];
  onSelectTrip: (tripId: string) => void;
  onOpenNewTripModal: () => void;
  onOpenNewItemModal: () => void;
  activeView: 'checklist' | 'luggage' | 'print';
  setActiveView: (view: 'checklist' | 'luggage' | 'print') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTrip,
  allTrips,
  onSelectTrip,
  onOpenNewTripModal,
  onOpenNewItemModal,
  activeView,
  setActiveView,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single wordmark text element */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Luggage className="w-4 h-4" />
            </span>
            <button
              onClick={() => setActiveView('checklist')}
              className="text-lg font-bold tracking-tight text-slate-900 hover:text-teal-700 transition-colors whitespace-nowrap text-left"
            >
              PackVoyage
            </button>
          </div>

          {/* Quick Trip Switcher */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(prev => !prev)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-md transition-colors border border-slate-200 max-w-[200px] sm:max-w-xs truncate"
              title={currentTrip?.title}
            >
              <Plane className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="truncate">{currentTrip?.title || 'Select Trip'}</span>
              <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 mt-1 w-72 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Switch Active Trip
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                  {allTrips.map(trip => (
                    <button
                      key={trip.id}
                      onClick={() => {
                        onSelectTrip(trip.id);
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-medium text-slate-800 truncate">{trip.title}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {trip.destination}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {trip.departureDate}
                          </span>
                        </div>
                      </div>
                      {trip.id === currentTrip?.id && (
                        <Check className="w-4 h-4 text-teal-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="pt-1.5 mt-1 border-t border-slate-100 px-2">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenNewTripModal();
                    }}
                    className="w-full text-center px-3 py-1.5 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100/80 rounded transition-colors"
                  >
                    + Create Another Trip
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Zone 2: Navigation Links / Primary View modes */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveView('checklist')}
            className={`transition-colors whitespace-nowrap hover:text-slate-900 ${
              activeView === 'checklist'
                ? 'text-teal-700 font-semibold border-b-2 border-teal-600 pb-0.5'
                : 'text-slate-600'
            }`}
          >
            Checklist View
          </button>
          <button
            onClick={() => setActiveView('luggage')}
            className={`transition-colors whitespace-nowrap hover:text-slate-900 ${
              activeView === 'luggage'
                ? 'text-teal-700 font-semibold border-b-2 border-teal-600 pb-0.5'
                : 'text-slate-600'
            }`}
          >
            Luggage Breakdown
          </button>
          <button
            onClick={() => setActiveView('print')}
            className={`transition-colors whitespace-nowrap hover:text-slate-900 ${
              activeView === 'print'
                ? 'text-teal-700 font-semibold border-b-2 border-teal-600 pb-0.5'
                : 'text-slate-600'
            }`}
          >
            Printable Sheet
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenNewTripModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/90 rounded-lg transition-colors whitespace-nowrap"
          >
            <Plane className="w-3.5 h-3.5" />
            New Trip
          </button>

          <button
            onClick={onOpenNewItemModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs hover:shadow transition-all whitespace-nowrap active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
      </div>
    </header>
  );
};
