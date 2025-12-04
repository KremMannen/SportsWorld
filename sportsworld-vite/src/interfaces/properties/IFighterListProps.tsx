import type { CardVariant } from "./IAthleteCardProps";

export type ListVariant = "all" | "owned" | "available";

export interface IFighterListProps {
  filterType?: ListVariant;
  cardVariant?: CardVariant;
}
