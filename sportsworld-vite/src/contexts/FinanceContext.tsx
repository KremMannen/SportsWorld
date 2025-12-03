import { createContext, useEffect, useState, type FC } from "react";
import type { IProviderProps } from "../interfaces/IProviderProps";
import { getFinances, putFinance } from "../services/SportsWorldService";
import type { IFinanceContext } from "../interfaces/IFinanceContext";
import type { IFinance } from "../interfaces/IFinance";

export const FinanceContext = createContext<IFinanceContext | null>(null);

export const FinanceProvider: FC<IProviderProps> = ({ children }) => {
  const [finance, setFinance] = useState<IFinance | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const showFinance = async () => {
    setErrorMessage("");
    try {
      const data = await getFinances();
      setFinance(data[0] || null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Loading failed, unknown reason"
      );
    }
  };

  const updateFinance = async (updatedFinance: IFinance) => {
    setErrorMessage("");
    try {
      await putFinance(updatedFinance);
      await showFinance();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Update failed, unknown reason"
      );
    }
  };

  useEffect(() => {
    showFinance();
  }, []);

  return (
    <FinanceContext.Provider
      value={{
        finance,
        errorMessage,
        showFinance,
        updateFinance,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
