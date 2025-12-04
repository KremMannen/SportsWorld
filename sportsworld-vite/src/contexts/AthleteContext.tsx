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
  const [athleteIsLoading, setAthleteIsLoading] = useState(false);

  // eventuell feilbeskjed fra error-propertien i IResponse interfaces
  const [athleteErrorMessage, setAthleteErrorMessage] = useState<string>("");

  // Denne forhindrer "race conditions" under initialisering. Foruten blir initializeAthletes kalt to ganger.
  // Vi bruker useRef fordi den ikke skal trigge re-render, og vi trenger at den oppdateres med en gang.
  const isInitializing = useRef(false);

  const showAll = async () => {
    setAthleteIsLoading(true);
    setAthleteErrorMessage("");
    const response = await getAthletes();
    if (response.success && response.data) {
      setAthletes(response.data);
    } else {
      setAthleteErrorMessage(response.error ?? "Failed to load athletes");
    }
    setAthleteIsLoading(false);
  };

  const searchByID = async (id: number) => {
    setAthleteIsLoading(true);
    setAthleteErrorMessage("");
    const response = await getAthleteById(id);
    if (response.success && response.data) {
      setSearchResults([response.data]);
    } else {
      setAthleteErrorMessage(response.error ?? "Athlete not found");
    }
  };

  const searchByName = async (name: string) => {
    setAthleteIsLoading(true);
    setAthleteErrorMessage("");

    const response = await getAthletesByName(name);

    if (response.success && response.data) {
      setSearchResults(response.data);
    } else {
      setAthleteErrorMessage(response.error ?? "No athletes found");
    }

    setAthleteIsLoading(false);
  };

  const addAthlete = async (athlete: Omit<IAthlete, "id">, img: File) => {
    setAthleteErrorMessage("");

    const uploadResponse = await ImageUploadService.uploadAthleteImage(img);

    if (!uploadResponse.success) {
      setAthleteErrorMessage(uploadResponse.error ?? "Image upload failed");
      return;
    }

    const athleteWithImage = { ...athlete, image: uploadResponse.fileName };
    const postResponse = await postAthlete(athleteWithImage);

    if (!postResponse.success) {
      setAthleteErrorMessage(postResponse.error ?? "Failed to add athlete");
      return;
    }

    await showAll();
  };

  const deleteAthleteById = async (id: number) => {
    setAthleteErrorMessage("");

    const response = await deleteAthlete(id);

    if (!response.success) {
      setAthleteErrorMessage(response.error ?? "Failed to delete athlete");
      return;
    }

    await showAll();
  };

  const updateAthlete = async (athlete: IAthlete) => {
    setAthleteErrorMessage("");

    const response = await putAthlete(athlete);

    if (!response.success) {
      setAthleteErrorMessage(response.error ?? "Failed to update athlete");
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
    setAthleteIsLoading(true);

    // Sjekk om det allerede finnes athletes
    const existingAthletes = await getAthletes();

    if (!existingAthletes.success) {
      setAthleteErrorMessage(
        existingAthletes.error ?? "Failed to connect to database"
      );
      isInitializing.current = false;
      setAthleteIsLoading(false);
      return;
    }

    if (existingAthletes.data.length === 0) {
      // Bildene er forhåndsplassert i backend
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
          price: 12500,
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
      for (const athlete of seedAthletes) {
        const result = await postAthlete(athlete);
        if (!result.success) {
          setAthleteErrorMessage(result.error ?? "Failed to seed athletes");
          isInitializing.current = false;
          setAthleteIsLoading(false);
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
        athleteIsLoading,
        athleteErrorMessage,
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
