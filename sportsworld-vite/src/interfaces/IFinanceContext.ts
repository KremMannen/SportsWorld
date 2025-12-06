import type { IFinance } from "./IFinance";

export interface IFinanceContext {
  finances: IFinance;
  financeErrorMessage: string;
  financeIsLoading: boolean;
  showFinances: () => Promise<void>;
  updateFinance: (finance: IFinance) => Promise<void>;
}
