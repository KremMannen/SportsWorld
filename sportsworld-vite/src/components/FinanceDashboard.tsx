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
    // Setter span basert på limitedVariant
  const titleContainerStyling =
    "rounded-sm shadow-md shadow-black/40 px-4 py-2 bg-black text-black w-full";
  const titleStyling = "text-md text-white";
  const pStyling = "text-2xl font-bold mt-3 text-[#4C0000] bg-transparent";



  // Modulær card-component for innhold i finance dashboard.
  const FinanceCard = ({ title, value }: { title: string; value: string | number }) => (
    <section className={limitedVariant ? "col-span-12 sm:col-span-4 w-full max-w-lg mx-auto" : "col-span-12 sm:col-span-6 lg:col-span-4"}>
      <div className={titleContainerStyling}>
        <h3 className={titleStyling}>{title}</h3>
      </div>
      <p className={pStyling}>{value}</p>
    </section>
  );

  // alle kort 
  // Bruker .toLocaleString() for å få pen formattering på store tall
  const financeCards = (
    <>
      <FinanceCard 
        title="Account Balance" 
        value={`$${finances.moneyLeft.toLocaleString()}`} 
      />
      <FinanceCard 
        title="Fighters Owned" 
        value={fightersOwned} 
      />
      <FinanceCard 
        title="Fighters Worth" 
        value={`$${fightersWorth.toLocaleString()}`} 
      />
      {!limitedVariant && (
        <FinanceCard 
          title="Total Spending" 
          value={`$${finances.moneySpent.toLocaleString()}`} 
        />
      )}
    </>
  );

  // LimitedVariant kort får sin egen grid
  if (limitedVariant) {
    return (
      <section className="w-full px-4 py-8 grid grid-cols-12 gap-6 text-center">
        {financeCards}
      </section>
    );
  }

  return financeCards;
};