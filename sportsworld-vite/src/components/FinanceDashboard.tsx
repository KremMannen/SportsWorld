import { useContext, type FC } from "react";
import { AthleteContext } from "../contexts/AthleteContext";
import type { IAthleteContext } from "../interfaces/IAthleteContext";
import type { IFinanceContext } from "../interfaces/IFinanceContext";
import { FinanceContext } from "../contexts/FinanceContext";

export const FinanceDashboard: FC = () => {
  const { athletes, athleteErrorMessage, athleteIsLoading } = useContext(
    AthleteContext
  ) as IAthleteContext;

  const { finances, financeErrorMessage, financeIsLoading } = useContext(
    FinanceContext
  ) as IFinanceContext;

  // Sjekker først om innhold laster og viser info til bruker
  if (athleteIsLoading || financeIsLoading) {
    return (
      <div className="text-center">
        <p className="text-xl text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  // Sjekker om det er noen feil og viser feilmelding til bruker
  if (athleteErrorMessage || financeErrorMessage) {
    return (
      <div className=" text-center">
        <p className="text-xl text-red-600">
          {athleteErrorMessage || financeErrorMessage}
        </p>
      </div>
    );
  }

  // Display verdiene til dashboardet
  const accountBalance = finances.length > 0 ? finances[0].moneyLeft : 0;
  const fightersOwned = athletes.length;
  const fightersWorth = athletes.reduce(
    (total, athlete) => total + athlete.price,
    0
  );

  return (
    <div className="py-8 grid grid-cols-12 gap-6 text-center">
      {/* Account Balance */}
      <div className="col-span-12 md:col-span-4">
        <div className="rounded-sm shadow-md shadow-black/40 px-4 py-2 bg-black text-black w-full">
          <h3 className="text-md text-white">Account Balance</h3>
        </div>
        <p className="text-2xl font-bold mt-3 text-[#4C0000] bg-transparent">
          ${accountBalance.toLocaleString()}
        </p>
      </div>

      {/* Fighters Owned */}
      <div className="col-span-12 md:col-span-4 hidden md:block">
        <div className="rounded-sm shadow-md shadow-black/40 px-4 py-2 bg-black text-black w-full">
          <h3 className="text-md text-white">Fighters Owned</h3>
        </div>
        <p className="text-2xl font-bold mt-3 text-[#4C0000] bg-transparent">
          {fightersOwned}
        </p>
      </div>

      {/* Fighters Worth */}
      <div className="col-span-12 md:col-span-4 hidden md:block">
        <div className="rounded-sm shadow-md shadow-black/40 px-4 py-2 bg-black text-white w-full">
          <h3 className="text-md text-white">Fighters Worth</h3>
        </div>
        <p className="text-2xl font-bold mt-3 text-[#4C0000] bg-transparent">
          ${fightersWorth.toLocaleString()}
        </p>
      </div>
    </div>
  );
};
