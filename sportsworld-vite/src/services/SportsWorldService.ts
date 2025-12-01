import axios from "axios";
import type { IAthlete } from "../interfaces/IAthlete";
import type { IVenue } from "../interfaces/IVenue";
import type { IFinance } from "../interfaces/IFinance";

const athleteEndpoint = "http://localhost:5003/api/athlete";
const venueEndpoint = "http://localhost:5003/api/venue";
const financeEndpoint = "http://localhost:5003/api/finance";

// Fremfor å returnere null / [] i catchen til disse funksjonene throwes erroren
// Dette for å kunne bruke de til å gi brukeren feedback på UI nivå

const getAthletes = async (): Promise<IAthlete[]> => {
  try {
    const { data } = await axios.get<IAthlete[]>(athleteEndpoint);
    return data;
  } catch (error) {
    console.error("getAthletes: Failed to fetch athletes:", error);
    throw error;
  }
};
const getAthleteById = async (id: number): Promise<IAthlete> => {
  try {
    const { data } = await axios.get<IAthlete>(`${athleteEndpoint}/${id}`);
    return data;
  } catch (error) {
    console.error("getAthleteById: Failed to fetch athlete:", error);
    throw error;
  }
};
const getAthletesByName = async (query: string): Promise<IAthlete[]> => {
  try {
    const result = await axios.get<IAthlete[]>(
      `${athleteEndpoint}/byname/${query}`
    );
    return result.data;
  } catch (error) {
    console.error("getAthleteByName: Failed to fetch athletes:", error);
    throw error;
  }
};
const postAthlete = async (
  newAthlete: Omit<IAthlete, "id">
): Promise<IAthlete> => {
  try {
    const { data } = await axios.post<IAthlete>(athleteEndpoint, newAthlete);
    return data;
  } catch (error) {
    console.error("postAthlete: Failed to post athlete:", error);
    throw error;
  }
};
const deleteAthlete = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${athleteEndpoint}/${id}`);
  } catch (error) {
    console.error("deleteAthlete: Failed to delete athlete:", error);
    throw error;
  }
};
const putAthlete = async (editedAthlete: IAthlete): Promise<void> => {
  try {
    await axios.put(athleteEndpoint, editedAthlete);
  } catch (error) {
    console.error("putAthlete: Failed to put athlete:", error);
    throw error;
  }
};
const getVenues = async (): Promise<IVenue[]> => {
  try {
    const { data } = await axios.get<IVenue[]>(venueEndpoint);
    return data;
  } catch (error) {
    console.error("getVenues: Failed to fetch venues:", error);
    throw error;
  }
};
const getVenueById = async (id: number): Promise<IVenue> => {
  try {
    const { data } = await axios.get<IVenue>(`${venueEndpoint}/${id}`);
    return data;
  } catch (error) {
    console.error("getVenueById: Failed to fetch venue:", error);
    throw error;
  }
};
const getVenueByName = async (query: string): Promise<IVenue[]> => {
  try {
    const result = await axios.get<IVenue[]>(
      `${venueEndpoint}/byname/${query}`
    );
    return result.data;
  } catch (error) {
    console.error("getVenueByName: Failed to fetch venues:", error);
    throw error;
  }
};
const postVenue = async (newVenue: IVenue): Promise<IVenue> => {
  try {
    const { data } = await axios.post<IVenue>(venueEndpoint, newVenue);
    return data;
  } catch (error) {
    console.error("postVenue: Failed to post venue:", error);
    throw error;
  }
};
const deleteVenue = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${venueEndpoint}/${id}`);
  } catch (error) {
    console.error("deleteVenue: Failed to delete venue:", error);
    throw error;
  }
};
const putVenue = async (editedVenue: IVenue): Promise<void> => {
  try {
    await axios.put(venueEndpoint, editedVenue);
  } catch (error) {
    console.error("putVenue: Failed to put venue:", error);
    throw error;
  }
};
// Her er det bare 1 objekt som returneres,
// men vi vedlikeholder mønsteret til get funksjoner og returnerer liste
const getFinances = async (): Promise<IFinance[]> => {
  try {
    const { data } = await axios.get<IFinance[]>(financeEndpoint);
    return data;
  } catch (error) {
    console.error("getFinances: Failed to fetch finances:", error);
    throw error;
  }
};
const putFinance = async (editedFinance: IFinance): Promise<void> => {
  try {
    await axios.put(financeEndpoint, editedFinance);
  } catch (error) {
    console.error("putFinance: Failed to put finance:", error);
    throw error;
  }
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
