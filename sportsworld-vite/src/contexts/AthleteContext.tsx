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
    try {
      const response = await getAthletes();
      if (response.success && response.data) {
        setAthletes(response.data);
      } else {
        setAthleteErrorMessage(response.error ?? "Failed to load athletes");
      }
    } catch (err) {
      setAthleteErrorMessage("Unexpected error fetching athletes");
    } finally {
      setAthleteIsLoading(false);
    }
  };

  const searchByID = async (id: number) => {
    setAthleteIsLoading(true);
    setAthleteErrorMessage("");
    try {
      const response = await getAthleteById(id);
      if (response.success && response.data) {
        setSearchResults([response.data]);
      } else {
        setAthleteErrorMessage(response.error ?? "Athlete not found");
      }
    } catch (err) {
      setAthleteErrorMessage("Unexpected error searching athlete by ID");
    } finally {
      setAthleteIsLoading(false);
    }
  };

  const searchByName = async (name: string) => {
    setAthleteIsLoading(true);
    setAthleteErrorMessage("");
    try {
      const response = await getAthletesByName(name);
      if (response.success && response.data) {
        setSearchResults(response.data);
      } else {
        setAthleteErrorMessage(response.error ?? "No athletes found");
      }
    } catch (err) {
      setAthleteErrorMessage("Unexpected error searching athletes by name");
    } finally {
      setAthleteIsLoading(false);
    }
  };

  const addAthlete = async (athlete: Omit<IAthlete, "id">, img: File) => {
    setAthleteErrorMessage("");
    try {
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
    } catch (err) {
      setAthleteErrorMessage("Unexpected error adding athlete");
    }
  };

  const deleteAthleteById = async (id: number) => {
    setAthleteErrorMessage("");
    try {
      const response = await deleteAthlete(id);
      if (!response.success) {
        setAthleteErrorMessage(response.error ?? "Failed to delete athlete");
        return;
      }

      await showAll();
    } catch (err) {
      setAthleteErrorMessage("Unexpected error deleting athlete");
    }
  };

  // Skriver denne slik at man kan enkelt bruke den med og uten bildeoppdatering
  const updateAthlete = async (athlete: IAthlete, img?: File) => {
    setAthleteErrorMessage("");
    setAthleteIsLoading(true);

    let fileName = athlete.image;

    if (img) {
      try {
        const uploadResponse = await ImageUploadService.uploadAthleteImage(img);
        if (!uploadResponse.success) {
          setAthleteErrorMessage(uploadResponse.error ?? "Image upload failed");
          return;
        }
        fileName = uploadResponse.fileName;
      } catch {
        setAthleteErrorMessage("Unexpected error updating athlete");
        return;
      }
    }

    const athleteWithImage = { ...athlete, image: fileName };

    try {
      const response = await putAthlete(athleteWithImage);
      if (!response.success) {
        setAthleteErrorMessage(response.error ?? "Failed to update athlete");
        return;
      }
      await showAll();
    } catch {
      setAthleteErrorMessage("Unexpected error updating athlete");
    }
  };

  // Seeding av databasen skal vel egentlig gjøres i backend, men for å holde prosjektet innenfor rammene av pensum gjør vi det her.
  const initializeAthletes = async () => {
    if (isInitializing.current) return;
    isInitializing.current = true;
    setAthleteIsLoading(true);
    setAthleteErrorMessage("");

    try {
      const existingAthletes = await getAthletes();
      if (!existingAthletes.success) {
        setAthleteErrorMessage(
          existingAthletes.error ?? "Failed to connect to database"
        );
        return;
      }

      if (existingAthletes.data.length === 0) {
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

        for (const athlete of seedAthletes) {
          try {
            const result = await postAthlete(athlete);
            if (!result.success) {
              setAthleteErrorMessage(result.error ?? "Failed to seed athletes");
              return;
            }
          } catch (err) {
            setAthleteErrorMessage("Unexpected error seeding athletes");
            return;
          }
        }
      } else {
        console.log(
          `Database already has ${existingAthletes.data.length} athletes, skipping seeding`
        );
      }

      await showAll();
    } catch (err) {
      setAthleteErrorMessage("Unexpected error initializing athletes");
    } finally {
      isInitializing.current = false;
      setAthleteIsLoading(false);
    }
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
