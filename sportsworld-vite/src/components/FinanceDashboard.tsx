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
  // Beholder disse kalkuleringene på component nivå, siden de er spesifikke for denne modulen
  // Må ta høyde for at finances kan være tom, hvis ikke kræsjer appen
  const accountBalance = finances.length > 0 ? finances[0].moneyLeft : 0;
  const fightersOwned = athletes.filter((athlete) => athlete.purchased).length;
  const fightersWorth = athletes
    .filter((athlete) => athlete.purchased)
    .reduce((total, athlete) => total + athlete.price, 0);
  const moneySpent = finances.length > 0 ? finances[0].moneySpent : 0;

  // -- Tailwind verdier for dashboardet --
  const containerStyling = "py-8 grid grid-cols-12 gap-6 text-center";
  // Setter span basert på limitedVariant
  const sectionStyling = limitedVariant
    ? "col-span-12 md:col-span-6 lg:col-span-4"
    : "col-span-6";

  const titleContainerStyling =
    "rounded-sm shadow-md shadow-black/40 px-4 py-2 bg-black text-black w-full";
  const titleStyling = "text-md text-white";
  const pStyling = "text-2xl font-bold mt-3 text-[#4C0000] bg-transparent";

  return (
    <section className={containerStyling}>
      {/* Account Balance: alltid synlig */}
      <section className={`${sectionStyling} block`}>
        <div className={titleContainerStyling}>
          <h3 className={titleStyling}>Account Balance</h3>
        </div>
        <p className={pStyling}>${accountBalance.toLocaleString()}</p>
      </section>

      {/* Fighters Owned: hidden on small, visible on md+ */}
      <section className={`${sectionStyling}`}>
        <div className={titleContainerStyling}>
          <h3 className={titleStyling}>Fighters Owned</h3>
        </div>
        <p className={pStyling}>{fightersOwned}</p>
      </section>

      {/* Fighters Worth: hidden on small, visible on md+ */}
      <section className={`${sectionStyling}`}>
        <div className={titleContainerStyling}>
          <h3 className={titleStyling}>Fighters Worth</h3>
        </div>
        <p className={pStyling}>${fightersWorth.toLocaleString()}</p>
      </section>

      {/* Total Spending: only visible on large */}
      {!limitedVariant && (
        <section className={`${sectionStyling}`}>
          <div className={titleContainerStyling}>
            <h3 className={titleStyling}>Total Spending</h3>
          </div>
          <p className={pStyling}>${moneySpent}</p>
        </section>
      )}
    </section>
  );
};
