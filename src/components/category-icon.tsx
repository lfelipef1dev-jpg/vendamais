// Sistema de ícones SVG próprios VendaMais — sem emojis
import {
  Leaf, Beef, Croissant, Milk, Package,
  Snowflake, SprayCan, Baby, PawPrint,
  Apple, Fish, Cookie, Wine, GlassWater,
} from "lucide-react";

const iconMap: Record<string, typeof Leaf> = {
  leaf: Leaf,        // Hortifruti
  beef: Beef,        // Açougue
  bread: Croissant,  // Padaria
  cheese: Fish,      // Frios (peixes/frios)
  milk: Milk,        // Laticínios
  bottle: GlassWater,// Bebidas
  package: Package,  // Mercearia
  snowflake: Snowflake, // Congelados
  spray: SprayCan,   // Limpeza
  soap: Apple,       // Higiene (apple = cuidado/cosmético)
  baby: Baby,        // Bebê
  paw: PawPrint,     // Pet
};

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name] || Package;
  return <Icon className={className} aria-hidden="true" />;
}
