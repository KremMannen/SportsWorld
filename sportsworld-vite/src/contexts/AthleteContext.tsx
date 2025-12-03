import { createContext, useEffect, useState, type FC } from "react";
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

export const AthleteProvider: FC<IProviderProps> = ({ children }) => {
  const [athletes, setAthletes] = useState<IAthlete[]>([]);
  const [searchResults, setSearchResults] = useState<IAthlete[]>([]);

  // I funksjoner som laster inn nye athletes kan benytte isLoading for å tilby foreldre-komponenten en måte å sjekke om
  // resultater laster inn, slik at den kan holde brukeren oppdatert via UIX.
  const [isLoading, setIsLoading] = useState(false);

  // eventuell feilbeskjed fra error-propertien i IResponse interfaces
  const [errorMessage, setErrorMessage] = useState<string>("");

  const showAll = async () => {
    setIsLoading(true);
    setErrorMessage("");
    const response = await getAthletes();
    if (response.success && response.data) {
      setAthletes(response.data);
    } else {
      setErrorMessage(response.error ?? "Failed to load athletes");
    }
    setIsLoading(false);
  };

  const searchByID = async (id: number) => {
    setIsLoading(true);
    setErrorMessage("");
    const response = await getAthleteById(id);
    if (response.success && response.data) {
      setSearchResults([response.data]);
    } else {
      setErrorMessage(response.error ?? "Athlete not found");
    }
  };

  const searchByName = async (name: string) => {
    setIsLoading(true);
    setErrorMessage("");

    const response = await getAthletesByName(name);

    if (response.success && response.data) {
      setSearchResults(response.data);
    } else {
      setErrorMessage(response.error ?? "No athletes found");
    }

    setIsLoading(false);
  };

  const addAthlete = async (athlete: Omit<IAthlete, "id">, img: File) => {
    setErrorMessage("");

    const uploadResponse = await ImageUploadService.uploadAthleteImage(img);

    if (!uploadResponse.success) {
      setErrorMessage(uploadResponse.error ?? "Image upload failed");
      return;
    }

    const athleteWithImage = { ...athlete, image: uploadResponse.fileName };
    const postResponse = await postAthlete(athleteWithImage);

    if (!postResponse.success) {
      setErrorMessage(postResponse.error ?? "Failed to add athlete");
      return;
    }

    await showAll();
  };

  const deleteAthleteById = async (id: number) => {
    setErrorMessage("");

    const response = await deleteAthlete(id);

    if (!response.success) {
      setErrorMessage(response.error ?? "Failed to delete athlete");
      return;
    }

    await showAll();
  };

  const updateAthlete = async (athlete: IAthlete) => {
    setErrorMessage("");

    const response = await putAthlete(athlete);

    if (!response.success) {
      setErrorMessage(response.error ?? "Failed to update athlete");
      return;
    }

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
