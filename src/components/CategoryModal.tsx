import React, { useState, useEffect } from 'react';
import { PackingCategory } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { X, Tag } from 'lucide-react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, iconName: string, id?: string) => void;
  initialCategory?: PackingCategory | null;
}

const AVAILABLE_ICONS = [
  { name: 'FileText', label: 'Documents' },
  { name: 'Shirt', label: 'Clothing' },
  { name: 'Footprints', label: 'Shoes' },
  { name: 'Sparkles', label: 'Toiletries' },
  { name: 'Cpu', label: 'Electronics' },
  { name: 'HeartPulse', label: 'Health' },
  { name: 'Luggage', label: 'Bags' },
  { name: 'Backpack', label: 'Daypack' },
  { name: 'Camera', label: 'Photography' },
  { name: 'Compass', label: 'Outdoor' },
  { name: 'Umbrella', label: 'Weather' },
  { name: 'Sun', label: 'Beach' },
  { name: 'Coffee', label: 'Snacks' },
  { name: 'Shield', label: 'Security' },
];

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCategory,
}) => {
  const [name, setName] = useState('');
  const [iconName, setIconName] = useState('Luggage');

  useEffect(() => {
    if (initialCategory) {
      setName(initialCategory.name);
      setIconName(initialCategory.iconName || 'Luggage');
    } else {
      setName('');
      setIconName('Luggage');
    }
  }, [initialCategory, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name.trim(), iconName, initialCategory?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">
            {initialCategory ? 'Edit Category' : 'Add New Category'}
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
              Category Name *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Scuba Diving Gear, Winter Snow Gear"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Choose Icon
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {AVAILABLE_ICONS.map(item => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setIconName(item.name)}
                  className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 transition-colors ${
                    iconName === item.name
                      ? 'border-teal-600 bg-teal-50 text-teal-700'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                  title={item.label}
                >
                  <CategoryIcon iconName={item.name} className="w-5 h-5" />
                  <span className="text-[10px] truncate max-w-full">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

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
              {initialCategory ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
