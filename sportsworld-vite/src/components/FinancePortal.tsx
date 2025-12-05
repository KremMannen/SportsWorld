import { useContext, useState, type FC } from "react";
import type { IFinanceContext } from "../interfaces/IFinanceContext";
import { FinanceContext } from "../contexts/FinanceContext";

export const FinancePortal: FC = () => {
  const { finances, financeErrorMessage, financeIsLoading, updateFinance } =
    useContext(FinanceContext) as IFinanceContext;

  const [loanAmount, setLoanAmount] = useState("");

  // Sjekker først om innhold laster og isåfall informerer bruker
  if (financeIsLoading) {
    return (
      <div className="text-center">
        <p className="text-xl text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  // Sjekker om det er noen feil og viser eventuell feilmelding til bruker
  if (financeErrorMessage) {
    return (
      <div className="text-center">
        <p className="text-xl text-red-600">{financeErrorMessage}</p>
      </div>
    );
  }

  // -- Visningsverdiene til portalen
  const debt = finances.length > 0 ? finances[0].debt : 0;

  const handleLoanRequest = () => {
    if (loanAmount.trim() === "" || isNaN(Number(loanAmount))) {
      alert("Please enter a valid loan amount.");
      return;
    }
    const loanValue = Number(loanAmount);

    if (loanValue <= 0) {
      alert("Loan amount must be greater than 0.");
      return;
    }

    const currentFinance = finances[0];
    const updatedFinance = {
      ...currentFinance,
      debt: currentFinance.debt + loanValue,
      moneyLeft: currentFinance.moneyLeft + loanValue,
    };

    updateFinance(updatedFinance);
  };

  // -- Tailwind verdier for financeportalen --
  const containerStyling = "py-8 grid grid-cols-12 gap-6 text-center";
  const sectionStyling = "col-span-6";
  const titleContainerStyling =
    "rounded-sm shadow-md shadow-black/40 px-4 py-2 bg-black text-black w-full";
  const titleStyling = "text-md text-white";
  const pStyling = "text-2xl font-bold mt-3 text-[#4C0000] bg-transparent";

  return (
    <section className={containerStyling}>
      <section className={sectionStyling}>
        <div className={titleContainerStyling}>
          <h3 className={titleStyling}>Loan Portal</h3>
        </div>
        <p className={pStyling}>Total debt: {debt}$</p>
      </section>

      <section className={sectionStyling}>
        <div className="flex gap-4 items-center">
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            placeholder="Enter amount"
            className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4C0000]"
          />
          <button
            onClick={handleLoanRequest}
            className="bg-[#4C0000] text-white px-6 py-2 rounded font-bold hover:bg-[#870000] transition-colors"
          >
            Request Loan
          </button>
        </div>
      </section>
    </section>
  );
};
