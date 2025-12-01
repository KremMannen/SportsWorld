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
    const data = await getAthletes();
    setAthletes(data);
    setSearchResults([]);
  };

  const searchByID = async (id: number) => {
    const data = await getAthleteById(id);
    setSearchResults([data]);
  };

  const searchByName = async (name: string) => {
    const data = await getAthletesByName(name);
    setSearchResults(data);
  };

  const addAthlete = async (athlete: Omit<IAthlete, "id">, img: File) => {
    try {
      const response = await ImageUploadService.uploadAthleteImage(img);
      if (!response) {
        setErrorMessage("addAthlete: Image upload failed!");
        return;
      }
      const athleteWithImage = { ...athlete, image: response.fileName };
      await postAthlete(athleteWithImage);
      await showAll();
    } catch (error) {
      console.error("addAthlete: Athlete upload failed:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Upload failed, unknown reason"
      );
    }
  };

  const deleteAthleteById = async (id: number) => {
    await deleteAthlete(id);
    await showAll();
  };

  const updateAthlete = async (athlete: IAthlete) => {
    await putAthlete(athlete);
    await showAll();
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
