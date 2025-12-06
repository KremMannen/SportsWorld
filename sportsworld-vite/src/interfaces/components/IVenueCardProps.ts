import type { IVenue } from "../objects/IVenue";

export type CardVariant = "view" | "manage";

export interface IVenueCardProps {
  venue: IVenue;
  variant: CardVariant;
}
