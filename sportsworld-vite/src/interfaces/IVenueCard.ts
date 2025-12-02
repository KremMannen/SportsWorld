import type { IVenue } from "./IVenue";

// En String Literal Union Type definisjon.
// Dette minner om enum, kan anses som en liste med strings som er gyldige alternativer
export type CardVariant = "view" | "manage";

export interface IVenueCardProps {
  venue: IVenue;
  variant: CardVariant;
  onEdit?: (venue: IVenue) => void;
  onDelete?: (id: number) => void;
  onSign?: (venue: IVenue) => void;
}
