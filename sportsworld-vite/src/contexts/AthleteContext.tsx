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

  const searchByID = async (id: number) => {
    setAthleteIsLoading(true);
    setAthleteErrorMessage("");

    const response = await getAthleteById(id);
    if (response.success && response.data) {
      setSearchResults([response.data]);
    } else {
      setAthleteErrorMessage(response.error ?? "Athlete not found");
    }
    setAthleteIsLoading(false);
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

  const addAthlete = async (
    athlete: Omit<IAthlete, "image" | "id">,
    img: File
  ) => {
    setAthleteErrorMessage("");

    const uploadResponse = await ImageUploadService.uploadAthleteImage(img);
    if (!uploadResponse.success || uploadResponse.fileName === null) {
      setAthleteErrorMessage(uploadResponse.error ?? "Image upload failed");
      return;
    }
    const athleteWithImage = { ...athlete, image: uploadResponse.fileName };
    const postResponse = await postAthlete(athleteWithImage);
    if (!postResponse.success) {
      setAthleteErrorMessage(postResponse.error ?? "Failed to add athlete");
      return;
    }
    if (postResponse.data) {
      // updatedAthlete har ID'en fra backend
      const updatedAthlete: IAthlete = postResponse.data;
      setAthletes((prev) => [...prev, updatedAthlete]);
    }
  };

  const deleteAthleteById = async (id: number) => {
    setAthleteErrorMessage("");

    const response = await deleteAthlete(id);
    if (!response.success) {
      setAthleteErrorMessage(response.error ?? "Failed to delete athlete");
      return;
    }
    // sparer api kall ved å gjøre dette fremfor getAll
    setAthletes((prev) => prev.filter((a) => a.id !== id));
  };

  const updateAthlete = async (athlete: IAthlete, img?: File) => {
    console.log("updateAthlete called with:", athlete, "img:", img);
    setAthleteErrorMessage("");

    // Beholder gamle bildet om det er ingen img parameter
    let fileName = athlete.image;
    console.log("Initial fileName:", fileName);

    if (img) {
      console.log("Uploading new image...");
      const uploadResponse = await ImageUploadService.uploadAthleteImage(img);
      console.log("Upload response:", uploadResponse);

      if (!uploadResponse.success || uploadResponse.fileName === null) {
        console.error("Image upload failed:", uploadResponse.error);
        setAthleteErrorMessage(uploadResponse.error ?? "Image upload failed");
        return;
      }
      fileName = uploadResponse.fileName;
      console.log("New fileName:", fileName);
    }

    const athleteWithImage = { ...athlete, image: fileName };
    console.log("Calling putAthlete with:", athleteWithImage);

    const updateResponse = await putAthlete(athleteWithImage);
    console.log("putAthlete response:", updateResponse);

    if (!updateResponse.success) {
      console.error("Update failed:", updateResponse.error);
      setAthleteErrorMessage(
        updateResponse.error ?? "Failed to update athlete"
      );
      return;
    }

    if (updateResponse.data) {
      const updatedAthlete: IAthlete = updateResponse.data;
      console.log("Update successful, new athlete:", updatedAthlete);
      setAthletes((prev) => {
        const updated = prev.map((a) =>
          a.id === updatedAthlete.id ? updatedAthlete : a
        );
        console.log("Updated athletes array:", updated);
        return updated;
      });
    } else {
      console.warn("updateResponse.success was true but no data returned");
    }
  };

  // Seeding av databasen ved førstegangsoppstart
  const initializeAthletes = async () => {
    if (isInitializing.current) return;
    isInitializing.current = true;
    setAthleteIsLoading(true);
    setAthleteErrorMessage("");

    const getResponse = await getAthletes();

    if (!getResponse.success) {
      setAthleteErrorMessage(
        getResponse.error ?? "Failed to connect to database"
      );
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
          setAthleteErrorMessage(
            postResponse.error ?? "Failed to seed athletes"
          );
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
        athleteErrorMessage,
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
