import { createContext, useEffect, useRef, useState, type FC } from "react";
import type { IProviderProps } from "../interfaces/components/IProviderProps";
import {
  getFinances,
  putFinance,
  postFinance,
} from "../services/SportsWorldService";
import type { IFinanceContext } from "../interfaces/contexts/IFinanceContext";
import type { IFinance } from "../interfaces/objects/IFinance";
import type { IFinanceResponseSingle } from "../interfaces/IServiceResponses";

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
  const isInitializing = useRef(false);

  const updateFinance = async (
    updatedFinance: IFinance
  ): Promise<IFinanceResponseSingle> => {
    setFinanceIsLoading(true);

    const response = await putFinance(updatedFinance);

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
    if (isInitializing.current) {
      return;
    }
    isInitializing.current = true;
    setFinanceIsLoading(true);

    const getResponse = await getFinances();

    if (!getResponse.success) {
      setFinanceIsLoading(false);
      isInitializing.current = false;
      return;
    }

    const financeArray = getResponse.data;

    if (financeArray.length === 0) {
      console.log(
        "initializeFinances: No finance records found, seeding database..."
      );
      await seedDatabase();
      setFinanceIsLoading(false);
      isInitializing.current = false;
      return;
    }

    if (financeArray.length > 1) {
      console.warn(
        "initializeFinances: More than 1 Finance object found, using newest by ID"
      );
    }

    const newestFinance = financeArray.reduce((latest, current) =>
      current.id > latest.id ? current : latest
    );

    setFinance(newestFinance);
    setFinanceIsLoading(false);
    isInitializing.current = false;
  };

  const seedDatabase = async () => {
    console.log(`Seeding database with finances`);
    const seedFinances = {
      moneyLeft: 100000,
      numberOfPurchases: 0,
      moneySpent: 0,
      debt: 0,
    };

    const response = await postFinance(seedFinances);

    if (!response.success) {
      console.error("Failed to seed database.");
      return;
    }

    if (response.data) {
      const updatedFinance: IFinance = response.data;
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
        financeIsLoading,
        updateFinance,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
