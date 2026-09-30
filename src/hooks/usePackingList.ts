import { useState, useEffect, useMemo, useCallback } from 'react';
import { Trip, PackingItem, PackingCategory, ItemStatus, LuggageType, ViewFilter, GroupingMode } from '../types';
import { INITIAL_TRIPS, DEFAULT_CATEGORIES } from '../data/templates';

const STORAGE_KEY = 'packvoyage_trips_data_v1';
const ACTIVE_TRIP_KEY = 'packvoyage_active_trip_id_v1';

export function usePackingList() {
  const [trips, setTrips] = useState<Trip[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_TRIPS;
  });

  const [activeTripId, setActiveTripId] = useState<string>(() => {
    try {
      const storedId = localStorage.getItem(ACTIVE_TRIP_KEY);
      if (storedId && trips.some(t => t.id === storedId)) {
        return storedId;
      }
    } catch {
      // Fallback
    }
    return trips[0]?.id || '';
  });

  const [filter, setFilter] = useState<ViewFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [groupingMode, setGroupingMode] = useState<GroupingMode>('category');

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    } catch {
      // ignore quota errors
    }
  }, [trips]);

  useEffect(() => {
    if (activeTripId) {
      try {
        localStorage.setItem(ACTIVE_TRIP_KEY, activeTripId);
      } catch {
        // ignore
      }
    }
  }, [activeTripId]);

  const activeTrip = useMemo(() => {
    return trips.find(t => t.id === activeTripId) || trips[0];
  }, [trips, activeTripId]);

  // Statistics
  const stats = useMemo(() => {
    if (!activeTrip) {
      return {
        total: 0,
        packed: 0,
        toPack: 0,
        toBuy: 0,
        percentage: 0,
        essentialTotal: 0,
        essentialPacked: 0,
      };
    }
    const total = activeTrip.items.length;
    const packed = activeTrip.items.filter(i => i.status === 'packed').length;
    const toBuy = activeTrip.items.filter(i => i.status === 'to-buy').length;
    const toPack = activeTrip.items.filter(i => i.status === 'to-pack').length;
    const percentage = total === 0 ? 0 : Math.round((packed / total) * 100);

    const essentialItems = activeTrip.items.filter(i => i.isEssential);
    const essentialTotal = essentialItems.length;
    const essentialPacked = essentialItems.filter(i => i.status === 'packed').length;

    return {
      total,
      packed,
      toPack,
      toBuy,
      percentage,
      essentialTotal,
      essentialPacked,
    };
  }, [activeTrip]);

  // Category stats
  const categoryStats = useMemo(() => {
    const map: Record<string, { total: number; packed: number; percentage: number }> = {};
    if (!activeTrip) return map;

    for (const cat of activeTrip.categories) {
      const catItems = activeTrip.items.filter(i => i.categoryId === cat.id);
      const total = catItems.length;
      const packed = catItems.filter(i => i.status === 'packed').length;
      const percentage = total === 0 ? 0 : Math.round((packed / total) * 100);
      map[cat.id] = { total, packed, percentage };
    }
    return map;
  }, [activeTrip]);

  // Luggage stats
  const luggageStats = useMemo(() => {
    const bagTypes: LuggageType[] = ['personal_item', 'carry_on', 'checked', 'worn'];
    const map: Record<LuggageType, { total: number; packed: number; percentage: number }> = {
      personal_item: { total: 0, packed: 0, percentage: 0 },
      carry_on: { total: 0, packed: 0, percentage: 0 },
      checked: { total: 0, packed: 0, percentage: 0 },
      worn: { total: 0, packed: 0, percentage: 0 },
    };
    if (!activeTrip) return map;

    for (const bag of bagTypes) {
      const bagItems = activeTrip.items.filter(i => i.luggage === bag);
      const total = bagItems.length;
      const packed = bagItems.filter(i => i.status === 'packed').length;
      const percentage = total === 0 ? 0 : Math.round((packed / total) * 100);
      map[bag] = { total, packed, percentage };
    }
    return map;
  }, [activeTrip]);

  // Filtered items
  const filteredItems = useMemo(() => {
    if (!activeTrip) return [];
    let items = activeTrip.items;

    // Filter status
    if (filter === 'unpacked') {
      items = items.filter(i => i.status !== 'packed');
    } else if (filter === 'packed') {
      items = items.filter(i => i.status === 'packed');
    } else if (filter === 'to-buy') {
      items = items.filter(i => i.status === 'to-buy');
    } else if (filter === 'essential') {
      items = items.filter(i => i.isEssential);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(
        i =>
          i.name.toLowerCase().includes(q) ||
          i.notes?.toLowerCase().includes(q) ||
          i.luggage.toLowerCase().includes(q)
      );
    }

    return items;
  }, [activeTrip, filter, searchQuery]);

  // Actions on Items
  const toggleItemStatus = useCallback((itemId: string, newStatus?: ItemStatus) => {
    setTrips(prev =>
      prev.map(trip => {
        if (trip.id !== activeTripId) return trip;
        return {
          ...trip,
          items: trip.items.map(item => {
            if (item.id !== itemId) return item;
            if (newStatus !== undefined) {
              return { ...item, status: newStatus };
            }
            // Default toggle: if packed -> to-pack, else -> packed
            return {
              ...item,
              status: item.status === 'packed' ? 'to-pack' : 'packed',
            };
          }),
        };
      })
    );
  }, [activeTripId]);

  const cycleItemStatus = useCallback((itemId: string) => {
    setTrips(prev =>
      prev.map(trip => {
        if (trip.id !== activeTripId) return trip;
        return {
          ...trip,
          items: trip.items.map(item => {
            if (item.id !== itemId) return item;
            // Cycle: to-pack -> packed -> to-buy -> to-pack
            const nextStatus: ItemStatus =
              item.status === 'to-pack' ? 'packed' : item.status === 'packed' ? 'to-buy' : 'to-pack';
            return { ...item, status: nextStatus };
          }),
        };
      })
    );
  }, [activeTripId]);

  const addItem = useCallback((itemData: Omit<PackingItem, 'id'>) => {
    const newItem: PackingItem = {
      ...itemData,
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    setTrips(prev =>
      prev.map(trip => {
        if (trip.id !== activeTripId) return trip;
        return {
          ...trip,
          items: [...trip.items, newItem],
        };
      })
    );
    return newItem;
  }, [activeTripId]);

  const updateItem = useCallback((itemId: string, updates: Partial<PackingItem>) => {
    setTrips(prev =>
      prev.map(trip => {
        if (trip.id !== activeTripId) return trip;
        return {
          ...trip,
          items: trip.items.map(item => {
            if (item.id !== itemId) return item;
            return { ...item, ...updates };
          }),
        };
      })
    );
  }, [activeTripId]);

  const deleteItem = useCallback((itemId: string) => {
    setTrips(prev =>
      prev.map(trip => {
        if (trip.id !== activeTripId) return trip;
        return {
          ...trip,
          items: trip.items.filter(item => item.id !== itemId),
        };
      })
    );
  }, [activeTripId]);

  // Category Actions
  const addCategory = useCallback((name: string, iconName = 'Package', color = 'indigo') => {
    const newCat: PackingCategory = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      iconName,
      color,
    };
    setTrips(prev =>
      prev.map(trip => {
        if (trip.id !== activeTripId) return trip;
        return {
          ...trip,
          categories: [...trip.categories, newCat],
        };
      })
    );
  }, [activeTripId]);

  const updateCategory = useCallback((categoryId: string, updates: Partial<PackingCategory>) => {
    setTrips(prev =>
      prev.map(trip => {
        if (trip.id !== activeTripId) return trip;
        return {
          ...trip,
          categories: trip.categories.map(c => (c.id === categoryId ? { ...c, ...updates } : c)),
        };
      })
    );
  }, [activeTripId]);

  const deleteCategory = useCallback((categoryId: string) => {
    setTrips(prev =>
      prev.map(trip => {
        if (trip.id !== activeTripId) return trip;
        return {
          ...trip,
          categories: trip.categories.filter(c => c.id !== categoryId),
          items: trip.items.filter(i => i.categoryId !== categoryId),
        };
      })
    );
  }, [activeTripId]);

  // Bulk actions
  const packAllInCategory = useCallback((categoryId: string) => {
    setTrips(prev =>
      prev.map(trip => {
        if (trip.id !== activeTripId) return trip;
        return {
          ...trip,
          items: trip.items.map(item => {
            if (item.categoryId === categoryId) {
              return { ...item, status: 'packed' };
            }
            return item;
          }),
        };
      })
    );
  }, [activeTripId]);

  const resetCategoryStatus = useCallback((categoryId: string) => {
    setTrips(prev =>
      prev.map(trip => {
        if (trip.id !== activeTripId) return trip;
        return {
          ...trip,
          items: trip.items.map(item => {
            if (item.categoryId === categoryId) {
              return { ...item, status: 'to-pack' };
            }
            return item;
          }),
        };
      })
    );
  }, [activeTripId]);

  const packAllInTrip = useCallback(() => {
    setTrips(prev =>
      prev.map(trip => {
        if (trip.id !== activeTripId) return trip;
        return {
          ...trip,
          items: trip.items.map(item => ({ ...item, status: 'packed' })),
        };
      })
    );
  }, [activeTripId]);

  const resetAllInTrip = useCallback(() => {
    setTrips(prev =>
      prev.map(trip => {
        if (trip.id !== activeTripId) return trip;
        return {
          ...trip,
          items: trip.items.map(item => ({ ...item, status: 'to-pack' })),
        };
      })
    );
  }, [activeTripId]);

  // Trip Management
  const createTrip = useCallback((tripData: Omit<Trip, 'id' | 'createdAt'>) => {
    const newTrip: Trip = {
      ...tripData,
      id: `trip-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTrips(prev => [newTrip, ...prev]);
    setActiveTripId(newTrip.id);
    return newTrip.id;
  }, []);

  const updateTripDetails = useCallback((updates: Partial<Trip>) => {
    setTrips(prev =>
      prev.map(trip => {
        if (trip.id !== activeTripId) return trip;
        return { ...trip, ...updates };
      })
    );
  }, [activeTripId]);

  const deleteTrip = useCallback((tripId: string) => {
    setTrips(prev => {
      const remaining = prev.filter(t => t.id !== tripId);
      if (remaining.length === 0) {
        // keep at least one default
        const fallback: Trip = {
          id: `trip-${Date.now()}`,
          title: 'My Next Getaway',
          destination: 'Travel Destination',
          departureDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
          tripType: 'leisure',
          categories: DEFAULT_CATEGORIES,
          items: [],
          createdAt: new Date().toISOString(),
        };
        setActiveTripId(fallback.id);
        return [fallback];
      }
      if (activeTripId === tripId) {
        setActiveTripId(remaining[0].id);
      }
      return remaining;
    });
  }, [activeTripId]);

  const duplicateTrip = useCallback((tripId: string) => {
    const source = trips.find(t => t.id === tripId);
    if (!source) return;
    const duplicated: Trip = {
      ...source,
      id: `trip-${Date.now()}`,
      title: `${source.title} (Copy)`,
      createdAt: new Date().toISOString(),
      items: source.items.map(i => ({
        ...i,
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        status: 'to-pack', // reset status on duplicate for fresh packing
      })),
    };
    setTrips(prev => [duplicated, ...prev]);
    setActiveTripId(duplicated.id);
  }, [trips]);

  // Export / Import
  const exportTripJson = useCallback(() => {
    return JSON.stringify(activeTrip, null, 2);
  }, [activeTrip]);

  const importTripJson = useCallback((jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.title && Array.isArray(parsed.categories) && Array.isArray(parsed.items)) {
        const importedTrip: Trip = {
          ...parsed,
          id: `trip-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        setTrips(prev => [importedTrip, ...prev]);
        setActiveTripId(importedTrip.id);
        return true;
      }
    } catch {
      // invalid JSON
    }
    return false;
  }, []);

  return {
    trips,
    activeTripId,
    activeTrip,
    setActiveTripId,
    stats,
    categoryStats,
    luggageStats,
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
  };
}
