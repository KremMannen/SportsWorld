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
import type {
  IDefaultResponse,
  IUploadResponse,
  IVenueResponseList,
  IVenueResponseSingle,
} from "../interfaces/IServiceResponses";

export const VenueContext = createContext<IVenueContext | null>(null);

export const VenueProvider: FC<IProviderProps> = ({ children }) => {
  const [venues, setVenues] = useState<IVenue[]>([]);
  const [searchResults, setSearchResults] = useState<IVenue[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const initError = useRef<string | null>(null);
  const hasInitialized = useRef(false);

  const searchByID = async (id: number): Promise<IVenueResponseSingle> => {
    setIsLoading(true);

    const response: IVenueResponseSingle = await getVenueById(id);
    if (response.success && response.data) {
      setSearchResults([response.data]);
    }
    setIsLoading(false);
    return response;
  };

  const searchByName = async (name: string): Promise<IVenueResponseList> => {
    setIsLoading(true);

    const response: IVenueResponseList = await getVenuesByName(name);

    if (response.success && response.data) {
      setSearchResults(response.data);
    }
    setIsLoading(false);
    return response;
  };

  const addVenue = async (
    newVenue: Omit<IVenue, "id" | "image">,
    img: File
  ): Promise<IVenueResponseSingle> => {
    const uploadResponse: IUploadResponse =
      await ImageUploadService.uploadVenueImage(img);

    if (!uploadResponse.success || uploadResponse.fileName === null) {
      return {
        success: uploadResponse.success,
        error: uploadResponse.error,
        data: null,
      };
    }
    const venueWithImage: Omit<IVenue, "id"> = {
      ...newVenue,
      image: uploadResponse.fileName,
    };
    const postResponse: IVenueResponseSingle = await postVenue(venueWithImage);

    if (postResponse.data) {
      // updatedAthlete har ID'en fra backend
      const updatedVenue: IVenue = postResponse.data;
      setVenues((prev) => [...prev, updatedVenue]);
    }
    return postResponse;
  };

  const deleteVenueById = async (id: number): Promise<IDefaultResponse> => {
    const response: IDefaultResponse = await deleteVenue(id);
    if (!response.success) {
      return response;
    }
    if (response.success) {
      setVenues((prev) => prev.filter((a) => a.id !== id));
      setSearchResults((prev) => prev.filter((a) => a.id !== id));
    }
    return response;
  };

  const updateVenue = async (
    venue: IVenue,
    img?: File
  ): Promise<IVenueResponseSingle> => {
    setIsLoading(true);

    let fileName: string = venue.image;

    if (img) {
      const uploadResponse: IUploadResponse =
        await ImageUploadService.uploadVenueImage(img);
      if (!uploadResponse.success || uploadResponse.fileName === null) {
        return {
          success: uploadResponse.success,
          error: uploadResponse.error,
          data: null,
        };
      }
      fileName = uploadResponse.fileName;
    }

    const venueWithImage: IVenue = { ...venue, image: fileName };
    const updateResponse: IVenueResponseSingle = await putVenue(venueWithImage);

    if (updateResponse.data) {
      const updatedVenue: IVenue = updateResponse.data;
      setVenues((prev) =>
        prev.map((a) => (a.id === updatedVenue.id ? updatedVenue : a))
      );
    }
    setIsLoading(false);
    return updateResponse;
  };

  const initializeVenues = async () => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    setIsLoading(true);

    // Sjekk om det allerede finnes athletes
    const getResponse: IVenueResponseList = await getVenues();

    if (!getResponse.success) {
      initError.current = getResponse.error ?? "Failed to load venues";
      setIsLoading(false);
      return;
    }

    if (getResponse.data.length === 0) {
      // Bildene er forhåndsplassert i backend
      console.log(`Seeding database with venues`);
      const seedVenues: Omit<IVenue, "id">[] = [
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
        const postResponse: IVenueResponseSingle = await postVenue(venue);
        if (!postResponse.success) {
          initError.current = postResponse.error ?? "Failed to seed venues";
          setIsLoading(false);
          return;
        }
        if (postResponse.data) {
          const updatedVenue: IVenue = postResponse.data;
          seededVenues.push(updatedVenue);
        }
      }
      setVenues(seededVenues);
      setIsLoading(false);
      return;
    }
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
        isLoading,
        initError: initError.current,
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
