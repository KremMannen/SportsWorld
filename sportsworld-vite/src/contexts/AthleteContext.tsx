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

  const [errorMessage, setErrorMessage] = useState<string>("");

  const showAll = async () => {
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
    }
  };

  const searchByID = async (id: number) => {
    try {
      const data = await getAthleteById(id);
      setSearchResults([data]);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Loading failed, unknown reason"
      );
    }
  };

  const searchByName = async (name: string) => {
    try {
      const data = await getAthletesByName(name);
      setSearchResults(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Loading failed, unknown reason"
      );
    }
  };

  const addAthlete = async (athlete: Omit<IAthlete, "id">, img: File) => {
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
