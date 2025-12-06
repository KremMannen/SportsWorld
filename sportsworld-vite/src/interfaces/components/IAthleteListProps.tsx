import type { CardVariant } from "./IAthleteCardProps";

export type ListVariant = "all" | "owned" | "available";

export interface IAthleteListProps {
  filterType?: ListVariant;
  cardVariant?: CardVariant;
}
