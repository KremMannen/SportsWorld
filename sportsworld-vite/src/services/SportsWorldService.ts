import axios, { type AxiosResponse } from "axios";
import type { IAthlete } from "../interfaces/IAthlete";
import type { IVenue } from "../interfaces/IVenue";
import type { IFinance } from "../interfaces/IFinance";
import type {
  IAthleteResponseList,
  IAthleteResponseSingle,
  IDefaultResponse,
  IFinanceResponseList,
  IVenueResponseList,
  IVenueResponseSingle,
} from "../interfaces/IServiceResponses";

const athleteEndpoint = "http://localhost:5110/api/athlete";
const venueEndpoint = "http://localhost:5110/api/venue";
const financeEndpoint = "http://localhost:5110/api/finance";

const getAthletes = async (): Promise<IAthleteResponseList> => {
  try {
    const response = await axios.get<IAthlete[]>(athleteEndpoint);
    const validation = validateResponseList(response);

    if (!validation.isValid) {
      return { success: false, data: null, error: validation.error };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("getAthletes: Failed to fetch athletes:", error);
    return {
      success: false,
      data: null,
    };
  }
};
const getAthleteById = async (id: number): Promise<IAthleteResponseSingle> => {
  try {
    const response = await axios.get<IAthlete>(`${athleteEndpoint}/${id}`);
    const validation = validateResponseSingle(response);

    if (!validation.isValid) {
      return { success: false, data: null, error: validation.error };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("getAthleteById: Failed to fetch athlete:", error);
    return {
      success: false,
      data: null,
    };
  }
};
const getAthletesByName = async (
  query: string
): Promise<IAthleteResponseList> => {
  try {
    const response = await axios.get<IAthlete[]>(
      `${athleteEndpoint}/byname/${query}`
    );
    const validation = validateResponseList(response);

    if (!validation.isValid) {
      return { success: false, data: null, error: validation.error };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("getAthletesByName: Failed to fetch athletes:", error);
    return {
      success: false,
      data: null,
    };
  }
};
const postAthlete = async (
  newAthlete: Omit<IAthlete, "id">
): Promise<IAthleteResponseSingle> => {
  try {
    const response = await axios.post<IAthlete>(athleteEndpoint, newAthlete);

    if (response.status !== 201) {
      return { success: false, data: null, error: "Failed to create athlete." };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("postAthlete: Failed to post athlete:", error);
    return {
      success: false,
      data: null,
    };
  }
};
const deleteAthlete = async (id: number): Promise<IDefaultResponse> => {
  try {
    const response = await axios.delete(`${athleteEndpoint}/${id}`);

    if (response.status !== 204) {
      return { success: false, error: "Failed to create athlete." };
    }
    return {
      success: true,
    };
  } catch (error) {
    console.error("deleteAthlete: Failed to delete athlete:", error);
    return {
      success: false,
    };
  }
};
const putAthlete = async (
  editedAthlete: IAthlete
): Promise<IDefaultResponse> => {
  try {
    const response = await axios.put(athleteEndpoint, editedAthlete);

    if (response.status !== 204) {
      return { success: false, error: "Failed to update athlete." };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("putAthlete: Failed to put athlete:", error);
    return {
      success: false,
    };
  }
};
const getVenues = async (): Promise<IVenueResponseList> => {
  try {
    const response = await axios.get<IVenue[]>(venueEndpoint);
    const validation = validateResponseList(response);

    if (!validation.isValid) {
      return { success: false, data: null, error: validation.error };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("getVenues: Failed to fetch venues:", error);
    return {
      success: false,
      data: null,
    };
  }
};
const getVenueById = async (id: number): Promise<IVenueResponseSingle> => {
  try {
    const response = await axios.get<IVenue>(`${venueEndpoint}/${id}`);
    const validation = validateResponseSingle(response);

    if (!validation.isValid) {
      return { success: false, data: null, error: validation.error };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("getVenueById: Failed to fetch venue:", error);
    return {
      success: false,
      data: null,
    };
  }
};
const getVenueByName = async (query: string): Promise<IVenueResponseList> => {
  try {
    const response = await axios.get<IVenue[]>(
      `${venueEndpoint}/byname/${query}`
    );
    const validation = validateResponseList(response);

    if (!validation.isValid) {
      return { success: false, data: null, error: validation.error };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("getVenueByName: Failed to fetch venues:", error);
    return {
      success: false,
      data: null,
    };
  }
};
const postVenue = async (
  newVenue: Omit<IVenue, "id">
): Promise<IVenueResponseSingle> => {
  try {
    const response = await axios.post<IVenue>(venueEndpoint, newVenue);

    if (response.status !== 201) {
      return { success: false, data: null, error: "Failed to create venue." };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("postVenue: Failed to post venue:", error);
    return {
      success: false,
      data: null,
    };
  }
};
const deleteVenue = async (id: number): Promise<IDefaultResponse> => {
  try {
    const response = await axios.delete(`${venueEndpoint}/${id}`);

    if (response.status !== 204) {
      return { success: false, error: "Failed to delete venue." };
    }
    return {
      success: true,
    };
  } catch (error) {
    console.error("deleteVenue: Failed to delete venue:", error);
    return {
      success: false,
    };
  }
};
const putVenue = async (editedVenue: IVenue): Promise<IDefaultResponse> => {
  try {
    const response = await axios.put(venueEndpoint, editedVenue);

    if (response.status !== 204) {
      return { success: false, error: "Failed to update venue." };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("putVenue: Failed to put venue:", error);
    return {
      success: false,
    };
  }
};
// Her er det bare 1 objekt som returneres,
// men vi vedlikeholder mønsteret til get funksjoner og returnerer liste
const getFinances = async (): Promise<IFinanceResponseList> => {
  try {
    const response = await axios.get<IFinance[]>(financeEndpoint);
    const validation = validateResponseList(response);

    if (!validation.isValid) {
      return { success: false, data: null, error: validation.error };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("getFinances: Failed to fetch finances:", error);
    return {
      success: false,
      data: null,
    };
  }
};
const putFinance = async (
  editedFinance: IFinance
): Promise<IDefaultResponse> => {
  try {
    const response = await axios.put(financeEndpoint, editedFinance);
    if (response.status !== 204) {
      return { success: false, error: "Failed to update finance." };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("putFinance: Failed to put finance:", error);
    return {
      success: false,
    };
  }
};

// Hjelpefunksjoner for å validere outputtet fra Axios kallene
// Skåner alle andre metoder mange identiske if-checks
// Passere bruker-vennlige feilmeldinger tilbake til kallende funksjon
const validateResponseList = (
  response: AxiosResponse
): { isValid: boolean; error?: string } => {
  // Sjekk om response status er 200 OK, andre statuskoder indikerer feil
  if (response.status !== 200) {
    return { isValid: false, error: "Failed to fetch from server." };
  }

  // Sjekker at dataen eksisterer, og at den er i forventet format (array)
  // isArray sjekken hentet på forelesers anbefaling fra: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
  if (!response.data || !Array.isArray(response.data)) {
    return {
      isValid: false,
      error: "Invalid data format received from server",
    };
  }

  // Sjekker at data-arrayen ikke er tom. setter isValid til true her, da tom array ikke er feil per se
  if (response.data.length === 0) {
    return { isValid: true, error: "No data available in the server." };
  }

  return { isValid: true, error: "" };
};

const validateResponseSingle = (
  response: AxiosResponse
): { isValid: boolean; error?: string } => {
  // Sjekk om response status er 200 OK, andre statuskoder indikerer feil
  if (response.status !== 200) {
    return { isValid: false, error: "Failed to fetch from server." };
  }

  // Sjekker at dataen eksisterer
  if (!response.data) {
    return {
      isValid: false,
      error: "No data available in the server.",
    };
  }
  return { isValid: true };
};

// Not implemented
// POST and Delete -- Not necessary in current scope

export {
  getAthletes,
  getAthleteById,
  getAthletesByName,
  postAthlete,
  deleteAthlete,
  putAthlete,
  getVenues,
  getVenueById,
  getVenueByName,
  postVenue,
  deleteVenue,
  putVenue,
  getFinances,
  putFinance,
};
