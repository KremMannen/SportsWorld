import { createContext, useEffect, useState } from "react";
import type { IProviderProps } from "../interfaces/IProviderProps";
import type { IAthlete } from "../interfaces/IAthlete";
import type { IAthleteContext } from "../interfaces/IAthleteContext";
import {
  deleteAthlete,
  getAthleteById,
  getAthletes,
  getAthletesByName,
  postAthlete,
  putAthlete,
} from "../services/SportsWorldService";
import ImageUploadService from "../services/ImageUploadService";

export const AthleteContext = createContext<IAthleteContext | null>(null);

export const AthleteProvider = ({ children }: IProviderProps) => {
  const [athletes, setAthletes] = useState<IAthlete[]>([]);
  const [searchResults, setSearchResults] = useState<IAthlete[]>([]);

  // I funksjoner som laster inn nye athletes benyttes isLoading for å tilby foreldre-komponenten en måte å sjekke om
  // resultater laster inn, slik at den kan holde brukeren oppdatert via UIX.
  const [isLoading, setIsLoading] = useState(false);

  // vi thrower errors fra service-nivå hit, slik at vi kan tilby informasjonen til brukeren i errorMessage variablen
  // foreldre-komponent kan sjekke om errorMessage er tom, og hvis ikke: skrive ut feilbeskjeden til brukeren.
  const [errorMessage, setErrorMessage] = useState<string>("");

  const showAll = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const data = await getAthletes();
      setAthletes(data);
      setSearchResults([]);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Loading failed, unknown reason"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const searchByID = async (id: number) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const data = await getAthleteById(id);
      setSearchResults([data]);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Search failed, unknown reason"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const searchByName = async (name: string) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const data = await getAthletesByName(name);
      setSearchResults(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Search failed, unknown reason"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const addAthlete = async (athlete: Omit<IAthlete, "id">, img: File) => {
    setErrorMessage("");
    try {
      const response = await ImageUploadService.uploadAthleteImage(img);
      const athleteWithImage = { ...athlete, image: response.fileName };
      await postAthlete(athleteWithImage);
      await showAll();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Add failed, unknown reason"
      );
    }
  };

  const deleteAthleteById = async (id: number) => {
    setErrorMessage("");
    try {
      await deleteAthlete(id);
      await showAll();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Delete failed, unknown reason"
      );
    }
  };

  const updateAthlete = async (athlete: IAthlete) => {
    setErrorMessage("");
    try {
      await putAthlete(athlete);
      await showAll();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Update failed, unknown reason"
      );
    }
  };

  useEffect(() => {
    showAll();
  }, []);

  return (
    <AthleteContext.Provider
      value={{
        athletes,
        searchResults,
        isLoading,
        errorMessage,
        showAll,
        searchByID,
        searchByName,
        addAthlete,
        deleteAthleteById,
        updateAthlete,
      }}
    >
      {children}
    </AthleteContext.Provider>
  );
};
