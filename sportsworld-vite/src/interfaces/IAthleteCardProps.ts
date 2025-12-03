import type { IAthlete } from "./IAthlete";

// type CardVariant fugnerer som en enum, en liste med strings som er gyldige alternativer.
// Forskjellen er at denne kun eksisterer i TypeScript / ved kompileringstid, og ikke ved runtime.
// Enum skaper et objekt som kjøres ved runtime, og gir feilmelding.

// Alternativet hadde vært å gi variant type: string.
// Da kunne vi i komponenten sjekket manuelt etter disse string-verdiene, men vi mister type-safety.
// For å sikre type safety bruker vi String Literal Union som type annotation for variant:
export type CardVariant = "view" | "manage" | "sign";

export interface IAthleteCardProps {
  athlete: IAthlete;
  variant: CardVariant;
  onEdit?: (athlete: IAthlete) => void;
  onDelete?: (id: number) => void;
  onSign?: (athlete: IAthlete) => void;
}
