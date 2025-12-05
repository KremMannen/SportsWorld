import type { FC } from "react";
import { FinanceDashboard } from "./FinanceDashboard";
import { FinanceLoanWindow } from "./FinanceLoanWindow";

export const FinancePortal: FC = () => {
  return (
    <section className="finance-portal grid grid-cols-12 gap-6">
      <div className="col-span-6">
        <FinanceDashboard />
      </div>
      <div className="col-span-6">
        <FinanceLoanWindow />
      </div>
    </section>
  );
};
