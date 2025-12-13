import type { IVenue } from "../objects/IVenue";
import type { LayoutVariant } from "./IVenueListProps";

// Se kommentarer i AthleteCardProps andågende CardVariant, confirming-variabel og onConfirmingChange-funksjon

export type CardVariant = "view" | "manage";

export interface IVenueCardProps {
  venue: IVenue;
  variant: CardVariant;
  layoutVariant?: LayoutVariant;
  confirming?: boolean;
  onConfirmingChange?: (confirming: boolean) => void;
  onActionFeedback?: (feedback: string) => void;
}
