import React from 'react';
import { Trip, PackingItem, LuggageType, ItemStatus } from '../types';
import { ItemRow } from './ItemRow';
import {
  Luggage,
  Backpack,
  Briefcase,
  User,
  AlertCircle,
  CheckCircle2,
  Plus,
} from 'lucide-react';

interface LuggageViewProps {
  trip: Trip;
  filteredItems: PackingItem[];
  onToggleStatus: (id: string, newStatus?: ItemStatus) => void;
  onCycleStatus: (id: string) => void;
  onUpdateItem: (id: string, updates: Partial<PackingItem>) => void;
  onDeleteItem: (id: string) => void;
  onEditItem: (item: PackingItem) => void;
  onOpenNewItemModal: () => void;
}

export const LuggageView: React.FC<LuggageViewProps> = ({
  trip,
  filteredItems,
  onToggleStatus,
  onCycleStatus,
  onUpdateItem,
  onDeleteItem,
  onEditItem,
  onOpenNewItemModal,
}) => {
  const luggageConfigs: {
    type: LuggageType;
    title: string;
    description: string;
    icon: React.ReactNode;
    advice: string;
  }[] = [
    {
      type: 'personal_item',
      title: 'Personal Item (Backpack / Tote)',
      description: 'Stowed under the seat in front of you. Must keep passports, cash, and medications here.',
      icon: <Backpack className="w-5 h-5 text-teal-600" />,
      advice: 'Always keep passport, credit cards, power bank, and prescription medicine within arm’s reach.',
    },
    {
      type: 'carry_on',
      title: 'Carry-On Suitcase / Roller Bag',
      description: 'Stowed in overhead airplane bin (standard 22" × 14" × 9" cabin limit).',
      icon: <Briefcase className="w-5 h-5 text-sky-600" />,
      advice: 'Liquids must adhere to 3-1-1 rule (under 100ml / 3.4oz in 1 transparent quart bag).',
    },
    {
      type: 'checked',
      title: 'Checked Baggage (Cargo Hold)',
      description: 'Checked at airport drop desk for the aircraft hold (standard 23kg / 50lbs limit).',
      icon: <Luggage className="w-5 h-5 text-indigo-600" />,
      advice: 'NEVER put spare lithium power banks, vital medication, or passports in checked baggage.',
    },
    {
      type: 'worn',
      title: 'Worn on Departure',
      description: 'Clothes, heavy jacket, and footwear worn during transit to save bag weight.',
      icon: <User className="w-5 h-5 text-amber-600" />,
      advice: 'Wear your bulkiest boots and warm jacket during transit to free up cabin luggage space.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-teal-50/70 border border-teal-200/80 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700">
          <span className="font-semibold text-teal-900">Luggage Organization Rule: </span>
          Airport security forbids lithium power banks and e-cigarettes in checked baggage. Keep all batteries, passports, and essential medicine inside your Personal Item or Carry-On bag.
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {luggageConfigs.map(cfg => {
          const bagItems = filteredItems.filter(i => i.luggage === cfg.type);
          const total = bagItems.length;
          const packed = bagItems.filter(i => i.status === 'packed').length;
          const percentage = total === 0 ? 0 : Math.round((packed / total) * 100);

          return (
            <div
              key={cfg.type}
              className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                    {cfg.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                      {cfg.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{cfg.description}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-3 sm:w-48 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-mono font-semibold text-slate-800 tabular-nums">
                      {packed}/{total} packed
                    </span>
                    <div className="text-[11px] font-mono text-teal-700 font-semibold tabular-nums">
                      {percentage}%
                    </div>
                  </div>
                  <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        percentage === 100
                          ? 'bg-emerald-500'
                          : percentage > 50
                          ? 'bg-teal-600'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="p-4 space-y-2">
                {bagItems.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400 bg-slate-50/40 rounded-lg border border-dashed border-slate-200">
                    No items assigned to this luggage compartment.
                  </div>
                ) : (
                  bagItems.map(item => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      onToggleStatus={onToggleStatus}
                      onCycleStatus={onCycleStatus}
                      onUpdateItem={onUpdateItem}
                      onDeleteItem={onDeleteItem}
                      onEditItem={onEditItem}
                    />
                  ))
                )}

                {/* Advice banner */}
                <div className="pt-2 text-[11px] text-slate-500 italic flex items-center gap-1.5">
                  <span className="font-semibold text-slate-700 not-italic">Tip:</span>
                  <span>{cfg.advice}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
