import React, { useState } from 'react';
import { PackingItem, ItemStatus, LuggageType } from '../types';
import {
  Check,
  Star,
  Luggage,
  ShoppingBag,
  MoreVertical,
  Edit2,
  Trash2,
  Plus,
  Minus,
  MessageSquare,
  AlertCircle,
  Backpack,
  Briefcase,
  User,
} from 'lucide-react';

interface ItemRowProps {
  item: PackingItem;
  onToggleStatus: (id: string, newStatus?: ItemStatus) => void;
  onCycleStatus: (id: string) => void;
  onUpdateItem: (id: string, updates: Partial<PackingItem>) => void;
  onDeleteItem: (id: string) => void;
  onEditItem: (item: PackingItem) => void;
}

export const ItemRow: React.FC<ItemRowProps> = ({
  item,
  onToggleStatus,
  onCycleStatus,
  onUpdateItem,
  onDeleteItem,
  onEditItem,
}) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState(false);

  const getLuggageLabel = (luggage: LuggageType) => {
    switch (luggage) {
      case 'carry_on':
        return 'Carry-On';
      case 'personal_item':
        return 'Personal Item';
      case 'checked':
        return 'Checked Bag';
      case 'worn':
        return 'Worn';
      default:
        return 'Bag';
    }
  };

  const getLuggageIcon = (luggage: LuggageType) => {
    switch (luggage) {
      case 'carry_on':
        return <Briefcase className="w-3 h-3 text-slate-400" />;
      case 'personal_item':
        return <Backpack className="w-3 h-3 text-slate-400" />;
      case 'checked':
        return <Luggage className="w-3 h-3 text-slate-400" />;
      case 'worn':
        return <User className="w-3 h-3 text-slate-400" />;
    }
  };

  return (
    <div
      className={`group relative flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border transition-all duration-150 ${
        item.status === 'packed'
          ? 'bg-slate-50/70 border-slate-200/60 opacity-90'
          : item.status === 'to-buy'
          ? 'bg-amber-50/40 border-amber-200/70'
          : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
      }`}
    >
      {/* Left zone: Checkbox + Title + Metadata */}
      <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
        {/* Interactive Checkbox / Status toggle button */}
        <button
          onClick={() => onCycleStatus(item.id)}
          className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors shrink-0 mt-0.5 sm:mt-0 ${
            item.status === 'packed'
              ? 'bg-emerald-600 text-white shadow-xs'
              : item.status === 'to-buy'
              ? 'bg-amber-100 border border-amber-300 text-amber-700 hover:bg-amber-200'
              : 'border border-slate-300 bg-white hover:border-teal-500 hover:bg-teal-50/30'
          }`}
          title={`Status: ${item.status}. Click to cycle (To Pack → Packed → Need to Buy)`}
          aria-label={`Toggle packing status for ${item.name}`}
        >
          {item.status === 'packed' && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
          {item.status === 'to-buy' && <ShoppingBag className="w-3 h-3" />}
        </button>

        {/* Essential Star Toggle Button */}
        <button
          onClick={() => onUpdateItem(item.id, { isEssential: !item.isEssential })}
          className={`shrink-0 p-1 rounded transition-colors ${
            item.isEssential
              ? 'text-amber-500 hover:text-amber-600'
              : 'text-slate-300 hover:text-slate-500 opacity-60 group-hover:opacity-100'
          }`}
          title={item.isEssential ? 'Essential item' : 'Mark as essential'}
          aria-label={item.isEssential ? 'Remove essential flag' : 'Mark as essential'}
        >
          <Star className={`w-3.5 h-3.5 ${item.isEssential ? 'fill-amber-400' : ''}`} />
        </button>

        {/* Item Name + Inline Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5">
            <span
              onClick={() => onCycleStatus(item.id)}
              className={`text-sm cursor-pointer select-none font-medium transition-colors ${
                item.status === 'packed'
                  ? 'text-slate-600 line-through decoration-slate-300'
                  : item.status === 'to-buy'
                  ? 'text-slate-900 font-semibold'
                  : 'text-slate-800'
              }`}
            >
              {item.name}
            </span>

            {/* Quantity */}
            {item.quantity > 1 && (
              <span className="text-xs font-mono font-medium text-slate-500 tabular-nums">
                ×{item.quantity}
              </span>
            )}
          </div>

          {/* Clean unboxed metadata with dot separators (Zero-pill discipline) */}
          <div className="flex items-center flex-wrap gap-x-2 text-[11px] text-slate-600 mt-1">
            <span className="flex items-center gap-1 font-medium text-slate-700">
              {getLuggageIcon(item.luggage)}
              <span>{getLuggageLabel(item.luggage)}</span>
            </span>

            <span aria-hidden="true" className="text-slate-400">·</span>

            {/* Status Text (accessible, unboxed) */}
            <span
              className={
                item.status === 'packed'
                  ? 'text-emerald-700 font-medium'
                  : item.status === 'to-buy'
                  ? 'text-amber-700 font-medium'
                  : 'text-slate-600'
              }
            >
              {item.status === 'packed'
                ? 'Packed'
                : item.status === 'to-buy'
                ? 'Need to buy'
                : 'To pack'}
            </span>

            {item.notes && (
              <>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <button
                  onClick={() => setExpandedNotes(prev => !prev)}
                  className="text-slate-600 hover:text-slate-900 flex items-center gap-1 underline underline-offset-2"
                >
                  <MessageSquare className="w-2.5 h-2.5 text-slate-400" />
                  <span>{expandedNotes ? 'Hide note' : 'View note'}</span>
                </button>
              </>
            )}
          </div>

          {/* Expanded note text */}
          {expandedNotes && item.notes && (
            <p className="mt-1.5 text-xs text-slate-600 bg-slate-100/80 p-2 rounded border border-slate-200/60 text-balance animate-in fade-in duration-100">
              {item.notes}
            </p>
          )}
        </div>
      </div>

      {/* Right zone: Quick Controls (Quantity stepper, Status switcher, Edit, Delete) */}
      <div className="flex items-center justify-end gap-1.5 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
        {/* Quantity quick adjust */}
        <div className="flex items-center rounded border border-slate-200 bg-white">
          <button
            onClick={() => onUpdateItem(item.id, { quantity: Math.max(1, item.quantity - 1) })}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
            title="Decrease quantity"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-xs font-mono font-medium text-slate-700 px-1.5 tabular-nums min-w-[20px] text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateItem(item.id, { quantity: item.quantity + 1 })}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
            title="Increase quantity"
            aria-label="Increase quantity"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Fast Status Change Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowStatusMenu(prev => !prev)}
            className="p-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded hover:bg-slate-100 transition-colors"
            title="Change item status"
            aria-label="Change item status"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {showStatusMenu && (
            <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-30 animate-in fade-in duration-150">
              <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Set Status
              </div>
              <button
                onClick={() => {
                  onToggleStatus(item.id, 'to-pack');
                  setShowStatusMenu(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 text-xs flex items-center gap-2 hover:bg-slate-50 ${
                  item.status === 'to-pack' ? 'text-teal-700 font-medium' : 'text-slate-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span>To Pack</span>
              </button>
              <button
                onClick={() => {
                  onToggleStatus(item.id, 'packed');
                  setShowStatusMenu(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 text-xs flex items-center gap-2 hover:bg-slate-50 ${
                  item.status === 'packed' ? 'text-emerald-700 font-medium' : 'text-slate-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Packed</span>
              </button>
              <button
                onClick={() => {
                  onToggleStatus(item.id, 'to-buy');
                  setShowStatusMenu(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 text-xs flex items-center gap-2 hover:bg-slate-50 ${
                  item.status === 'to-buy' ? 'text-amber-700 font-medium' : 'text-slate-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Need to Buy</span>
              </button>
            </div>
          )}
        </div>

        {/* Edit Button */}
        <button
          onClick={() => onEditItem(item)}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
          title="Edit item details"
          aria-label="Edit item details"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>

        {/* Delete Button */}
        <button
          onClick={() => onDeleteItem(item.id)}
          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
          title="Delete item"
          aria-label="Delete item"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
