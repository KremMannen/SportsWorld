export type ListVariant = "all" | "owned" | "available";

export interface IFeaturedFightersProps {
  filterType?: ListVariant;
  title?: string;
}
