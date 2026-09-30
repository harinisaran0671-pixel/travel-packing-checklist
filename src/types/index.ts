export type ItemStatus = 'to-pack' | 'packed' | 'to-buy';

export type LuggageType = 'carry_on' | 'checked' | 'personal_item' | 'worn';

export interface PackingItem {
  id: string;
  name: string;
  categoryId: string;
  status: ItemStatus;
  quantity: number;
  luggage: LuggageType;
  isEssential: boolean;
  notes?: string;
}

export interface PackingCategory {
  id: string;
  name: string;
  iconName: string;
  color: string;
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  departureDate: string; // YYYY-MM-DD
  returnDate?: string;
  tripType: 'leisure' | 'business' | 'adventure' | 'weekend';
  categories: PackingCategory[];
  items: PackingItem[];
  notes?: string;
  createdAt: string;
}

export type ViewFilter = 'all' | 'unpacked' | 'packed' | 'to-buy' | 'essential';
export type GroupingMode = 'category' | 'luggage';
