import { createContext, useEffect, useState } from "react";
import type { IProviderProps } from "../interfaces/IProviderProps";
import {
  deleteVenue,
  getVenueById,
  getVenueByName,
  getVenues,
  postVenue,
  putVenue,
} from "../services/SportsWorldService";
import ImageUploadService from "../services/ImageUploadService";
import type { IVenueContext } from "../interfaces/IVenueContext";
import type { IVenue } from "../interfaces/IVenue";

export const VenueContext = createContext<IVenueContext | null>(null);

export const VenueProvider = ({ children }: IProviderProps) => {
  const [venues, setVenues] = useState<IVenue[]>([]);
  const [searchResults, setSearchResults] = useState<IVenue[]>([]);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const showAll = async () => {
    try {
      const data = await getVenues();
      setVenues(data);
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
      const data = await getVenueById(id);
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
      const data = await getVenueByName(name);
      setSearchResults(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Loading failed, unknown reason"
      );
    }
  };

  const addVenue = async (newVenue: Omit<IVenue, "id">, img: File) => {
    try {
      const response = await ImageUploadService.uploadVenueImage(img);
      const venueWithImage = { ...newVenue, image: response.fileName };
      await postVenue(venueWithImage);
      await showAll();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Add failed, unknown reason"
      );
    }
  };

  const deleteVenueById = async (id: number) => {
    try {
      await deleteVenue(id);
      await showAll();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Delete failed, unknown reason"
      );
    }
  };

  const updateVenue = async (updatedVenue: IVenue) => {
    try {
      await putVenue(updatedVenue);
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
    <VenueContext.Provider
      value={{
        venues,
        searchResults,
        errorMessage,
        showAll,
        searchByID,
        searchByName,
        addVenue,
        deleteVenueById,
        updateVenue,
      }}
    >
      {children}
    </VenueContext.Provider>
  );
};
