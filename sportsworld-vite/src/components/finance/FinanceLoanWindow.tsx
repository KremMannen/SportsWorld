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
  const titleStyling = "text-lg text-white font-bold";

  const debtTextStyling =
    "text-2xl font-bold mt-3 text-[#4C0000] bg-transparent";

  const inputBase =
    "flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4C0000] min-w-0";
  const buttonBase =
    "bg-[#4C0000] text-white px-6 py-2 rounded font-bold transition-colors whitespace-nowrap";
  const buttonHover = "hover:shadow hover:cursor-pointer hover:bg-[#870000]";

  const inputContainerStyling =
    "flex flex-col sm:flex-row gap-4 items-stretch sm:items-center lg:-mt-11";

  const loanInputLabelStyling = "sr-only";

  const loadingContainer = "text-center";
  const loadingText = "text-xl text-gray-600";

  const errorContainer =
    "bg-red-50 border border-red-400 text-red-700 px-4 py-3 my-10 rounded max-w-[200px] mx-auto";

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
    if (financeIsLoading) {
      return (
        <div className={loadingContainer}>
          <p className={loadingText}>Loading dashboard...</p>
        </div>
      );
    }

    if (financeErrorMessage) {
      return (
        <div className={errorContainer}>
          <p>{financeErrorMessage}</p>
        </div>
      );
    }

    return (
      <>
        <section className={sectionBase}>
          <div className={titleContainerStyling}>
            <h3 className={titleStyling}>Loan Portal</h3>
          </div>
          <p className={debtTextStyling}>
            Total debt: ${finances.debt.toLocaleString()}
          </p>
        </section>

        <section className={sectionBase}>
          <div className={inputContainerStyling}>
            <label htmlFor="loan-input" className={loanInputLabelStyling}>
              Input loan amount
            </label>
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
