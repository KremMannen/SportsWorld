import type { IVenue } from "../objects/IVenue";

export type CardVariant = "view" | "manage";

export interface IVenueCardProps {
  venue: IVenue;
  variant: CardVariant;
  onEdit?: (venue: IVenue) => void;
  onDelete?: (id: number) => void;
}
