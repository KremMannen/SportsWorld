import type { FC } from "react";
import { FinanceDashboard } from "./FinanceDashboard";
import { FinanceLoanWindow } from "./FinanceLoanWindow";

export const FinancePortal: FC = () => {
  return (
    <section className="w-full px-4 py-8 grid grid-cols-12 gap-6 text-center">
      <FinanceDashboard />
      <FinanceLoanWindow />
    </section>
  );
};
