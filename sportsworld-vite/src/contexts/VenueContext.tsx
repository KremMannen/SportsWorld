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

  const initializeVenues = async () => {
    if (isInitializing.current) {
      return;
    }
    isInitializing.current = true;
    setIsLoading(true);

    // Sjekk om det allerede finnes athletes
    const existingVenues = await getVenues();

    if (!existingVenues.success) {
      setErrorMessage(existingVenues.error ?? "Failed to connect to database");
      isInitializing.current = false;
      setIsLoading(false);
      return;
    }

    if (existingVenues.data.length === 0) {
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
      for (const venue of seedVenues) {
        const result = await postVenue(venue);
        if (!result.success) {
          setErrorMessage(result.error ?? "Failed to seed venues");
          isInitializing.current = false;
          setIsLoading(false);
          return;
        }
      }
    } else {
      console.log(
        `Database already has ${existingVenues.data.length} venues, skipping seeding`
      );
    }
    await showAll();
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
