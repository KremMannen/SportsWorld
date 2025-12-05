import type { FC } from "react";
import FighterList from "./FighterList";
import NavButton from "./NavButton";

// Lagde denne for å følge designen til figma
// Men ser at i figma måtte man gå en del utenfor marginen
// for å få plass, uteom å gjøre det blir kortene squished
// tror vi må droppe den designen, sletter ikke denne enda

export const DoubleFighterList: FC = () => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <FighterList filterType="owned" />
        <NavButton destination="/admin" />
      </div>
      <div className="col-span-12">
        <FighterList filterType="available" />
        <NavButton destination="/finances" />
      </div>
    </div>
  );
};
