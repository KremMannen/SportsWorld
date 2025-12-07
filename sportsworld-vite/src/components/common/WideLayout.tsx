import type { FC } from "react";
import type { IProviderProps } from "../../interfaces/components/IProviderProps";

// Layout for alt hovedinnhold.
export const WideLayout: FC<IProviderProps> = ({ children }) => {
  return (
    // Setter bakgrunnsfargen
    <main className="bg-[#F2F2F2]">
      {/* Setter padding, maksbredde og automargin:

      |---- auto m ----| [ ---- sideinnhold ---- ] |---- auto m ----|
      
      */}
      <div className="max-w-[1600px] mx-auto p-12 ">{children}</div>
    </main>
  );
};
