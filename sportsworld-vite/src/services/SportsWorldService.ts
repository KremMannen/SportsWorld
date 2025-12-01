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
    const result = await axios.get<IAthlete>(`${athleteEndpoint}/${id}`);
    return result.data;
  } catch (error) {
    console.error("getAthleteById: Failed to fetch athlete:", error);
    throw error;
  }
};
("byname/{name}");

const getAthleteByName = async (query: String): Promise<IAthlete> => {
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

const postAthlete = async (newAthlete: IAthlete) => {
  try {
    const { data } = await axios.post<number>(athleteEndpoint, newAthlete);
    console.log(data);
  } catch (error) {
    console.error("postAthlete: Failed to post Athlete:", error);
    throw error;
  }
};
