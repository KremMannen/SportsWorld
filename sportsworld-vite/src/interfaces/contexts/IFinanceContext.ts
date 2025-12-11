import type { IFinance } from "../objects/IFinance";

export interface IFinanceContext {
  finances: IFinance;
  financeErrorMessage: string;
  financeIsLoading: boolean;
  updateFinance: (finance: IFinance) => Promise<void>;
}
