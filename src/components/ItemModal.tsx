import React, { useState, useEffect } from 'react';
import { PackingItem, PackingCategory, ItemStatus, LuggageType } from '../types';
import { X, Star, Briefcase, Backpack, Luggage, User, Check } from 'lucide-react';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: Omit<PackingItem, 'id'>, id?: string) => void;
  initialItem?: PackingItem | null;
  categories: PackingCategory[];
  defaultCategoryId?: string;
}

export const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
  categories,
  defaultCategoryId,
}) => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState<ItemStatus>('to-pack');
  const [quantity, setQuantity] = useState(1);
  const [luggage, setLuggage] = useState<LuggageType>('carry_on');
  const [isEssential, setIsEssential] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialItem) {
      setName(initialItem.name);
      setCategoryId(initialItem.categoryId);
      setStatus(initialItem.status);
      setQuantity(initialItem.quantity);
      setLuggage(initialItem.luggage);
      setIsEssential(initialItem.isEssential);
      setNotes(initialItem.notes || '');
    } else {
      setName('');
      setCategoryId(defaultCategoryId || categories[0]?.id || '');
      setStatus('to-pack');
      setQuantity(1);
      setLuggage('carry_on');
      setIsEssential(false);
      setNotes('');
    }
  }, [initialItem, isOpen, categories, defaultCategoryId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !categoryId) return;

    onSave(
      {
        name: name.trim(),
        categoryId,
        status,
        quantity: Math.max(1, Number(quantity) || 1),
        luggage,
        isEssential,
        notes: notes.trim() || undefined,
      },
      initialItem?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">
            {initialItem ? 'Edit Packing Item' : 'Add Item to Packing List'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Item Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Item Name *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Universal travel plug adapter, Rain jacket"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-600 bg-white"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Current Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as ItemStatus)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-600 bg-white"
              >
                <option value="to-pack">To Pack (Pending)</option>
                <option value="packed">Packed (In Bag)</option>
                <option value="to-buy">Need to Buy / Procure</option>
              </select>
            </div>
          </div>

          {/* Luggage compartment & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Luggage Placement
              </label>
              <select
                value={luggage}
                onChange={e => setLuggage(e.target.value as LuggageType)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-600 bg-white"
              >
                <option value="personal_item">Personal Item (Backpack/Tote)</option>
                <option value="carry_on">Carry-On Overhead Roller</option>
                <option value="checked">Checked Baggage</option>
                <option value="worn">Worn on Transit</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Quantity
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-600 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Essential flag */}
          <div className="pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isEssential}
                onChange={e => setIsEssential(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-xs font-medium text-slate-800 flex items-center gap-1.5">
                <Star className={`w-3.5 h-3.5 ${isEssential ? 'text-amber-500 fill-amber-400' : 'text-slate-400'}`} />
                Mark as Essential (High Priority / Must-Not-Forget)
              </span>
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Notes & Reminders (Optional)
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Check battery charge, keep passport copy in cloud, max 100ml liquid limit..."
              rows={2}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-600 placeholder-slate-400"
            />
          </div>

          {/* Footer Actions */}
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
              {initialItem ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
