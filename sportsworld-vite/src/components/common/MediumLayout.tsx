import type { FC } from "react";
import type { IProviderProps } from "../../interfaces/components/IProviderProps";

// Layout for seksjoner med smallere maksbredde
export const MediumLayout: FC<IProviderProps> = ({ children }) => {
  const portalContainerStyling = "max-w-[1000px] mx-auto";

  return <section className={portalContainerStyling}>{children}</section>;
};
