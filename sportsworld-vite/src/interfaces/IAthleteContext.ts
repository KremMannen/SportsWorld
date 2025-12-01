import type { IAthlete } from "./IAthlete";

export interface IAthleteContext {
  athletes: IAthlete[];
  searchResults: IAthlete[];
  errorMessage: string;
  showAll: () => Promise<void>;
  searchByID: (id: number) => Promise<void>;
  searchByName: (name: string) => Promise<void>;
  addAthlete: (athlete: Omit<IAthlete, "id">, img: File) => Promise<void>;
  deleteAthleteById: (id: number) => Promise<void>;
  updateAthlete: (athlete: IAthlete) => Promise<void>;
}
