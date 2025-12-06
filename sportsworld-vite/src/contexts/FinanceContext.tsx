import { createContext, useEffect, useRef, useState, type FC } from "react";
import type { IProviderProps } from "../interfaces/components/IProviderProps";
import {
  getFinances,
  putFinance,
  postFinance,
} from "../services/SportsWorldService";
import type { IFinanceContext } from "../interfaces/contexts/IFinanceContext";
import type { IFinance } from "../interfaces/objects/IFinance";

// Vi bruker denne for å slippe å sette | null i finances, og følgelig overalt i komponentene som bruker den
const defaultFinance: IFinance = {
  moneyLeft: 0,
  numberOfPurchases: 0,
  moneySpent: 0,
  debt: 0,
};

export const FinanceContext = createContext<IFinanceContext | null>(null);

export const FinanceProvider: FC<IProviderProps> = ({ children }) => {
  const [finances, setFinance] = useState<IFinance>(defaultFinance);
  const [financeErrorMessage, setFinanceErrorMessage] = useState<string>("");
  const [financeIsLoading, setFinanceIsLoading] = useState(false);
  const isInitializing = useRef(false);

  const showFinances = async () => {
    setFinanceIsLoading(true);
    setFinanceErrorMessage("");
    try {
      const response = await getFinances();

      if (response.success && response.data) {
        // Finance kommer i array format, men herfra vil vi konvertere til enkelt objekt
        // Dette fordi context skal gjøre det enklere for komponenter å hente finance data
        const financeArray = response.data;
        // Denne linjen er litt stygg, men vi vet at det kun er ett finance objekt i arrayet
        const finance = financeArray[0];
        setFinance(finance);
      } else {
        setFinanceErrorMessage(response.error ?? "Failed to load finances");
      }
      setFinanceIsLoading(false);
    } catch (err) {
      setFinanceErrorMessage("Unexpected error updating finance");
    }
  };

  const updateFinance = async (updatedFinance: IFinance) => {
    setFinanceIsLoading(true);
    setFinanceErrorMessage("");
    try {
      const response = await putFinance(updatedFinance);

      if (!response.success) {
        setFinanceErrorMessage(response.error ?? "Failed to update finances");
        return;
      }
      // Trenger ikke sette loading som false enda, da showFinance gjør det til slutt
      await showFinances();
    } catch (err) {
      setFinanceErrorMessage("Unexpected error updating finance");
    }
  };

  const initializeFinances = async () => {
    if (isInitializing.current) {
      return;
    }
    isInitializing.current = true;
    setFinanceIsLoading(true);

    // Sjekk om det allerede finnes finances
    const existingFinances = await getFinances();

    if (!existingFinances.success) {
      setFinanceErrorMessage(
        existingFinances.error ?? "Failed to connect to database"
      );
      isInitializing.current = false;
      setFinanceIsLoading(false);
      return;
    }

    if (existingFinances.data.length === 0) {
      console.log(`Seeding database with finances`);
      const seedFinances = {
        moneyLeft: 100000,
        numberOfPurchases: 0,
        moneySpent: 0,
        debt: 0,
      };

      const result = await postFinance(seedFinances);
      if (!result.success) {
        setFinanceErrorMessage(result.error ?? "Failed to seed finances");
        isInitializing.current = false;
        setFinanceIsLoading(false);
        return;
      }
    } else {
      console.log(
        `Database already has ${existingFinances.data.length} finances, skipping seeding`
      );
    }
    await showFinances();
  };

  useEffect(() => {
    initializeFinances();
  }, []);

  return (
    <FinanceContext.Provider
      value={{
        finances,
        financeErrorMessage,
        financeIsLoading,
        showFinances,
        updateFinance,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
