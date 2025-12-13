import type {
  IAthleteResponseList,
  IAthleteResponseSingle,
  IDefaultResponse,
} from "../IServiceResponses";
import type { IAthlete } from "../objects/IAthlete";

export interface IAthleteContext {
  athletes: IAthlete[];
  searchResults: IAthlete[];
  athleteIsLoading: boolean;
  searchByID: (id: number) => Promise<IAthleteResponseSingle>;
  searchByName: (name: string) => Promise<IAthleteResponseList>;
  addAthlete: (
    athlete: Omit<IAthlete, "image" | "id">,
    img: File
  ) => Promise<IAthleteResponseSingle>;
  deleteAthleteById: (id: number) => Promise<IDefaultResponse>;
  updateAthlete: (
    athlete: IAthlete,
    img?: File
  ) => Promise<IAthleteResponseSingle>;
}
