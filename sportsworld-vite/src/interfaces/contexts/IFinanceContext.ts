import type { IFinanceResponseSingle } from "../IServiceResponses";
import type { IFinance } from "../objects/IFinance";

export interface IFinanceContext {
  finances: IFinance;
  financeIsLoading: boolean;
  updateFinance: (finance: IFinance) => Promise<IFinanceResponseSingle>;
}
