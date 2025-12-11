import type { IAthlete } from "../objects/IAthlete";

export interface IAthleteContext {
  athletes: IAthlete[];
  searchResults: IAthlete[];
  athleteErrorMessage: string;
  athleteIsLoading: boolean;
  searchByID: (id: number) => Promise<void>;
  searchByName: (name: string) => Promise<void>;
  addAthlete: (
    athlete: Omit<IAthlete, "image" | "id">,
    img: File
  ) => Promise<void>;
  deleteAthleteById: (id: number) => Promise<void>;
  updateAthlete: (athlete: IAthlete, img?: File) => Promise<void>;
}
