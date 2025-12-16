import axios, { type AxiosResponse } from "axios";
import type { IAthlete } from "../interfaces/objects/IAthlete";
import type { IVenue } from "../interfaces/objects/IVenue";
import type { IFinance } from "../interfaces/objects/IFinance";
import type {
  IAthleteResponseList,
  IAthleteResponseSingle,
  IDefaultResponse,
  IFinanceResponseSingle,
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
      return { success: false, data: [], error: validation.error };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("getAthletes: Failed to fetch athletes:", error);
    return {
      success: false,
      data: [],
      error: "Error connecting to database",
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
    // Sjekker om det er Axios som slår feil
    if (axios.isAxiosError(error) && error.response) {
      // 404 må differansieres fra andre errors--dette er et forventet outcome og ikke feil.
      if (error.response.status === 404) {
        console.error("getAthleteById: No athlete found on id", error);
        return {
          success: true,
          data: null,
          error: "No athlete found on id",
        };
      }
    }

    // Andre tekniske feil
    console.error("getAthleteById: Failed to fetch athlete:", error);
    return {
      success: false,
      data: null,
      error: "Error connecting to database",
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
      return { success: false, data: [], error: validation.error };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    // Sjekker om det er Axios som slår feil
    if (axios.isAxiosError(error) && error.response) {
      // 404 må differansieres fra andre errors--dette er et forventet outcome og ikke feil.
      if (error.response.status === 404) {
        return {
          success: true,
          data: [],
          error: "No athlete found by that query",
        };
      }
    }

    // Andre tekniske feil
    console.error("getAthleteById: Failed to fetch athlete:", error);
    return {
      success: false,
      data: [],
      error: "Error connecting to database",
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
): Promise<IAthleteResponseSingle> => {
  try {
    const response = await axios.put(athleteEndpoint, editedAthlete);

    if (response.status !== 200) {
      return { success: false, data: null, error: "Failed to update athlete." };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("putAthlete: Failed to put athlete:", error);
    return {
      success: false,
      data: null,
    };
  }
};

const getVenues = async (): Promise<IVenueResponseList> => {
  try {
    const response = await axios.get<IVenue[]>(venueEndpoint);
    const validation = validateResponseList(response);

    if (!validation.isValid) {
      return { success: false, data: [], error: validation.error };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("getVenues: Failed to fetch venues:", error);
    return {
      success: false,
      data: [],
      error: "Error connecting to database",
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
    if (axios.isAxiosError(error) && error.response) {
      // 404 må differansieres fra andre errors--dette er et forventet outcome og ikke feil.
      if (error.response.status === 404) {
        return {
          success: true,
          data: null,
          error: "No venue found by that id",
        };
      }
    }
    console.error("getVenueById: Failed to fetch venue:", error);
    return {
      success: false,
      data: null,
    };
  }
};
const getVenuesByName = async (query: string): Promise<IVenueResponseList> => {
  try {
    const response = await axios.get<IVenue[]>(
      `${venueEndpoint}/byname/${query}`
    );
    const validation = validateResponseList(response);

    if (!validation.isValid) {
      return { success: false, data: [], error: validation.error };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // 404 må differansieres fra andre errors--dette er et forventet outcome og ikke feil.
      if (error.response.status === 404) {
        return {
          success: true,
          data: [],
          error: "No venue found by that query",
        };
      }
    }

    console.error("getVenueByName: Failed to fetch venues:", error);
    return {
      success: false,
      data: [],
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
const putVenue = async (editedVenue: IVenue): Promise<IVenueResponseSingle> => {
  try {
    const response = await axios.put(venueEndpoint, editedVenue);

    if (response.status !== 200) {
      return { success: false, data: null, error: "Failed to update venue." };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("putVenue: Failed to put venue:", error);
    return {
      success: false,
      data: null,
    };
  }
};
// Her er det bare 1 objekt som returneres i listen,
// men vi vedlikeholder mønsteret til get funksjoner og bruker liste
const getFinances = async (): Promise<IFinanceResponseList> => {
  try {
    const response = await axios.get<IFinance[]>(financeEndpoint);
    const validation = validateResponseList(response);

    if (!validation.isValid) {
      return { success: false, data: [], error: validation.error };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("getFinances: Failed to fetch finances:", error);
    return {
      success: false,
      data: [],
      error: "Error connecting to database",
    };
  }
};
const postFinance = async (
  newFinance: Omit<IFinance, "id">
): Promise<IFinanceResponseSingle> => {
  try {
    const response = await axios.post<IFinance>(financeEndpoint, newFinance);

    if (response.status !== 201) {
      return { success: false, data: null, error: "Failed to create finance." };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("postVenue: Failed to post finance:", error);
    return {
      success: false,
      data: null,
    };
  }
};
const putFinance = async (
  editedFinance: IFinance
): Promise<IFinanceResponseSingle> => {
  try {
    const response = await axios.put(financeEndpoint, editedFinance);
    if (response.status !== 200) {
      return { success: false, data: null, error: "Failed to update finance." };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("putFinance: Failed to put finance:", error);
    return {
      success: false,
      data: null,
    };
  }
};

// Not implemented for Finances:
// Delete -- Not necessary in current scope

// Hjelpefunksjoner for å validere outputtet fra Axios kallene
// Returnerer brukervennlige feilmeldinger til kallende funksjon
const validateResponseList = (
  response: AxiosResponse
): { isValid: boolean; error?: string } => {
  // Sjekk om response status er 200 OK
  // andre statuskoder indikerer feil
  if (response.status !== 200) {
    return { isValid: false, error: "Failed to fetch from server." };
  }

  // Sjekker at dataen eksisterer, og at den er i forventet format (array)

  if (!response.data || !Array.isArray(response.data)) {
    return {
      isValid: false,
      error: "Invalid data format received from server",
    };
  }

  // Sjekker at data-arrayen ikke er tom. setter isValid til true her, da tom array ikke betyr teknisk feil
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

  // Dropper sjekk for isArray: getbyid returnerer uten liste

  // Sjekker at dataen eksisterer
  if (!response.data) {
    return {
      isValid: false,
      error: "No data available in the server.",
    };
  }
  return { isValid: true };
};

export {
  getAthletes,
  getAthleteById,
  getAthletesByName,
  postAthlete,
  deleteAthlete,
  putAthlete,
  getVenues,
  getVenueById,
  getVenuesByName,
  postVenue,
  deleteVenue,
  putVenue,
  getFinances,
  postFinance,
  putFinance,
};
