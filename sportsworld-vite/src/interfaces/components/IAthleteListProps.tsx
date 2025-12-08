import type { CardVariant } from "./IAthleteCardProps";

export type ListVariant = "all" | "owned" | "available";
export type LayoutVariant = "horizontal" | "grid";

export interface IAthleteListProps {
  filterType?: ListVariant;
  cardVariant?: CardVariant;
  layoutVariant?: LayoutVariant;
}
