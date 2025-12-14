import type { IFinanceResponseSingle } from "../IServiceResponses";
import type { IFinance } from "../objects/IFinance";

export interface IFinanceContext {
  finances: IFinance;
  financeIsLoading: boolean;
  initError: string | null;
  hasInitialized: boolean;
  updateFinance: (finance: IFinance) => Promise<IFinanceResponseSingle>;
}
