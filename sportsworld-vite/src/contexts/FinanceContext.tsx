import { createContext, useEffect, useRef, useState, type FC } from "react";
import type { IProviderProps } from "../interfaces/properties/IProviderProps";
import {
  getFinances,
  putFinance,
  postFinance,
} from "../services/SportsWorldService";
import type { IFinanceContext } from "../interfaces/IFinanceContext";
import type { IFinance } from "../interfaces/IFinance";

export const FinanceContext = createContext<IFinanceContext | null>(null);

export const FinanceProvider: FC<IProviderProps> = ({ children }) => {
  const [finances, setFinance] = useState<IFinance[]>([]);
  const [financeErrorMessage, setFinanceErrorMessage] = useState<string>("");
  const [financeIsLoading, setFinanceIsLoading] = useState(false);
  const isInitializing = useRef(false);

  const showFinances = async () => {
    setFinanceIsLoading(true);
    setFinanceErrorMessage("");
    const response = await getFinances();

    if (response.success && response.data) {
      setFinance(response.data);
    } else {
      setFinanceErrorMessage(response.error ?? "Failed to load athletes");
    }
    setFinanceIsLoading(false);
  };

  const updateFinance = async (updatedFinance: IFinance) => {
    setFinanceIsLoading(true);
    setFinanceErrorMessage("");
    const response = await putFinance(updatedFinance);

    if (!response.success) {
      setFinanceErrorMessage(response.error ?? "Failed to update athlete");
      return;
    }
    // Trenger ikke sette loading som false enda, da showFinance gjør det til slutt
    await showFinances();
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
      const seedFinances = {
        moneyLeft: 1000000,
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
