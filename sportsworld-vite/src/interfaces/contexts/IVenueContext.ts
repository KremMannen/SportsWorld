import type { IVenue } from "../objects/IVenue";

export interface IVenueContext {
  venues: IVenue[];
  searchResults: IVenue[];
  errorMessage: string;
  isLoading: boolean;
  showAll: () => Promise<void>;
  searchByID: (id: number) => Promise<void>;
  searchByName: (name: string) => Promise<void>;
  addVenue: (venue: Omit<IVenue, "id">, img: File) => Promise<void>;
  deleteVenueById: (id: number) => Promise<void>;
  updateVenue: (venue: IVenue) => Promise<void>;
}
