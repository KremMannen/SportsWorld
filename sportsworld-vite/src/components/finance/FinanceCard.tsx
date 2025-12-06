import type { FC } from "react";
import type { IFinanceCardProps } from "../../interfaces/components/IFinanceCardProps";

export const FinanceCard: FC<IFinanceCardProps> = ({
  title,
  value,
  limitedVariant = false,
}) => {
  // -- Tailwind verdier for kortet --
  // Setter span basert på limitedVariant
  const titleContainerStyling =
    "rounded-sm shadow-md shadow-black/40 px-4 py-2 bg-black text-black w-full";
  const titleStyling = "text-md text-white";
  const pStyling = "text-2xl font-bold mt-3 text-[#4C0000] bg-transparent";

  return (
    <section
      className={
        limitedVariant
          ? "col-span-12 sm:col-span-4 w-full max-w-lg mx-auto"
          : "col-span-12 sm:col-span-6 lg:col-span-4"
      }
    >
      <div className={titleContainerStyling}>
        <h3 className={titleStyling}>{title}</h3>
      </div>
      <p className={pStyling}>{value}</p>
    </section>
  );
};
