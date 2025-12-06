import { useContext, type FC } from "react";
import { AthleteContext } from "../contexts/AthleteContext";
import type { IAthleteContext } from "../interfaces/IAthleteContext";
import type { IFinanceContext } from "../interfaces/IFinanceContext";
import { FinanceContext } from "../contexts/FinanceContext";
import type { IFinanceDashboardProps } from "../interfaces/properties/IFinanceDashboardProps";

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
  const fightersOwned = athletes.filter((athlete) => athlete.purchased).length;
  const fightersWorth = athletes
    .filter((athlete) => athlete.purchased)
    .reduce((total, athlete) => total + athlete.price, 0);

  // -- Tailwind verdier for dashboardet --
  const sectionStyling = "col-span-12 sm:col-span-6 lg:col-span-4";
  const titleContainerStyling =
    "rounded-sm shadow-md shadow-black/40 px-4 py-2 bg-black text-black w-full";
  const titleStyling = "text-md text-white";
  const pStyling = "text-2xl font-bold mt-3 text-[#4C0000] bg-transparent";

  return (
    <>
      {/* Account Balance: alltid synlig */}
      <section className={sectionStyling}>
        <div className={titleContainerStyling}>
          <h3 className={titleStyling}>Account Balance</h3>
        </div>
        <p className={pStyling}>${finances.moneyLeft.toLocaleString()}</p>
      </section>

      {/* Fighters Owned */}
      <section className={sectionStyling}>
        <div className={titleContainerStyling}>
          <h3 className={titleStyling}>Fighters Owned</h3>
        </div>
        <p className={pStyling}>{fightersOwned}</p>
      </section>

      {/* Fighters Worth */}
      <section className={sectionStyling}>
        <div className={titleContainerStyling}>
          <h3 className={titleStyling}>Fighters Worth</h3>
        </div>
        <p className={pStyling}>${fightersWorth.toLocaleString()}</p>
      </section>

      {/* Total Spending */}
      {!limitedVariant && (
        <section className={sectionStyling}>
          <div className={titleContainerStyling}>
            <h3 className={titleStyling}>Total Spending</h3>
          </div>
          <p className={pStyling}>${finances.moneySpent}</p>
        </section>
      )}
    </>
  );
}