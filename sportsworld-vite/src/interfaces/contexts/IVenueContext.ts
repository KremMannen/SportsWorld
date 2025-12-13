import type {
  IDefaultResponse,
  IVenueResponseList,
  IVenueResponseSingle,
} from "../IServiceResponses";
import type { IVenue } from "../objects/IVenue";

export interface IVenueContext {
  venues: IVenue[];
  searchResults: IVenue[];
  isLoading: boolean;
  initError: string | null;
  searchByID: (id: number) => Promise<IVenueResponseSingle>;
  searchByName: (name: string) => Promise<IVenueResponseList>;
  addVenue: (
    venue: Omit<IVenue, "id" | "image">,
    img: File
  ) => Promise<IVenueResponseSingle>;
  deleteVenueById: (id: number) => Promise<IDefaultResponse>;
  updateVenue: (venue: IVenue, img?: File) => Promise<IVenueResponseSingle>;
}
