import React, { useState } from 'react';
import { Trip, PackingCategory, PackingItem } from '../types';
import { Printer, ArrowLeft, CheckSquare, Square, Star } from 'lucide-react';

interface PrintViewProps {
  trip: Trip;
  categories: PackingCategory[];
  items: PackingItem[];
  onBack: () => void;
}

export const PrintView: React.FC<PrintViewProps> = ({
  trip,
  categories,
  items,
  onBack,
}) => {
  const [onlyUnpacked, setOnlyUnpacked] = useState(false);

  const displayedItems = onlyUnpacked
    ? items.filter(i => i.status !== 'packed')
    : items;

  const totalPacked = items.filter(i => i.status === 'packed').length;
  const percentage = items.length === 0 ? 0 : Math.round((totalPacked / items.length) * 100);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Top action controls (hidden in print) */}
      <div className="no-print mb-6 p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Interactive Checklist</span>
        </button>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyUnpacked}
              onChange={e => setOnlyUnpacked(e.target.checked)}
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <span>Print only remaining unpacked items</span>
          </label>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet */}
      <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-xs print:border-none print:shadow-none print:p-0">
        {/* Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs uppercase font-mono font-bold tracking-wider text-teal-700">
                PackVoyage Checklist
              </span>
              <h1 className="text-2xl font-bold text-slate-900 mt-1">{trip.title}</h1>
              <p className="text-xs text-slate-600 mt-1">
                Destination: <span className="font-semibold text-slate-900">{trip.destination}</span> ·
                Departure: <span className="font-semibold text-slate-900">{trip.departureDate}</span>
                {trip.returnDate ? ` · Return: ${trip.returnDate}` : ''}
              </p>
            </div>

            <div className="text-right">
              <div className="text-2xl font-mono font-bold text-slate-900 tabular-nums">
                {percentage}%
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                {totalPacked} of {items.length} packed
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4">
          {categories.map(cat => {
            const catItems = displayedItems.filter(i => i.categoryId === cat.id);
            if (catItems.length === 0) return null;

            return (
              <div
                key={cat.id}
                className="print-break-inside-avoid border border-slate-200 rounded-lg p-3 bg-slate-50/30 print:bg-transparent"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    {cat.name}
                  </h2>
                  <span className="text-[10px] font-mono text-slate-500">
                    ({catItems.length})
                  </span>
                </div>

                <div className="space-y-1.5">
                  {catItems.map(item => (
                    <div
                      key={item.id}
                      className="flex items-start gap-2 text-xs text-slate-800"
                    >
                      <span className="mt-0.5 shrink-0 text-slate-400">
                        {item.status === 'packed' ? (
                          <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Square className="w-3.5 h-3.5" />
                        )}
                      </span>

                      <div className="min-w-0 flex-1 leading-tight">
                        <span
                          className={
                            item.status === 'packed'
                              ? 'line-through text-slate-400'
                              : 'font-medium'
                          }
                        >
                          {item.name}
                        </span>

                        {item.quantity > 1 && (
                          <span className="ml-1 text-[11px] text-slate-500 font-mono">
                            ×{item.quantity}
                          </span>
                        )}

                        {item.isEssential && (
                          <span className="ml-1 text-amber-600 text-[10px] font-semibold">
                            ★
                          </span>
                        )}

                        <span className="ml-1 text-[10px] text-slate-400 uppercase font-mono">
                          [{item.luggage === 'carry_on' ? 'Carry-on' : item.luggage === 'personal_item' ? 'Personal' : item.luggage === 'checked' ? 'Checked' : 'Worn'}]
                        </span>

                        {item.notes && (
                          <div className="text-[10px] text-slate-500 italic mt-0.5">
                            {item.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400 font-mono">
          Prepared with PackVoyage · Checked on {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};
