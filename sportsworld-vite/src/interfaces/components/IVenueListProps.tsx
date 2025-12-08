import type { CardVariant } from "./IVenueCardProps";

export type LayoutVariant = "horizontal" | "grid";
export interface IVenueListProps {
  cardVariant?: CardVariant;
  isLimited?: boolean;
  layoutVariant?: LayoutVariant;
}
