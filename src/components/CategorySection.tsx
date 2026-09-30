import React, { useState } from 'react';
import { PackingCategory, PackingItem, ItemStatus, LuggageType } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { ItemRow } from './ItemRow';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  CheckCheck,
  RotateCcw,
  MoreHorizontal,
  Edit2,
  Trash2,
} from 'lucide-react';

interface CategorySectionProps {
  category: PackingCategory;
  items: PackingItem[];
  stats: { total: number; packed: number; percentage: number };
  onToggleStatus: (id: string, newStatus?: ItemStatus) => void;
  onCycleStatus: (id: string) => void;
  onUpdateItem: (id: string, updates: Partial<PackingItem>) => void;
  onDeleteItem: (id: string) => void;
  onEditItem: (item: PackingItem) => void;
  onAddItem: (itemData: Omit<PackingItem, 'id'>) => void;
  onPackAllInCategory: (categoryId: string) => void;
  onResetCategory: (categoryId: string) => void;
  onEditCategory: (cat: PackingCategory) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  items,
  stats,
  onToggleStatus,
  onCycleStatus,
  onUpdateItem,
  onDeleteItem,
  onEditItem,
  onAddItem,
  onPackAllInCategory,
  onResetCategory,
  onEditCategory,
  onDeleteCategory,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [quickItemName, setQuickItemName] = useState('');
  const [quickLuggage, setQuickLuggage] = useState<LuggageType>('carry_on');
  const [isQuickAdding, setIsQuickAdding] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickItemName.trim()) return;

    onAddItem({
      name: quickItemName.trim(),
      categoryId: category.id,
      status: 'to-pack',
      quantity: 1,
      luggage: quickLuggage,
      isEssential: false,
    });
    setQuickItemName('');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all duration-200 mb-5">
      {/* Category Header */}
      <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Collapse toggle + Icon + Title + Unboxed Progress */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <button
            onClick={() => setCollapsed(prev => !prev)}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label={collapsed ? `Expand ${category.name}` : `Collapse ${category.name}`}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center shrink-0">
            <CategoryIcon iconName={category.iconName} className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <h2 className="text-base font-semibold text-slate-900 tracking-tight truncate">
                {category.name}
              </h2>
            </div>

            {/* Zero-pill unboxed progress info */}
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
              <span className="font-semibold text-slate-700 tabular-nums">
                {stats.packed} of {stats.total} packed
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums font-semibold text-teal-700">
                {stats.percentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Center: Mini Category Progress Bar */}
        <div className="flex items-center gap-3 sm:w-48 shrink-0">
          <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                stats.percentage === 100
                  ? 'bg-emerald-500'
                  : stats.percentage > 50
                  ? 'bg-teal-600'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${stats.percentage}%` }}
            />
          </div>

          {/* Quick Actions for this Category */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onPackAllInCategory(category.id)}
              className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
              title="Pack all in this category"
              aria-label="Pack all in this category"
            >
              <CheckCheck className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onResetCategory(category.id)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
              title="Reset all in this category to unpacked"
              aria-label="Reset all in this category to unpacked"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* More menu */}
            <div className="relative">
              <button
                onClick={() => setShowCategoryMenu(prev => !prev)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                title="Category actions"
                aria-label="Category actions"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>

              {showCategoryMenu && (
                <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-30 animate-in fade-in duration-150">
                  <button
                    onClick={() => {
                      setShowCategoryMenu(false);
                      onEditCategory(category);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Rename / Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowCategoryMenu(false);
                      onDeleteCategory(category.id);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Category</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Items List */}
      {!collapsed && (
        <div className="p-4 space-y-2">
          {items.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
              No items in this category matching current filter.
            </div>
          ) : (
            items.map(item => (
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

          {/* Quick-add row at the bottom of the category */}
          <div className="pt-2">
            {!isQuickAdding ? (
              <button
                onClick={() => setIsQuickAdding(true)}
                className="w-full py-2 px-3 border border-dashed border-slate-200 hover:border-teal-400 rounded-lg text-xs font-medium text-slate-500 hover:text-teal-700 hover:bg-teal-50/30 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add item to {category.name}</span>
              </button>
            ) : (
              <form onSubmit={handleQuickAdd} className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-lg border border-slate-200">
                <input
                  type="text"
                  value={quickItemName}
                  onChange={e => setQuickItemName(e.target.value)}
                  placeholder={`New item for ${category.name}... (Press Enter to add)`}
                  autoFocus
                  className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-teal-600"
                />

                <select
                  value={quickLuggage}
                  onChange={e => setQuickLuggage(e.target.value as LuggageType)}
                  className="px-2 py-1.5 text-xs bg-white border border-slate-200 rounded text-slate-700 focus:outline-none"
                >
                  <option value="carry_on">Carry-On</option>
                  <option value="personal_item">Personal Item</option>
                  <option value="checked">Checked Bag</option>
                  <option value="worn">Worn</option>
                </select>

                <button
                  type="submit"
                  disabled={!quickItemName.trim()}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 rounded transition-colors whitespace-nowrap"
                >
                  Add
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsQuickAdding(false);
                    setQuickItemName('');
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-600 text-xs"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
