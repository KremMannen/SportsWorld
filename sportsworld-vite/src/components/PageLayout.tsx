import type { FC } from "react";
import type { IPageLayoutProps } from "../interfaces/properties/IPageLayoutProps";

// En enkel layout-komponent som sentrerer definering av padding og maks-bredde for innholdet.

export const PageLayout: FC<IPageLayoutProps> = ({ children }) => {
  return (
    <main className="container max-w-[1600px] mx-auto p-12">{children}</main>
  );
};
