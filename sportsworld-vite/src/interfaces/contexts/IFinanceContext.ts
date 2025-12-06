import type { IFinance } from "../objects/IFinance";

export interface IFinanceContext {
  finances: IFinance;
  financeErrorMessage: string;
  financeIsLoading: boolean;
  showFinances: () => Promise<void>;
  updateFinance: (finance: IFinance) => Promise<void>;
}
