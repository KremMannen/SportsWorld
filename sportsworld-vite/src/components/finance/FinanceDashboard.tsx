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
  const { athletes, athleteIsLoading } = useContext(
    AthleteContext
  ) as IAthleteContext;

  const { finances, financeIsLoading } = useContext(
    FinanceContext
  ) as IFinanceContext;

  // --- Styling ---
  const loadingContainer = "text-center";
  const loadingText = "text-xl text-gray-600";
  const errorContainer =
    "bg-red-50 border border-red-400 text-red-700 px-4 py-3 my-10 rounded max-w-[200px] mx-auto";
  const sectionBase = "w-full pt-12 grid grid-cols-12 gap-6 text-center";
  const sectionErrorBase = "pt-12";
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
      {/* Viser ikke denne på hovedsiden */}
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
        <section className={sectionErrorBase}>
          <div className={loadingContainer}>
            <p className={loadingText}>Loading dashboard...</p>
          </div>
        </section>
      );
    }

    // Begrenset variant som vises kun på forsiden (homepage)
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
