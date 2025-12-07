import type { FC } from "react";
import { FinanceDashboard } from "./FinanceDashboard";
import { FinanceLoanWindow } from "./FinanceLoanWindow";

export const FinancePortal: FC = () => {
  // --- Tailwind styling variables ---
  const portalContainerStyling =
    "px-4 py-8 grid grid-cols-12 gap-6 text-center";

  const dashboardContainerStyling =
    "grid grid-cols-12 gap-6 col-span-12 sm:col-span-10 sm:col-start-2 md:col-span-8 md:col-start-3 lg:col-span-4 lg:col-start-3";

  const loanContainerStyling =
    "col-span-12 sm:col-span-10 sm:col-start-2 md:col-span-8 md:col-start-3 lg:col-span-4 lg:col-start-7";

  const renderJsx = () => {
    return (
      <section className={portalContainerStyling}>
        <div className={dashboardContainerStyling}>
          <FinanceDashboard />
        </div>
        <div className={loanContainerStyling}>
          <FinanceLoanWindow />
        </div>
      </section>
    );
  };

  return renderJsx();
};
