import React from 'react';
import {
  FileText,
  Shirt,
  Footprints,
  Sparkles,
  Cpu,
  HeartPulse,
  Luggage,
  Package,
  Backpack,
  Compass,
  Camera,
  Coffee,
  Umbrella,
  Watch,
  Sun,
  Shield,
  Tag,
} from 'lucide-react';

interface CategoryIconProps {
  iconName: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ iconName, className = 'w-4 h-4' }) => {
  switch (iconName.toLowerCase()) {
    case 'filetext':
    case 'docs':
    case 'documents':
      return <FileText className={className} />;
    case 'shirt':
    case 'clothes':
    case 'clothing':
      return <Shirt className={className} />;
    case 'footprints':
    case 'shoes':
    case 'footwear':
      return <Footprints className={className} />;
    case 'sparkles':
    case 'toiletries':
    case 'beauty':
      return <Sparkles className={className} />;
    case 'cpu':
    case 'electronics':
    case 'gadgets':
      return <Cpu className={className} />;
    case 'heartpulse':
    case 'health':
    case 'medical':
      return <HeartPulse className={className} />;
    case 'luggage':
    case 'gear':
    case 'bag':
      return <Luggage className={className} />;
    case 'backpack':
      return <Backpack className={className} />;
    case 'compass':
      return <Compass className={className} />;
    case 'camera':
      return <Camera className={className} />;
    case 'coffee':
      return <Coffee className={className} />;
    case 'umbrella':
      return <Umbrella className={className} />;
    case 'watch':
      return <Watch className={className} />;
    case 'sun':
      return <Sun className={className} />;
    case 'shield':
      return <Shield className={className} />;
    default:
      return <Package className={className} />;
  }
};
