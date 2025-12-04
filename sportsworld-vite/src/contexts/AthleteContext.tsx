import { createContext, useEffect, useRef, useState, type FC } from "react";
import type { IProviderProps } from "../interfaces/properties/IProviderProps";
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

  // Denne forhindrer "race conditions" under initialisering. Foruten blir initializeAthletes kalt to ganger.
  // Vi bruker useRef, fordi den ikke skal trigge re-render, og vi trenger at den oppdateres med en gang.
  const isInitializing = useRef(false);

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

  // Seeding av databasen skal vel egentlig gjøres i backend, men for å holde prosjektet innenfor rammene av pensum gjør vi det her.
  const initializeAthletes = async () => {
    if (isInitializing.current) {
      return;
    }
    isInitializing.current = true;

    setIsLoading(true);
    // Sjekk om det allerede finnes athletes
    const existingAthletes = await getAthletes();

    if (!existingAthletes.success) {
      setErrorMessage(
        existingAthletes.error ?? "Failed to connect to database"
      );
      isInitializing.current = false;
      setIsLoading(false);
      return;
    }

    if (existingAthletes.data.length === 0) {
      // Bildene er forhåndsplassert i backend
      const seedAthletes = [
        {
          name: "Jon Jones",
          price: 5000,
          gender: "Male",
          image: "seed-fighter1.jpg",
          purchased: false,
        },
        {
          name: "Conor McGregor",
          price: 120,
          gender: "Male",
          image: "seed-fighter2.jpg",
          purchased: false,
        },
        {
          name: "Anderson Silva",
          price: 130,
          gender: "Male",
          image: "seed-fighter3.jpg",
          purchased: false,
        },
        {
          name: "Khabib Nurmagomedov",
          price: 160,
          gender: "Male",
          image: "seed-fighter4.jpg",
          purchased: false,
        },
        {
          name: "Ronda Rousey",
          price: 110,
          gender: "Female",
          image: "seed-fighter5.jpg",
          purchased: false,
        },
        {
          name: "Amanda Nunes",
          price: 140,
          gender: "Female",
          image: "seed-fighter6.jpg",
          purchased: false,
        },
        {
          name: "Georges St-Pierre",
          price: 155,
          gender: "Male",
          image: "seed-fighter7.jpg",
          purchased: false,
        },
        {
          name: "Israel Adesanya",
          price: 125,
          gender: "Male",
          image: "seed-fighter8.jpg",
          purchased: false,
        },
        {
          name: "Valentina Shevchenko",
          price: 135,
          gender: "Female",
          image: "seed-fighter9.jpg",
          purchased: false,
        },
        {
          name: "Stipe Miocic",
          price: 115,
          gender: "Male",
          image: "seed-fighter10.jpg",
          purchased: false,
        },
      ];
      for (const athlete of seedAthletes) {
        const result = await postAthlete(athlete);
        if (!result.success) {
          setErrorMessage(result.error ?? "Failed to seed athletes");
          isInitializing.current = false;
          setIsLoading(false);
          return;
        }
      }
    } else {
      console.log(
        `Database already has ${existingAthletes.data.length} athletes, skipping seeding`
      );
    }
    await showAll();
  };

  useEffect(() => {
    initializeAthletes();
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
