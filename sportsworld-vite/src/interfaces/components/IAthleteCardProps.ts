import type { IAthlete } from "../objects/IAthlete";
import type { LayoutVariant } from "./IAthleteListProps";

// type CardVariant fungerer litt som en enum: en liste med strings som er gyldige alternativer.
// Forskjellen er at denne kun eksisterer i TypeScript / ved kompileringstid, og ikke ved runtime.
// Enum skaper et objekt som finnes ved runtime, mens type CardVariant forsvinner etter kompilering.

// Type CardVariant brukes for å gi TypeScript beskjed om å vise feil i IntelliSense
// hvis noen prøver å bruke en ugyldig verdi (f.eks. "edit" i stedet for "manage").

// Alternativet hadde vært å gi variant type: string.
// Da kunne vi i komponenten sjekket manuelt etter disse string-verdiene, men vi mister type-safety.
// For å sikre type safety bruker vi String Literal Union som type annotation for variant:
export type CardVariant = "view" | "manage" | "finance";

// Vi bruker en confirming-variabel og en onConfirmingChange-funksjon for å kontrollere om brukeren trykker på "delete" knappen
export interface IAthleteCardProps {
  athlete: IAthlete;
  variant: CardVariant;
  layoutVariant?: LayoutVariant;
  confirming?: boolean;
  onConfirmingChange?: (confirming: boolean) => void;
}
