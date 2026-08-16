import {
  Shirt,
  UtensilsCrossed,
  Smartphone,
  Sparkles,
  Sofa,
  Car,
  Wrench,
  Leaf,
  Hammer,
  HeartPulse,
  type LucideIcon,
} from 'lucide-react'

export const CATEGORY_ICON: Record<string, LucideIcon> = {
  fashion: Shirt,
  food: UtensilsCrossed,
  electronics: Smartphone,
  beauty: Sparkles,
  home: Sofa,
  auto: Car,
  services: Wrench,
  farm: Leaf,
  building: Hammer,
  health: HeartPulse,
}

export function categoryIcon(id: string): LucideIcon {
  return CATEGORY_ICON[id] ?? Sparkles
}
