import React, { useMemo } from 'react';
import { Trip, ViewFilter, GroupingMode } from '../types';
import {
  MapPin,
  Calendar,
  Sparkles,
  Search,
  CheckCheck,
  RotateCcw,
  SlidersHorizontal,
  Edit2,
  Trash2,
  Copy,
  Printer,
  ShoppingBag,
  Star,
  CheckCircle2,
  Layers,
  Luggage,
} from 'lucide-react';

interface TripBannerProps {
  trip: Trip;
  stats: {
    total: number;
    packed: number;
    toPack: number;
    toBuy: number;
    percentage: number;
    essentialTotal: number;
    essentialPacked: number;
  };
  filter: ViewFilter;
  setFilter: (f: ViewFilter) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  groupingMode: GroupingMode;
  setGroupingMode: (m: GroupingMode) => void;
  onPackAll: () => void;
  onResetAll: () => void;
  onEditTrip: () => void;
  onDuplicateTrip: () => void;
  onDeleteTrip: () => void;
  onPrint: () => void;
}

export const TripBanner: React.FC<TripBannerProps> = ({
  trip,
  stats,
  filter,
  setFilter,
  searchQuery,
  setSearchQuery,
  groupingMode,
  setGroupingMode,
  onPackAll,
  onResetAll,
  onEditTrip,
  onDuplicateTrip,
  onDeleteTrip,
  onPrint,
}) => {
  // Days until departure calculation
  const departureDays = useMemo(() => {
    if (!trip?.departureDate) return null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const dep = new Date(trip.departureDate + 'T00:00:00');
    const diffTime = dep.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [trip?.departureDate]);

  return (
    <div className="bg-white border-b border-slate-200/90 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Upper Trip Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3 text-xs text-slate-500 mb-1.5">
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                {trip.destination}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {trip.departureDate}
                {trip.returnDate ? ` → ${trip.returnDate}` : ''}
              </span>
              {departureDays !== null && (
                <>
                  <span aria-hidden="true">·</span>
                  <span
                    className={
                      departureDays <= 0
                        ? 'font-medium text-emerald-600'
                        : departureDays <= 3
                        ? 'font-medium text-amber-600'
                        : 'text-slate-500'
                    }
                  >
                    {departureDays === 0
                      ? 'Departing today!'
                      : departureDays < 0
                      ? 'Trip completed'
                      : `${departureDays} days until departure`}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
                {trip.title}
              </h1>
              <button
                onClick={onEditTrip}
                className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded hover:bg-slate-100"
                title="Edit trip details"
                aria-label="Edit trip details"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Actions & Menu */}
          <div className="flex items-center flex-wrap gap-2 shrink-0">
            <button
              onClick={onPackAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/90 rounded-md transition-colors"
              title="Mark all items as packed"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pack All</span>
            </button>
            <button
              onClick={onResetAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/90 rounded-md transition-colors"
              title="Reset all items to unpacked"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Status</span>
            </button>
            <button
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/90 rounded-md transition-colors"
              title="Print checklist"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print</span>
            </button>
            <button
              onClick={onDuplicateTrip}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/90 rounded-md transition-colors"
              title="Duplicate this checklist"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
            </button>
            <button
              onClick={onDeleteTrip}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
              title="Delete trip"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Packing Progress & Metric Bar */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2.5">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-mono tabular-nums">
                {stats.percentage}%
              </span>
              <span className="text-sm font-medium text-slate-600">
                Ready for departure
              </span>
            </div>

            {/* Zero-pill unboxed metadata counts */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 font-mono">
              <span className="font-semibold text-slate-900 tabular-nums">
                {stats.packed} of {stats.total} packed
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="tabular-nums">
                {stats.toPack} remaining
              </span>
              {stats.toBuy > 0 && (
                <>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-amber-700 font-medium tabular-nums flex items-center gap-1">
                    <ShoppingBag className="w-3 h-3 text-amber-600" />
                    {stats.toBuy} to purchase
                  </span>
                </>
              )}
              {stats.essentialTotal > 0 && (
                <>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-slate-700 tabular-nums flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                    {stats.essentialPacked}/{stats.essentialTotal} essential ready
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Overall Visual Progress Bar */}
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative">
            <div
              className={`h-full transition-all duration-500 ease-out rounded-full ${
                stats.percentage === 100
                  ? 'bg-emerald-500'
                  : stats.percentage >= 70
                  ? 'bg-teal-600'
                  : stats.percentage >= 35
                  ? 'bg-sky-600'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${stats.percentage}%` }}
            />
          </div>

          {/* 100% Celebration Banner */}
          {stats.percentage === 100 && stats.total > 0 && (
            <div className="mt-3 py-2 px-3 bg-emerald-50 border border-emerald-200/80 rounded-lg flex items-center gap-2 text-xs font-medium text-emerald-800 animate-in fade-in duration-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>PackVoyage Ready: All items are accounted for and securely packed. Safe travels!</span>
            </div>
          )}
        </div>

        {/* Lower Controls: Search, View Mode, and Functional Filter Buttons */}
        <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Segmented Filter Buttons (allowed interactive tab controls) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-lg overflow-x-auto max-w-full">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Items ({stats.total})
            </button>
            <button
              onClick={() => setFilter('unpacked')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                filter === 'unpacked'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              To Pack ({stats.toPack})
            </button>
            <button
              onClick={() => setFilter('packed')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                filter === 'packed'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Packed ({stats.packed})
            </button>
            <button
              onClick={() => setFilter('to-buy')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                filter === 'to-buy'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Need to Buy ({stats.toBuy})
            </button>
            <button
              onClick={() => setFilter('essential')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 ${
                filter === 'essential'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
              Essential ({stats.essentialTotal})
            </button>
          </div>

          {/* Search and Grouping */}
          <div className="flex items-center gap-2.5">
            {/* Grouping Mode Toggle */}
            <div className="flex items-center p-1 bg-slate-100/90 rounded-lg">
              <button
                onClick={() => setGroupingMode('category')}
                className={`p-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1 ${
                  groupingMode === 'category'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Group by Category"
                aria-label="Group by Category"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Category</span>
              </button>
              <button
                onClick={() => setGroupingMode('luggage')}
                className={`p-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1 ${
                  groupingMode === 'luggage'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Group by Bag / Luggage"
                aria-label="Group by Bag / Luggage"
              >
                <Luggage className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Luggage</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search items or notes..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs px-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
