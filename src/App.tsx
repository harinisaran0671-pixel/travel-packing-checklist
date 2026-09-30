import React, { useState } from 'react';
import { usePackingList } from './hooks/usePackingList';
import { Header } from './components/Header';
import { TripBanner } from './components/TripBanner';
import { CategorySection } from './components/CategorySection';
import { LuggageView } from './components/LuggageView';
import { PrintView } from './components/PrintView';
import { ItemModal } from './components/ItemModal';
import { TripModal } from './components/TripModal';
import { CategoryModal } from './components/CategoryModal';
import { ExportImportModal } from './components/ExportImportModal';
import { PackingItem, PackingCategory } from './types';
import {
  Plus,
  Layers,
  ShoppingBag,
  CheckCircle2,
  FolderPlus,
  Share2,
  Download,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export default function App() {
  const {
    trips,
    activeTripId,
    activeTrip,
    setActiveTripId,
    stats,
    categoryStats,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    groupingMode,
    setGroupingMode,
    filteredItems,
    toggleItemStatus,
    cycleItemStatus,
    addItem,
    updateItem,
    deleteItem,
    addCategory,
    updateCategory,
    deleteCategory,
    packAllInCategory,
    resetCategoryStatus,
    packAllInTrip,
    resetAllInTrip,
    createTrip,
    updateTripDetails,
    deleteTrip,
    duplicateTrip,
    exportTripJson,
    importTripJson,
  } = usePackingList();

  const [activeView, setActiveView] = useState<'checklist' | 'luggage' | 'print'>('checklist');

  // Modals state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PackingItem | null>(null);
  const [defaultCategoryIdForNewItem, setDefaultCategoryIdForNewItem] = useState<string | undefined>(undefined);

  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [isEditingTrip, setIsEditingTrip] = useState(false);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<PackingCategory | null>(null);

  const [isExportImportOpen, setIsExportImportOpen] = useState(false);

  // Item Modal Handlers
  const handleOpenNewItem = (categoryId?: string) => {
    setEditingItem(null);
    setDefaultCategoryIdForNewItem(categoryId || activeTrip?.categories[0]?.id);
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item: PackingItem) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (itemData: Omit<PackingItem, 'id'>, id?: string) => {
    if (id) {
      updateItem(id, itemData);
    } else {
      addItem(itemData);
    }
  };

  // Trip Modal Handlers
  const handleOpenNewTrip = () => {
    setIsEditingTrip(false);
    setIsTripModalOpen(true);
  };

  const handleEditTrip = () => {
    setIsEditingTrip(true);
    setIsTripModalOpen(true);
  };

  // Category Modal Handlers
  const handleOpenNewCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (cat: PackingCategory) => {
    setEditingCategory(cat);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (name: string, iconName: string, id?: string) => {
    if (id) {
      updateCategory(id, { name, iconName });
    } else {
      addCategory(name, iconName);
    }
  };

  if (!activeTrip) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-slate-600 mb-3">No trips found.</p>
          <button
            onClick={handleOpenNewTrip}
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg"
          >
            Create Trip Checklist
          </button>
        </div>
      </div>
    );
  }

  // Print view override
  if (activeView === 'print') {
    return (
      <PrintView
        trip={activeTrip}
        categories={activeTrip.categories}
        items={activeTrip.items}
        onBack={() => setActiveView('checklist')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col">
      {/* Top Header conforming to 3-zone contract */}
      <Header
        currentTrip={activeTrip}
        allTrips={trips}
        onSelectTrip={id => setActiveTripId(id)}
        onOpenNewTripModal={handleOpenNewTrip}
        onOpenNewItemModal={() => handleOpenNewItem()}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Trip Banner with Departure Info, Progress Metric Bar, and Filter Controls */}
      <TripBanner
        trip={activeTrip}
        stats={stats}
        filter={filter}
        setFilter={setFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        groupingMode={groupingMode}
        setGroupingMode={setGroupingMode}
        onPackAll={packAllInTrip}
        onResetAll={resetAllInTrip}
        onEditTrip={handleEditTrip}
        onDuplicateTrip={() => duplicateTrip(activeTrip.id)}
        onDeleteTrip={() => {
          if (confirm(`Delete "${activeTrip.title}" checklist?`)) {
            deleteTrip(activeTrip.id);
          }
        }}
        onPrint={() => setActiveView('print')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'luggage' || groupingMode === 'luggage' ? (
          /* Luggage Compartment View */
          <LuggageView
            trip={activeTrip}
            filteredItems={filteredItems}
            onToggleStatus={toggleItemStatus}
            onCycleStatus={cycleItemStatus}
            onUpdateItem={updateItem}
            onDeleteItem={deleteItem}
            onEditItem={handleEditItem}
            onOpenNewItemModal={() => handleOpenNewItem()}
          />
        ) : (
          /* Standard Category Grouped View */
          <div>
            {/* If items exist in filtered view */}
            {activeTrip.categories.map(category => {
              const categoryItems = filteredItems.filter(i => i.categoryId === category.id);
              const cStats = categoryStats[category.id] || { total: 0, packed: 0, percentage: 0 };

              // If a filter is active and this category has no matching items, we can still render it if total items match or hide if filter active
              if (filter !== 'all' && categoryItems.length === 0) {
                return null;
              }

              return (
                <CategorySection
                  key={category.id}
                  category={category}
                  items={categoryItems}
                  stats={cStats}
                  onToggleStatus={toggleItemStatus}
                  onCycleStatus={cycleItemStatus}
                  onUpdateItem={updateItem}
                  onDeleteItem={deleteItem}
                  onEditItem={handleEditItem}
                  onAddItem={addItem}
                  onPackAllInCategory={packAllInCategory}
                  onResetCategory={resetCategoryStatus}
                  onEditCategory={handleEditCategory}
                  onDeleteCategory={id => {
                    if (confirm(`Delete category "${category.name}" and all its items?`)) {
                      deleteCategory(id);
                    }
                  }}
                />
              );
            })}

            {/* Empty state when filters return 0 items */}
            {filteredItems.length === 0 && (
              <div className="text-center py-12 px-4 bg-white rounded-xl border border-slate-200">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-800">
                  No items found
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                  {searchQuery
                    ? `No checklist items match "${searchQuery}". Try changing your search query or filter.`
                    : filter !== 'all'
                    ? `No items match the active "${filter}" filter.`
                    : 'Your packing list is currently empty. Add items or create from a template.'}
                </p>
                <div className="flex items-center justify-center gap-2">
                  {(searchQuery || filter !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setFilter('all');
                      }}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Clear Filters</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleOpenNewItem()}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Item</span>
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Controls: Add Category & Backup */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={handleOpenNewCategory}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors shadow-2xs"
              >
                <FolderPlus className="w-4 h-4 text-teal-600" />
                <span>+ Add Custom Category</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsExportImportOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Backup & Share JSON</span>
                </button>

                <button
                  onClick={() => setActiveView('print')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>Printable Checklist</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            PackVoyage · {activeTrip.title} ({stats.percentage}% ready)
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsExportImportOpen(true)}
              className="hover:text-slate-800 transition-colors"
            >
              Export / Import
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveView('print')}
              className="hover:text-slate-800 transition-colors"
            >
              Print Sheet
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
        initialItem={editingItem}
        categories={activeTrip.categories}
        defaultCategoryId={defaultCategoryIdForNewItem}
      />

      <TripModal
        isOpen={isTripModalOpen}
        onClose={() => setIsTripModalOpen(false)}
        onSaveNewTrip={createTrip}
        onUpdateTrip={updateTripDetails}
        initialTrip={isEditingTrip ? activeTrip : null}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        initialCategory={editingCategory}
      />

      <ExportImportModal
        isOpen={isExportImportOpen}
        onClose={() => setIsExportImportOpen(false)}
        exportData={exportTripJson()}
        onImport={importTripJson}
      />
    </div>
  );
}
