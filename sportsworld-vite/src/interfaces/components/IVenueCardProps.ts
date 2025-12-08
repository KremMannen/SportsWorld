import type { IVenue } from "../objects/IVenue";
import type { LayoutVariant } from "./IVenueListProps";

export type CardVariant = "view" | "manage";

export interface IVenueCardProps {
  venue: IVenue;
  variant: CardVariant;
  layoutVariant?: LayoutVariant;
}
