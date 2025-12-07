import { useContext, type FC } from "react";
import { AthleteContext } from "../../contexts/AthleteContext";
import type { IAthleteContext } from "../../interfaces/contexts/IAthleteContext";
import type { IFinanceContext } from "../../interfaces/contexts/IFinanceContext";
import { FinanceContext } from "../../contexts/FinanceContext";
import type { IFinanceDashboardProps } from "../../interfaces/components/IFinanceDashboardProps";
import { FinanceCard } from "./FinanceCard";
import { FinanceLoanWindow } from "./FinanceLoanWindow";

export const FinanceDashboard: FC<IFinanceDashboardProps> = ({
  limitedVariant = false,
}) => {
  const { athletes, athleteErrorMessage, athleteIsLoading } = useContext(
    AthleteContext
  ) as IAthleteContext;

  const { finances, financeErrorMessage, financeIsLoading } = useContext(
    FinanceContext
  ) as IFinanceContext;

  // --- Styling ---
  const loadingContainer = "text-center";
  const loadingText = "text-xl text-gray-600";

  const errorContainer = "text-center";
  const errorText = "text-xl text-red-600";

  const sectionBase = "w-full px-4 py-8 grid grid-cols-12 gap-6 text-center";

  const containerStyling = "col-span-12 lg:col-span-6 grid grid-cols-12 gap-6";

  // --- Kalkulerte visningsverdier ---
  const purchasedAthletes = athletes.filter((a) => a.purchased);
  const fightersOwned = purchasedAthletes.length;
  const fightersWorth = purchasedAthletes.reduce((t, a) => t + a.price, 0);

  const renderCards = () => (
    <>
      <FinanceCard
        title="Account Balance"
        value={`$${finances.moneyLeft.toLocaleString()}`}
        limitedVariant={limitedVariant}
      />
      <FinanceCard
        title="Fighters Owned"
        value={fightersOwned}
        limitedVariant={limitedVariant}
      />
      <FinanceCard
        title="Fighters Worth"
        value={`$${fightersWorth.toLocaleString()}`}
        limitedVariant={limitedVariant}
      />
      {!limitedVariant && (
        <FinanceCard
          title="Total Spending"
          value={`$${finances.moneySpent.toLocaleString()}`}
          limitedVariant={limitedVariant}
        />
      )}
    </>
  );

  const renderLoanWindow = () => {
    return <FinanceLoanWindow />;
  };

  const renderJsx = () => {
    // Loading
    if (athleteIsLoading || financeIsLoading) {
      return (
        <div className={loadingContainer}>
          <p className={loadingText}>Loading dashboard...</p>
        </div>
      );
    }

    // Error
    if (athleteErrorMessage || financeErrorMessage) {
      return (
        <div className={errorContainer}>
          <p className={errorText}>
            {athleteErrorMessage || financeErrorMessage}
          </p>
        </div>
      );
    }

    if (limitedVariant) {
      return <section className={sectionBase}>{renderCards()}</section>;
    }

    // Default output
    return (
      <section className={sectionBase}>
        <div className={containerStyling}>{renderCards()}</div>
        <div className={containerStyling}>{renderLoanWindow()}</div>
      </section>
    );
  };

  return renderJsx();
};
