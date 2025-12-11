import { createContext, useEffect, useRef, useState, type FC } from "react";
import type { IProviderProps } from "../interfaces/components/IProviderProps";
import {
  deleteVenue,
  getVenueById,
  getVenuesByName,
  getVenues,
  postVenue,
  putVenue,
} from "../services/SportsWorldService";
import ImageUploadService from "../services/ImageUploadService";
import type { IVenueContext } from "../interfaces/contexts/IVenueContext";
import type { IVenue } from "../interfaces/objects/IVenue";

export const VenueContext = createContext<IVenueContext | null>(null);

export const VenueProvider: FC<IProviderProps> = ({ children }) => {
  const [venues, setVenues] = useState<IVenue[]>([]);
  const [searchResults, setSearchResults] = useState<IVenue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const isInitializing = useRef(false);

  const searchByID = async (id: number) => {
    setIsLoading(true);
    setErrorMessage("");
    const response = await getVenueById(id);
    if (response.success && response.data) {
      setSearchResults([response.data]);
    } else {
      setErrorMessage(response.error ?? "Venue not found");
    }
    setIsLoading(false);
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

  const addVenue = async (
    newVenue: Omit<IVenue, "id" | "image">,
    img: File
  ) => {
    setErrorMessage("");

    const uploadResponse = await ImageUploadService.uploadVenueImage(img);

    if (!uploadResponse.success || uploadResponse.fileName === null) {
      setErrorMessage(uploadResponse.error ?? "Image upload failed");
      return;
    }
    const venueWithImage = { ...newVenue, image: uploadResponse.fileName };
    const postResponse = await postVenue(venueWithImage);

    if (!postResponse.success) {
      setErrorMessage(postResponse.error ?? "Failed to add venue");
      return;
    }
    if (postResponse.data) {
      // updatedAthlete har ID'en fra backend
      const updatedVenue: IVenue = postResponse.data;
      setVenues((prev) => [...prev, updatedVenue]);
    }
  };

  const deleteVenueById = async (id: number) => {
    setErrorMessage("");

    const response = await deleteVenue(id);

    if (!response.success) {
      setErrorMessage(response.error ?? "Failed to delete venue");
      return;
    }
    setVenues((prev) => prev.filter((a) => a.id !== id));
  };

  const updateVenue = async (venue: IVenue, img?: File) => {
    setErrorMessage("");
    setIsLoading(true);

    let fileName = venue.image;

    if (img) {
      const uploadResponse = await ImageUploadService.uploadVenueImage(img);
      if (!uploadResponse.success || uploadResponse.fileName === null) {
        setErrorMessage(uploadResponse.error ?? "Image upload failed");
        return;
      }
      fileName = uploadResponse.fileName;
    }

    const venueWithImage = { ...venue, image: fileName };
    const updateResponse = await putVenue(venueWithImage);
    if (!updateResponse.success) {
      setErrorMessage(updateResponse.error ?? "Failed to update venue");
      return;
    }
    if (updateResponse.data) {
      const updatedVenue: IVenue = updateResponse.data;
      setVenues((prev) =>
        prev.map((a) => (a.id === updatedVenue.id ? updatedVenue : a))
      );
    }
    setIsLoading(false);
  };

  const initializeVenues = async () => {
    if (isInitializing.current) return;
    isInitializing.current = true;
    setIsLoading(true);
    setErrorMessage("");

    // Sjekk om det allerede finnes athletes
    const getResponse = await getVenues();

    if (!getResponse.success) {
      setErrorMessage(getResponse.error ?? "Failed to connect to database");
      isInitializing.current = false;
      setIsLoading(false);
      return;
    }

    if (getResponse.data.length === 0) {
      // Bildene er forhåndsplassert i backend
      console.log(`Seeding database with venues`);
      const seedVenues = [
        {
          name: "Madison Square Garden",
          capacity: 20789,
          image: "seed-venue1.jpg",
        },
        {
          name: "T-Mobile Arena",
          capacity: 20000,
          image: "seed-venue2.jpg",
        },
        {
          name: "UFC Apex",
          capacity: 1000,
          image: "seed-venue3.jpg",
        },
        {
          name: "State Farm Arena",
          capacity: 21000,
          image: "seed-venue4.jpg",
        },
        {
          name: "Barclays Center",
          capacity: 19000,
          image: "seed-venue5.jpg",
        },
        {
          name: "Honda Center",
          capacity: 17500,
          image: "seed-venue6.jpg",
        },
        {
          name: "Bridgestone Arena",
          capacity: 17113,
          image: "seed-venue7.jpg",
        },
        {
          name: "Target Center",
          capacity: 19000,
          image: "seed-venue8.jpg",
        },
        {
          name: "TD Garden",
          capacity: 19580,
          image: "seed-venue9.jpg",
        },
        {
          name: "Ball Arena",
          capacity: 19520,
          image: "seed-venue10.jpg",
        },
      ];

      const seededVenues: IVenue[] = [];

      for (const venue of seedVenues) {
        const postResponse = await postVenue(venue);
        if (!postResponse.success) {
          setErrorMessage(postResponse.error ?? "Failed to seed venues");
          isInitializing.current = false;
          setIsLoading(false);
          return;
        }
        if (postResponse.data) {
          const updatedVenue: IVenue = postResponse.data;
          seededVenues.push(updatedVenue);
        }
      }
      setVenues(seededVenues);
      isInitializing.current = false;
      setIsLoading(false);
      return;
    }
    isInitializing.current = false;
    setVenues(getResponse.data);
    setIsLoading(false);
  };

  useEffect(() => {
    initializeVenues();
  }, []);

  return (
    <VenueContext.Provider
      value={{
        venues,
        searchResults,
        errorMessage,
        isLoading,
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
