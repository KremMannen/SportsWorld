import { useContext, type FC } from "react";
import { AthleteContext } from "../../contexts/AthleteContext";
import type { IAthleteContext } from "../../interfaces/IAthleteContext";
import type { IFinanceContext } from "../../interfaces/IFinanceContext";
import { FinanceContext } from "../../contexts/FinanceContext";
import type { IFinanceDashboardProps } from "../../interfaces/properties/IFinanceDashboardProps";
import { FinanceCard } from "./FinanceCard";

export const FinanceDashboard: FC<IFinanceDashboardProps> = ({
  limitedVariant = false,
}) => {
  const { athletes, athleteErrorMessage, athleteIsLoading } = useContext(
    AthleteContext
  ) as IAthleteContext;

  const { finances, financeErrorMessage, financeIsLoading } = useContext(
    FinanceContext
  ) as IFinanceContext;

  // Sjekker først om innhold laster og isåfall informerer bruker
  if (athleteIsLoading || financeIsLoading) {
    return (
      <div className="text-center">
        <p className="text-xl text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  // Sjekker om det er noen feil og viser eventuell feilmelding til bruker
  if (athleteErrorMessage || financeErrorMessage) {
    return (
      <div className=" text-center">
        <p className="text-xl text-red-600">
          {athleteErrorMessage || financeErrorMessage}
        </p>
      </div>
    );
  }
  // -- Visningsverdiene til dashboardet
  const purchasedAthletes = athletes.filter((a) => a.purchased);

  const fightersOwned = purchasedAthletes.length;
  const fightersWorth = purchasedAthletes.reduce((t, a) => t + a.price, 0);

  // alle kort
  // Bruker .toLocaleString() for å få pen formattering på store tall
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

  const renderJsx = () => {
    if (athleteIsLoading || financeIsLoading) {
      return (
        <div className="text-center">
          <p className="text-xl text-gray-600">Loading dashboard...</p>
        </div>
      );
    }

    if (athleteErrorMessage || financeErrorMessage) {
      return (
        <div className="text-center">
          <p className="text-xl text-red-600">
            {athleteErrorMessage || financeErrorMessage}
          </p>
        </div>
      );
    }

    // Limited layout
    if (limitedVariant) {
      return (
        <section className="w-full px-4 py-8 grid grid-cols-12 gap-6 text-center">
          {renderCards()}
        </section>
      );
    }

    // Default layout
    return <>{renderCards()}</>;
  };

  return <>{renderJsx()}</>;
};
