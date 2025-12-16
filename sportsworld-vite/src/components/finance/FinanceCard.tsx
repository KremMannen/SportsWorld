import { useContext, type FC } from "react";
import type { IFinanceCardProps } from "../../interfaces/components/IFinanceCardProps";
import { FinanceContext } from "../../contexts/FinanceContext";
import type { IFinanceContext } from "../../interfaces/contexts/IFinanceContext";

export const FinanceCard: FC<IFinanceCardProps> = ({
  title,
  value,
  limitedVariant = false,
}) => {
  const { financeIsLoading } = useContext(FinanceContext) as IFinanceContext;

  // --- Tailwind styling variables ---
  const sectionStyling = limitedVariant
    ? "col-span-12 sm:col-span-12 md:col-span-4 w-full max-w-lg mx-auto"
    : "col-span-12 sm:col-span-6 ";
  const titleContainerStyling = limitedVariant
    ? "rounded-sm shadow-md shadow-black/40 px-4 py-2 bg-black"
    : "rounded-sm shadow-md shadow-black/40 px-4 py-2 bg-black ";
  const titleStyling = "text-lg text-white font-bold";
  const valueStyling = "text-2xl font-bold mt-3 text-[#4C0000]";

  const renderJsx = () => {
    // trenger ikke UI feedback per kort når det laster inn
    if (financeIsLoading) {
      return;
    }

    return (
      <section className={sectionStyling}>
        <div className={titleContainerStyling}>
          <h3 className={titleStyling}>{title}</h3>
        </div>
        <p className={valueStyling}>{value}</p>
      </section>
    );
  };

  return renderJsx();
};
