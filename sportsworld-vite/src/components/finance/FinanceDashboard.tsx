import { useContext, type FC } from "react";
import { AthleteContext } from "../../contexts/AthleteContext";
import type { IAthleteContext } from "../../interfaces/contexts/IAthleteContext";
import type { IFinanceContext } from "../../interfaces/contexts/IFinanceContext";
import { FinanceContext } from "../../contexts/FinanceContext";
import type { IFinanceDashboardProps } from "../../interfaces/components/IFinanceDashboardProps";
import { FinanceCard } from "./FinanceCard";
import { FinanceLoanWindow } from "./FinanceLoanWindow";
import type { IAthlete } from "../../interfaces/objects/IAthlete";

export const FinanceDashboard: FC<IFinanceDashboardProps> = ({
  limitedVariant = false,
}) => {
  const { athletes } = useContext(AthleteContext) as IAthleteContext;

  const { finances, initError, hasInitialized } = useContext(
    FinanceContext
  ) as IFinanceContext;

  // --- Styling ---
  const loadingContainer =
    "flex w-full justify-center items-center py-12 max-w-[200px] mx-auto";

  const loadingText = "w-full text-gray-500 text-lg text-center";
  const errorContainer =
    "bg-red-50 border border-red-400 text-red-700 px-4 py-3 mb-10 rounded max-w-[200px] mx-auto";
  const sectionBase = "w-full pt-12 grid grid-cols-12 gap-6 text-center";
  const sectionContainerStyling = `py-12`;
  const containerStyling = "col-span-12 lg:col-span-6 grid grid-cols-12 gap-6";

  // --- Kalkulerte visningsverdier ---
  const purchasedAthletes: IAthlete[] = athletes.filter((a) => a.purchased);
  const fightersOwned: number = purchasedAthletes.length;
  const fightersWorth: number = purchasedAthletes.reduce(
    (t, a) => t + a.price,
    0
  );

  const renderJsx = () => {
    // Generer finance cards
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

    // TODO: Bør egentlig sjekke athletes og, men krever refacor av variable names, ingen konsekvens atm
    if (initError) {
      return (
        <section className={sectionContainerStyling}>
          <div className={errorContainer}>
            <p>{initError}</p>
          </div>
        </section>
      );
    }

    // TODO: Bør egentlig sjekke athletes...
    // Innhold laster inn
    if (!hasInitialized) {
      return (
        <section className={sectionContainerStyling}>
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
        <div className={containerStyling}>
          <FinanceLoanWindow />
        </div>
      </section>
    );
  };

  return renderJsx();
};
