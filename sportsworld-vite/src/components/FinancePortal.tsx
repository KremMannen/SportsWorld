import type { FC } from "react";
import { FinanceDashboard } from "./FinanceDashboard";
import { FinanceLoanWindow } from "./FinanceLoanWindow";

export const FinancePortal: FC = () => {
  return (
    <section className="grid grid-cols-12 gap-6">
      {/* bruker span-4 og col start 3 for gjøre den mindre bred men fortsatt sentrert */}
      <div className="col-start-3 col-span-4">
        <FinanceDashboard />
      </div>
      <div className="col-span-4">
        <FinanceLoanWindow />
      </div>
    </section>
  );
};
