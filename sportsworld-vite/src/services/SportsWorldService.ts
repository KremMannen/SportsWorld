import axios from "axios";
import type { IAthlete } from "../interfaces/IAthlete";

const athleteEndpoint = "http://localhost:5003/api/athlete";
const venueEndpoint = "http://localhost:5003/api/venue";
const financeEndpoint = "http://localhost:5003/api/finance";

// Fremfor å returnere null / [] i disse funksjonene throwes erroren
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

const getAthleteByName = async (query: string): Promise<IAthlete> => {
  try {
    const result = await axios.get<IAthlete>(
      `${athleteEndpoint}/byname/${query}`
    );
    return result.data;
  } catch (error) {
    console.error("getAthleteByName: Failed to fetch athletes:", error);
    throw error;
  }
};

const postAthlete = async (newAthlete: IAthlete): Promise<IAthlete> => {
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
