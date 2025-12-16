import { useContext, useState, type FC, type FormEvent } from "react";
import type { IFinanceContext } from "../../interfaces/contexts/IFinanceContext";
import { FinanceContext } from "../../contexts/FinanceContext";
import type { IFinanceResponseSingle } from "../../interfaces/IServiceResponses";
import type { IFinance } from "../../interfaces/objects/IFinance";

export const FinanceLoanWindow: FC = () => {
  const { finances, updateFinance, initError, financeIsLoading } = useContext(
    FinanceContext
  ) as IFinanceContext;

  const [loanAmount, setLoanAmount] = useState<string>("");
  const [actionFeedback, setActionFeedback] = useState<string>("");

  // --- Tailwind styling variables ---
  const sectionBase = "col-span-12";

  const titleContainerStyling =
    "rounded-sm shadow-md shadow-black/40 px-4 py-2 bg-black text-black w-full";
  const titleStyling = "text-lg text-white font-bold";
  const debtTextStyling =
    "text-2xl font-bold mt-3 text-[#4C0000] bg-transparent";

  const feedbackStyling = "text-sm text-black text-center";
  const feedbackContainerStyling = `gap-2 rounded-sm px-2 py-1 border border-gray-300 shadow bg-white flex items-center justify-center max-w-[400px] mx-auto mt-4`;

  const inputBase =
    "flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4C0000] min-w-0";
  const buttonBase =
    "bg-[#4C0000] text-white px-6 py-2 rounded font-bold transition-colors whitespace-nowrap";
  const buttonHover = "hover:shadow hover:cursor-pointer hover:bg-[#870000]";

  const inputContainerStyling =
    "flex flex-col sm:flex-row gap-4 items-stretch sm:items-center max-w-[600px] mx-auto";

  const loadingTextStyling = "w-full text-gray-500 text-lg text-center";
  const loadingContainerStyling = "flex justify-center items-center py-12";

  const loanInputLabelStyling = "sr-only";

  const errorContainer =
    "bg-red-50 border border-red-400 text-red-700 px-4 py-3 my-10 rounded max-w-[200px] mx-auto";

  // --- Knapp handler ---
  const handleLoanRequest = async (e: FormEvent) => {
    e.preventDefault();
    setActionFeedback("");

    if (loanAmount.trim() === "" || isNaN(Number(loanAmount))) {
      setActionFeedback("Please enter a valid loan amount.");
      return;
    }

    const loanValue = Number(loanAmount);
    if (loanValue <= 0) {
      setActionFeedback("Loan amount must be greater than 0.");
      return;
    }

    const updatedFinance: IFinance = {
      ...finances,
      debt: finances.debt + loanValue,
      moneyLeft: finances.moneyLeft + loanValue,
    };

    const response: IFinanceResponseSingle = await updateFinance(
      updatedFinance
    );

    if (response.success) {
      setActionFeedback(
        `Successfully borrowed: $${loanValue.toLocaleString()}`
      );
    } else if (!response.success) {
      setActionFeedback(`Failed to process loan`);
    }
    setLoanAmount("");
  };

  const renderJsx = () => {
    const renderHeader = () => (
      <section className={sectionBase}>
        <div className={titleContainerStyling}>
          <h3 className={titleStyling}>Loan Portal</h3>
        </div>
        <p className={debtTextStyling}>
          Total debt: ${finances.debt.toLocaleString()}
        </p>
      </section>
    );

    // Generer loan form
    const renderLoanForm = () => (
      <section className={sectionBase}>
        <form className={inputContainerStyling} onSubmit={handleLoanRequest}>
          <label htmlFor="loan-input" className={loanInputLabelStyling}>
            Input loan amount
          </label>
          <input
            id="loan-input"
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            placeholder="Enter amount"
            className={inputBase}
          />

          <button type="submit" className={`${buttonBase} ${buttonHover}`}>
            Request Loan
          </button>
        </form>
        <div className="h-[28px] mt-4 flex items-center justify-center">
          {actionFeedback && (
            <div className={feedbackContainerStyling}>
              <p className={feedbackStyling}>{actionFeedback}</p>
            </div>
          )}
        </div>
      </section>
    );

    // Håndter feil og loading states
    if (initError) {
      return (
        <>
          <section className={sectionBase}>
            <div className={errorContainer}>
              <p>{initError}</p>
            </div>
          </section>
        </>
      );
    }

    if (financeIsLoading) {
      return;
    }

    return (
      <>
        {renderHeader()}
        {renderLoanForm()}
      </>
    );
  };

  return renderJsx();
};
