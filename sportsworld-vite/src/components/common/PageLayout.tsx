import type { FC } from "react";
import type { IProviderProps } from "../../interfaces/properties/IProviderProps";

// En enkel layout-komponent som sentrerer definering av padding og maks-bredde for innholdet.

export const PageLayout: FC<IProviderProps> = ({ children }) => {
  return (
    <main className="w-full bg-[#F6F8F7]">
      <div className="max-w-[1600px] mx-auto p-12">{children}</div>
    </main>
  );
};
