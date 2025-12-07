import { useContext, useState, type FC, type FormEvent } from "react";
import type { IFinanceContext } from "../../interfaces/contexts/IFinanceContext";
import { FinanceContext } from "../../contexts/FinanceContext";

export const FinanceLoanWindow: FC = () => {
  const { finances, financeErrorMessage, financeIsLoading, updateFinance } =
    useContext(FinanceContext) as IFinanceContext;

  const [loanAmount, setLoanAmount] = useState("");

  // --- Tailwind styling variables ---
  const sectionBase = "col-span-12";

  const titleContainerStyling =
    "rounded-sm shadow-md shadow-black/40 px-4 py-2 bg-black text-black w-full";
  const titleStyling = "text-md text-white";

  const debtTextStyling =
    "text-2xl font-bold mt-3 text-[#4C0000] bg-transparent";

  const inputBase =
    "flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4C0000] min-w-0";
  const buttonBase =
    "bg-[#4C0000] text-white px-6 py-2 rounded font-bold transition-colors whitespace-nowrap";
  const buttonHover = "hover:shadow hover:cursor-pointer hover:bg-[#870000]";

  const inputContainerStyling =
    "flex flex-col sm:flex-row gap-4 items-stretch sm:items-center";

  const loadingContainer = "text-center";
  const loadingText = "text-xl text-gray-600";

  const errorContainer = "text-center";
  const errorText = "text-xl text-red-600";

  // --- Knapp handler ---
  const handleLoanRequest = async (e: FormEvent) => {
    e.preventDefault();

    if (loanAmount.trim() === "" || isNaN(Number(loanAmount))) {
      alert("Please enter a valid loan amount.");
      return;
    }

    const loanValue = Number(loanAmount);
    if (loanValue <= 0) {
      alert("Loan amount must be greater than 0.");
      return;
    }

    const updatedFinance = {
      ...finances,
      debt: finances.debt + loanValue,
      moneyLeft: finances.moneyLeft + loanValue,
    };

    await updateFinance(updatedFinance);
    setLoanAmount("");
  };

  const renderJsx = () => {
    // Sjekker først om innhold laster og isåfall informerer bruker
    if (financeIsLoading) {
      return (
        <div className={loadingContainer}>
          <p className={loadingText}>Loading dashboard...</p>
        </div>
      );
    }

    // Sjekker om det er noen feil og viser eventuell feilmelding til bruker
    if (financeErrorMessage) {
      return (
        <div className={errorContainer}>
          <p className={errorText}>{financeErrorMessage}</p>
        </div>
      );
    }

    // Hovedinnholdet til FinanceLoanWindow
    return (
      <>
        <section className={sectionBase}>
          <div className={titleContainerStyling}>
            <h3 className={titleStyling}>Loan Portal</h3>
          </div>
          {/* Bruker .toLocaleString() for å få pen formattering på store tall */}
          <p className={debtTextStyling}>
            Total debt: ${finances.debt.toLocaleString()}
          </p>
        </section>

        <section className={sectionBase}>
          <div className={inputContainerStyling}>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              placeholder="Enter amount"
              className={inputBase}
            />
            <button
              onClick={handleLoanRequest}
              className={`${buttonBase} ${buttonHover}`}
            >
              Request Loan
            </button>
          </div>
        </section>
      </>
    );
  };

  return renderJsx();
};
