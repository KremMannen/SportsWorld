import { createContext, useEffect, useState, type FC } from "react";
import type { IProviderProps } from "../interfaces/IProviderProps";
import { getFinances, putFinance } from "../services/SportsWorldService";
import type { IFinanceContext } from "../interfaces/IFinanceContext";
import type { IFinance } from "../interfaces/IFinance";

export const FinanceContext = createContext<IFinanceContext | null>(null);

export const FinanceProvider: FC<IProviderProps> = ({ children }) => {
  const [finance, setFinance] = useState<IFinance[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const showFinance = async () => {
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
    await showFinance();
  };

  useEffect(() => {
    showFinance();
  }, []);

  return (
    <FinanceContext.Provider
      value={{
        finance,
        errorMessage,
        isLoading,
        showFinance,
        updateFinance,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
