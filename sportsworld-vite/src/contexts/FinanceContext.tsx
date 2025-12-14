import { createContext, useEffect, useRef, useState, type FC } from "react";
import type { IProviderProps } from "../interfaces/components/IProviderProps";
import {
  getFinances,
  putFinance,
  postFinance,
} from "../services/SportsWorldService";
import type { IFinanceContext } from "../interfaces/contexts/IFinanceContext";
import type { IFinance } from "../interfaces/objects/IFinance";
import type {
  IFinanceResponseList,
  IFinanceResponseSingle,
} from "../interfaces/IServiceResponses";

// Vi bruker denne for å slippe å sette | null i finances useState
// Fungerer som standardverdier som vises mens innhold laster
const defaultFinance: IFinance = {
  id: 0,
  moneyLeft: 0,
  numberOfPurchases: 0,
  moneySpent: 0,
  debt: 0,
};

export const FinanceContext = createContext<IFinanceContext | null>(null);

export const FinanceProvider: FC<IProviderProps> = ({ children }) => {
  const [finances, setFinance] = useState<IFinance>(defaultFinance);
  const [financeIsLoading, setFinanceIsLoading] = useState(false);

  const initError = useRef<string | null>(null);
  const hasInitialized = useRef(false);

  const updateFinance = async (
    updatedFinance: IFinance
  ): Promise<IFinanceResponseSingle> => {
    setFinanceIsLoading(true);

    const response: IFinanceResponseSingle = await putFinance(updatedFinance);

    if (!response.success) {
      setFinanceIsLoading(false);
      return response;
    }
    if (response.data) {
      const updatedFinance: IFinance = response.data;
      setFinance(updatedFinance);
    }
    setFinanceIsLoading(false);
    return response;
  };

  const initializeFinances = async (): Promise<void> => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    setFinanceIsLoading(true);

    const getResponse: IFinanceResponseList = await getFinances();

    if (!getResponse.success) {
      initError.current = getResponse.error ?? "Failed to load finances";
      setFinanceIsLoading(false);
      return;
    }

    const financeArray: IFinance[] = getResponse.data;

    if (financeArray.length === 0) {
      console.log(
        "initializeFinances: No finance records found, seeding database..."
      );
      await seedDatabase();
      setFinanceIsLoading(false);
      return;
    }

    if (financeArray.length > 1) {
      console.warn(
        "initializeFinances: More than 1 Finance object found, using newest by ID"
      );
    }

    const newestFinance: IFinance = financeArray.reduce((latest, current) =>
      current.id > latest.id ? current : latest
    );

    setFinance(newestFinance);
    setFinanceIsLoading(false);
  };

  const seedDatabase = async () => {
    console.log(`Seeding database with finances`);
    const seedFinances: Omit<IFinance, "id"> = {
      moneyLeft: 100000,
      numberOfPurchases: 0,
      moneySpent: 0,
      debt: 0,
    };

    const postResponse: IFinanceResponseSingle = await postFinance(
      seedFinances
    );

    if (!postResponse.success) {
      console.error("Failed to seed database.");
      initError.current = postResponse.error ?? "Failed to seed finance";
      return;
    }

    if (postResponse.data && postResponse.success) {
      const updatedFinance: IFinance = postResponse.data;
      setFinance(updatedFinance);
      return;
    }
  };

  useEffect(() => {
    initializeFinances();
  }, []);

  return (
    <FinanceContext.Provider
      value={{
        finances,
        initError: initError.current, //  gjør det lettere for callers å aksessere verdien, de må ikke vite at initError er en useRef
        hasInitialized: hasInitialized.current,
        financeIsLoading,
        updateFinance,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
