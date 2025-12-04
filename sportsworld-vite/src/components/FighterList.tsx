import { useContext, type FC } from "react";
import { AthleteCard } from "./AthleteCard";
import { AthleteContext } from "../contexts/AthleteContext";
import type { IAthleteContext } from "../interfaces/IAthleteContext";
import type { IFighterListProps } from "../interfaces/properties/IFighterListProps";

export const FighterList: FC<IFighterListProps> = ({ filterType = "all" }) => {
  const { athletes, errorMessage, isLoading } = useContext(
    AthleteContext
  ) as IAthleteContext;

  // Todo: flytte filtrering til context?
  let filteredAthletes;
  switch (filterType) {
    case "owned":
      filteredAthletes = athletes.filter((athlete) => athlete.purchased);
      break;
    case "available":
      filteredAthletes = athletes.filter((athlete) => !athlete.purchased);
      break;
    case "all":
    default:
      filteredAthletes = athletes;
      break;
  }

  // Tittelen til listen bestemmer av filterType
  let displayTitle;
  switch (filterType) {
    case "owned":
      displayTitle = "Your Fighters";
      break;
    case "available":
      displayTitle = "Available Fighters";
      break;
    case "all":
    default:
      displayTitle = "Featured Fighters";
      break;
  }

  return (
    <div className="container px-4 py-8 max-w-[1600px] mx-auto">
      <h2 className="text-3xl font-bold mb-6">{displayTitle}</h2>

      {/* Innhold laster inn */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500 text-lg">Loading fighters...</div>
        </div>
      ) : errorMessage || filteredAthletes.length === 0 ? (
        /* Dynamisk feilmelding som sjekker om noe gikk galt, og hvis listen bare er tom: bruker filterType for å gi presis beskjed til bruker */
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>
            {errorMessage
              ? errorMessage
              : filterType === "owned"
              ? "No fighters signed yet"
              : "No fighters available"}
          </p>
        </div>
      ) : (
        /* Viser athlete-cards */
        <div className="grid grid-cols-12 gap-6 lg:flex lg:flex-row lg:overflow-x-auto lg:gap-4 xl:grid xl:overflow-visible">
          {filteredAthletes.map((athlete) => (
            <AthleteCard key={athlete.id} athlete={athlete} variant="view" />
          ))}
        </div>
      )}
    </div>
  );
};

export default FighterList;
