import { createContext, useEffect, useState, type FC } from "react";
import type { IProviderProps } from "../interfaces/properties/IProviderProps";
import {
  deleteVenue,
  getVenueById,
  getVenuesByName,
  getVenues,
  postVenue,
  putVenue,
} from "../services/SportsWorldService";
import ImageUploadService from "../services/ImageUploadService";
import type { IVenueContext } from "../interfaces/IVenueContext";
import type { IVenue } from "../interfaces/IVenue";

export const VenueContext = createContext<IVenueContext | null>(null);

export const VenueProvider: FC<IProviderProps> = ({ children }) => {
  const [venues, setVenues] = useState<IVenue[]>([]);
  const [searchResults, setSearchResults] = useState<IVenue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const showAll = async () => {
    setIsLoading(true);
    setErrorMessage("");
    const response = await getVenues();

    if (response.success && response.data) {
      setVenues(response.data);
    } else {
      setErrorMessage(response.error ?? "Failed to load venues");
    }
    setIsLoading(false);
  };

  const searchByID = async (id: number) => {
    setIsLoading(true);
    setErrorMessage("");
    const response = await getVenueById(id);
    if (response.success && response.data) {
      setSearchResults([response.data]);
    } else {
      setErrorMessage(response.error ?? "Venue not found");
    }
  };

  const searchByName = async (name: string) => {
    setIsLoading(true);
    setErrorMessage("");

    const response = await getVenuesByName(name);

    if (response.success && response.data) {
      setSearchResults(response.data);
    } else {
      setErrorMessage(response.error ?? "No venues found");
    }

    setIsLoading(false);
  };

  const addVenue = async (newVenue: Omit<IVenue, "id">, img: File) => {
    setErrorMessage("");

    const uploadResponse = await ImageUploadService.uploadVenueImage(img);

    if (!uploadResponse.success) {
      setErrorMessage(uploadResponse.error ?? "Image upload failed");
      return;
    }

    const venueWithImage = { ...newVenue, image: uploadResponse.fileName };
    const postResponse = await postVenue(venueWithImage);

    if (!postResponse.success) {
      setErrorMessage(postResponse.error ?? "Failed to add athlete");
      return;
    }
    await showAll();
  };

  const deleteVenueById = async (id: number) => {
    setErrorMessage("");

    const response = await deleteVenue(id);

    if (!response.success) {
      setErrorMessage(response.error ?? "Failed to delete venue");
      return;
    }

    await showAll();
  };

  const updateVenue = async (updatedVenue: IVenue) => {
    setErrorMessage("");

    const response = await putVenue(updatedVenue);

    if (!response.success) {
      setErrorMessage(response.error ?? "Failed to update venue");
      return;
    }

    await showAll();
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
        isLoading,
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
