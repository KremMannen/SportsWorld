// Her kunne vi brukt feks data: T[]; for å få interfaces som kan brukes på alle contexts
// Usikker på om det er innenfor pensum, så lager heller individuelle interfaces.

import type { IAthlete } from "./objects/IAthlete";
import type { IFinance } from "./objects/IFinance";
import type { IVenue } from "./objects/IVenue";

export interface IAthleteResponseList {
  success: boolean;
  data: IAthlete[];
  error?: string;
}

export interface IAthleteResponseSingle {
  success: boolean;
  data: IAthlete | null;
  error?: string;
}

export interface IVenueResponseList {
  success: boolean;
  data: IVenue[];
  error?: string;
}

export interface IVenueResponseSingle {
  success: boolean;
  data: IVenue | null;
  error?: string;
}

export interface IFinanceResponseSingle {
  success: boolean;
  data: IFinance | null;
  error?: string;
}
export interface IFinanceResponseList {
  success: boolean;
  data: IFinance[];
  error?: string;
}

export interface IDefaultResponse {
  success: boolean;
  id?: number;
  error?: string;
}

export interface IUploadResponse {
  success: boolean;
  fileName: string | null;
  error?: string;
}
