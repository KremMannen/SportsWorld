import type { IAthlete } from "./IAthlete";

// En String Literal Union Type definisjon.
// Dette minner om enum, kan anses som en liste med strings som er gyldige alternativer
export type CardVariant = "view" | "manage" | "sign";

export interface IAthleteCardProps {
  athlete: IAthlete;
  variant: CardVariant;
  onEdit?: (athlete: IAthlete) => void;
  onDelete?: (id: number) => void;
  onSign?: (athlete: IAthlete) => void;
}
