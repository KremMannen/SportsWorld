import type { FC } from "react";
import type { IFinanceCardProps } from "../../interfaces/components/IFinanceCardProps";

export const FinanceCard: FC<IFinanceCardProps> = ({
  title,
  value,
  limitedVariant = false,
}) => {
  // --- Tailwind styling variables ---
  const sectionStyling = limitedVariant
    ? "col-span-12 sm:col-span-12 md:col-span-4 w-full max-w-lg mx-auto"
    : "col-span-12 sm:col-span-6 ";

  const titleContainerStyling =
    "rounded-sm shadow-md shadow-black/40 px-4 py-2 bg-black text-black ";

  const titleStyling = "text-md text-white";

  const valueStyling = "text-2xl font-bold mt-3 text-[#4C0000] bg-transparent";

  const renderJsx = () => {
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
