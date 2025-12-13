import { createContext, useEffect, useRef, useState, type FC } from "react";
import type { IProviderProps } from "../interfaces/components/IProviderProps";
import type { IAthlete } from "../interfaces/objects/IAthlete";
import type { IAthleteContext } from "../interfaces/contexts/IAthleteContext";
import {
  deleteAthlete,
  getAthleteById,
  getAthletes,
  getAthletesByName,
  postAthlete,
  putAthlete,
} from "../services/SportsWorldService";
import ImageUploadService from "../services/ImageUploadService";
import type {
  IAthleteResponseList,
  IAthleteResponseSingle,
  IDefaultResponse,
} from "../interfaces/IServiceResponses";

export const AthleteContext = createContext<IAthleteContext | null>(null);

export const AthleteProvider: FC<IProviderProps> = ({ children }) => {
  const [athletes, setAthletes] = useState<IAthlete[]>([]);
  const [searchResults, setSearchResults] = useState<IAthlete[]>([]);

  // isLoading tilbyr en sentralisert variabel å vise loading message fra, så slipper komponentene å ha lokale variabler for det
  const [athleteIsLoading, setAthleteIsLoading] = useState<boolean>(false);

  // Denne forhindrer "race conditions" under initialisering. Foruten blir initializeAthletes kalt to ganger.
  // Vi bruker useRef fordi den ikke skal trigge re-render, og vi trenger at den oppdateres med en gang.
  const isInitializing = useRef(false);

  const searchByID = async (id: number): Promise<IAthleteResponseSingle> => {
    setAthleteIsLoading(true);

    const response = await getAthleteById(id);
    if (response.success && response.data) {
      setSearchResults([response.data]);
      setAthleteIsLoading(false);
      return response;
    }
    setAthleteIsLoading(false);
    return response;
  };

  const searchByName = async (name: string): Promise<IAthleteResponseList> => {
    setAthleteIsLoading(true);
    const response = await getAthletesByName(name);
    if (response.success && response.data) {
      setSearchResults(response.data);
    }

    setAthleteIsLoading(false);
    return response;
  };

  const addAthlete = async (
    athlete: Omit<IAthlete, "image" | "id">,
    img: File
  ): Promise<IAthleteResponseSingle> => {
    const uploadResponse = await ImageUploadService.uploadAthleteImage(img);
    if (!uploadResponse.success || uploadResponse.fileName === null) {
      // Konverterer IUploadResponse til IAthleteResponseSingle
      return {
        success: uploadResponse.success,
        error: uploadResponse.error,
        data: null,
      };
    }
    const athleteWithImage = { ...athlete, image: uploadResponse.fileName };
    const postResponse = await postAthlete(athleteWithImage);

    if (postResponse.data) {
      // updatedAthlete har ID'en fra backend
      const updatedAthlete: IAthlete = postResponse.data;
      setAthletes((prev) => [...prev, updatedAthlete]);
      return postResponse;
    }
    return postResponse;
  };

  const deleteAthleteById = async (id: number): Promise<IDefaultResponse> => {
    const response = await deleteAthlete(id);
    if (!response.success) {
      return response;
    }
    // sparer api kall ved å gjøre dette fremfor getAll
    setAthletes((prev) => prev.filter((a) => a.id !== id));
    return response;
  };

  const updateAthlete = async (
    athlete: IAthlete,
    img?: File
  ): Promise<IAthleteResponseSingle> => {
    // Beholder gamle bildet om det er ingen img parameter
    let fileName = athlete.image;

    if (img) {
      const uploadResponse = await ImageUploadService.uploadAthleteImage(img);

      if (!uploadResponse.success || uploadResponse.fileName === null) {
        return {
          success: uploadResponse.success,
          error: uploadResponse.error,
          data: null,
        };
      }
      fileName = uploadResponse.fileName;
    }

    const athleteWithImage = { ...athlete, image: fileName };
    const updateResponse = await putAthlete(athleteWithImage);

    if (updateResponse.data) {
      const updatedAthlete: IAthlete = updateResponse.data;
      setAthletes((prev) =>
        prev.map((a) => (a.id === updatedAthlete.id ? updatedAthlete : a))
      );
    }
    return updateResponse;
  };

  // Seeding av databasen ved førstegangsoppstart
  const initializeAthletes = async () => {
    if (isInitializing.current) return;
    isInitializing.current = true;
    setAthleteIsLoading(true);

    const getResponse = await getAthletes();

    if (!getResponse.success) {
      isInitializing.current = false;
      setAthleteIsLoading(false);
      return;
    }

    if (getResponse.data.length === 0) {
      console.log(`Seeding database with athletes`);
      const seedAthletes = [
        {
          name: "Jon Jones",
          price: 100000,
          gender: "Male",
          image: "seed-fighter1.jpg",
          purchased: false,
        },
        {
          name: "Conor McGregor",
          price: 120000,
          gender: "Male",
          image: "seed-fighter2.jpg",
          purchased: false,
        },
        {
          name: "Anderson Silva",
          price: 74000,
          gender: "Male",
          image: "seed-fighter3.jpg",
          purchased: false,
        },
        {
          name: "Khabib Nurmagomedov",
          price: 160000,
          gender: "Male",
          image: "seed-fighter4.jpg",
          purchased: false,
        },
        {
          name: "Ronda Rousey",
          price: 50000,
          gender: "Female",
          image: "seed-fighter5.jpg",
          purchased: false,
        },
        {
          name: "Amanda Nunes",
          price: 14000,
          gender: "Female",
          image: "seed-fighter6.jpg",
          purchased: false,
        },
        {
          name: "Georges St-Pierre",
          price: 15500,
          gender: "Male",
          image: "seed-fighter7.jpg",
          purchased: false,
        },
        {
          name: "Israel Adesanya",
          price: 125000,
          gender: "Male",
          image: "seed-fighter8.jpg",
          purchased: false,
        },
        {
          name: "Valentina Shevchenko",
          price: 13500,
          gender: "Female",
          image: "seed-fighter9.jpg",
          purchased: false,
        },
        {
          name: "Stipe Miocic",
          price: 11500,
          gender: "Male",
          image: "seed-fighter10.jpg",
          purchased: false,
        },
      ];

      const seededAthletes: IAthlete[] = [];

      for (const athlete of seedAthletes) {
        const postResponse = await postAthlete(athlete);
        if (!postResponse.success) {
          setAthleteIsLoading(false);
          isInitializing.current = false;
          return;
        }
        if (postResponse.data) {
          const updatedAthlete: IAthlete = postResponse.data;
          seededAthletes.push(updatedAthlete);
        }
      }
      setAthletes(seededAthletes);
      isInitializing.current = false;
      setAthleteIsLoading(false);
      return;
    }
    isInitializing.current = false;
    setAthletes(getResponse.data);
    setAthleteIsLoading(false);
  };

  useEffect(() => {
    initializeAthletes();
  }, []);

  return (
    <AthleteContext.Provider
      value={{
        athletes,
        searchResults,
        athleteIsLoading,
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
