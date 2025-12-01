import type { IFinance } from "./IFinance";

export interface IFinanceContext {
  finance: IFinance | null;
  errorMessage: string;
  showFinance: () => Promise<void>;
  updateFinance: (finance: IFinance) => Promise<void>;
}
