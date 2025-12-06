import type { FC } from "react";
import { FinanceDashboard } from "./FinanceDashboard";
import { FinanceLoanWindow } from "./FinanceLoanWindow";

export const FinancePortal: FC = () => {
  // --- Tailwind styling variables ---
  const portalContainerStyling =
    "w-full px-4 py-8 grid grid-cols-12 gap-6 text-center";

  const renderJsx = () => {
    return (
      <section className={portalContainerStyling}>
        <FinanceDashboard />
        <FinanceLoanWindow />
      </section>
    );
  };

  return renderJsx();
};
