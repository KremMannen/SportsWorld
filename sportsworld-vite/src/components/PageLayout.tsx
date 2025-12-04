import type { FC } from "react";
import type { IPageLayoutProps } from "../interfaces/properties/IPageLayoutProps";

export const PageLayout: FC<IPageLayoutProps> = ({ children }) => {
  return <main className="container max-w-[1600px] mx-auto">{children}</main>;
};
