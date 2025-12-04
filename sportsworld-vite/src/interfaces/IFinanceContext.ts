import type { IFinance } from "./IFinance";

export interface IFinanceContext {
  finance: IFinance[];
  errorMessage: string;
  isLoading: boolean;
  showFinances: () => Promise<void>;
  updateFinance: (finance: IFinance) => Promise<void>;
}
