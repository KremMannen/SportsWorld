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
  IUploadResponse,
} from "../interfaces/IServiceResponses";

export const AthleteContext = createContext<IAthleteContext | null>(null);

export const AthleteProvider: FC<IProviderProps> = ({ children }) => {
  const [athletes, setAthletes] = useState<IAthlete[]>([]);
  const [searchResults, setSearchResults] = useState<IAthlete[]>([]);

  // isLoading tilbyr en sentralisert variabel å vise loading message fra, så slipper komponentene å ha lokale variabler for det
  const [athleteIsLoading, setAthleteIsLoading] = useState<boolean>(false);

  // Vi vil at context skal initialize uten en component, så for at component skal ha tilgang
  // til errors som oppstår under init bruker vi denne
  const initError = useRef<string | null>(null);
  // Unngår race condition
  const hasInitialized = useRef(false);

  const searchByID = async (id: number): Promise<IAthleteResponseSingle> => {
    setAthleteIsLoading(true);
    setSearchResults([]);

    const response: IAthleteResponseSingle = await getAthleteById(id);
    if (response.success && response.data) {
      setSearchResults([response.data]);
    }
    setAthleteIsLoading(false);
    return response;
  };

  const searchByName = async (name: string): Promise<IAthleteResponseList> => {
    setAthleteIsLoading(true);
    setSearchResults([]);
    const response: IAthleteResponseList = await getAthletesByName(name);
    setSearchResults(response.data);
    setAthleteIsLoading(false);
    return response;
  };

  const addAthlete = async (
    athlete: Omit<IAthlete, "image" | "id">,
    img: File
  ): Promise<IAthleteResponseSingle> => {
    const uploadResponse: IUploadResponse =
      await ImageUploadService.uploadAthleteImage(img);
    if (!uploadResponse.success || uploadResponse.fileName === null) {
      // Konverterer IUploadResponse til IAthleteResponseSingle
      return {
        success: uploadResponse.success,
        error: uploadResponse.error,
        data: null,
      };
    }
    const athleteWithImage: Omit<IAthlete, "id"> = {
      ...athlete,
      image: uploadResponse.fileName,
    };
    const postResponse: IAthleteResponseSingle = await postAthlete(
      athleteWithImage
    );

    if (postResponse.data) {
      // updatedAthlete har ID'en fra backend
      const updatedAthlete: IAthlete = postResponse.data;
      setAthletes((prev) => [...prev, updatedAthlete]);
      return postResponse;
    }
    return postResponse;
  };

  const deleteAthleteById = async (id: number): Promise<IDefaultResponse> => {
    const response: IDefaultResponse = await deleteAthlete(id);
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
      const uploadResponse: IUploadResponse =
        await ImageUploadService.uploadAthleteImage(img);

      if (!uploadResponse.success || uploadResponse.fileName === null) {
        return {
          success: uploadResponse.success,
          error: uploadResponse.error,
          data: null,
        };
      }
      fileName = uploadResponse.fileName;
    }

    const athleteWithImage: IAthlete = { ...athlete, image: fileName };
    const updateResponse: IAthleteResponseSingle = await putAthlete(
      athleteWithImage
    );

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
    // Unngår dobbel kjøring
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    setAthleteIsLoading(true);

    const getResponse: IAthleteResponseList = await getAthletes();

    if (!getResponse.success) {
      initError.current = getResponse.error ?? "Failed to load fighters";
      setAthleteIsLoading(false);
      return;
    }

    if (getResponse.data.length === 0) {
      console.log(`Seeding database with athletes`);
      const seedAthletes: Omit<IAthlete, "id">[] = [
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
        const postResponse: IAthleteResponseSingle = await postAthlete(athlete);
        if (!postResponse.success) {
          initError.current = postResponse.error ?? "Failed to seed fighters";
          setAthleteIsLoading(false);
          return;
        }
        if (postResponse.data && postResponse.success) {
          const updatedAthlete: IAthlete = postResponse.data;
          seededAthletes.push(updatedAthlete);
        }
      }
      setAthletes(seededAthletes);
      setAthleteIsLoading(false);
      return;
    }
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
        initError: initError.current, //  gjør det lettere for callers å aksessere verdien, de må ikke vite at initError er en useRef
        hasInitialized: hasInitialized.current,
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
