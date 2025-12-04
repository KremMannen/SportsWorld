import { createContext, useEffect, useRef, useState, type FC } from "react";
import type { IProviderProps } from "../interfaces/properties/IProviderProps";
import { getFinances, putFinance, postFinance } from "../services/SportsWorldService";
import type { IFinanceContext } from "../interfaces/IFinanceContext";
import type { IFinance } from "../interfaces/IFinance";

export const FinanceContext = createContext<IFinanceContext | null>(null);

export const FinanceProvider: FC<IProviderProps> = ({ children }) => {
  const [finance, setFinance] = useState<IFinance[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const isInitializing = useRef(false);

  const showFinances = async () => {
    setIsLoading(true);
    setErrorMessage("");
    const response = await getFinances();

    if (response.success && response.data) {
      setFinance(response.data);
    } else {
      setErrorMessage(response.error ?? "Failed to load athletes");
    }
    setIsLoading(false);
  };

  const updateFinance = async (updatedFinance: IFinance) => {
    setIsLoading(true);
    setErrorMessage("");
    const response = await putFinance(updatedFinance);

    if (!response.success) {
      setErrorMessage(response.error ?? "Failed to update athlete");
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
    setIsLoading(true);

    // Sjekk om det allerede finnes finances
    const existingFinances = await getFinances();

    if (!existingFinances.success) {
      setErrorMessage(
        existingFinances.error ?? "Failed to connect to database"
      );
      isInitializing.current = false;
      setIsLoading(false);
      return;
    }

    if (existingFinances.data.length === 0) {
      const seedFinances = 
        {
          accountBalance: 1000000,
          fightersOwned: 0,
          fightersWorth: 0,
        },
      ;
      
      const result = await postFinance(seedFinances);
        if (!result.success) {
          setErrorMessage(result.error ?? "Failed to seed finances");
          isInitializing.current = false;
          setIsLoading(false);
          return;
        }
      
    } else {
      console.log(
        `Database already has ${existingFinances.data.length} athletes, skipping seeding`
      );
    }
    await showFinances();
  };

  useEffect(() => {
    ();
  }, []);

  return (
    <FinanceContext.Provider
      value={{
        finance,
        errorMessage,
        isLoading,
        showFinances,
        updateFinance,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
