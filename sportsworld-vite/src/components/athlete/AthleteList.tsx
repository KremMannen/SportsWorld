import { useContext, type FC } from "react";
import { AthleteCard } from "./AthleteCard";
import { AthleteContext } from "../../contexts/AthleteContext";
import type { IAthleteContext } from "../../interfaces/IAthleteContext";
import type { IAthleteListProps } from "../../interfaces/properties/IAthleteListProps";

export const AthleteList: FC<IAthleteListProps> = ({
  filterType = "all",
  cardVariant = "view",
}) => {
  const { athletes, athleteErrorMessage, athleteIsLoading } = useContext(
    AthleteContext
  ) as IAthleteContext;

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
      displayTitle = "Fighters in your arsenal";
      break;
    case "available":
      displayTitle = "Available Fighters";
      break;
    case "all":
    default:
      displayTitle = "All Fighters";
      break;
  }

  return (
    <>
      <h2 className="text-3xl font-bold mb-6">{displayTitle}</h2>

      {/* Innhold laster inn */}
      {athleteIsLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500 text-lg">Loading fighters...</div>
        </div>
      ) : athleteErrorMessage || filteredAthletes.length === 0 ? (
        /* Dynamisk feilmelding som sjekker om noe gikk galt, og hvis listen bare er tom: bruker filterType for å gi presis beskjed til bruker */
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>
            {athleteErrorMessage
              ? athleteErrorMessage
              : filterType === "owned"
              ? "No fighters signed yet"
              : "No fighters available"}
          </p>
        </div>
      ) : (
        /* Viser athlete-cards */
        <div className="grid grid-cols-12 gap-6 p-2  lg:flex lg:flex-row lg:overflow-x-auto lg:gap-4 lg:py-2 xl:grid xl:overflow-visible xl:p-2 mb-8">
          {filteredAthletes.map((athlete) => (
            <AthleteCard
              key={athlete.id}
              athlete={athlete}
              variant={cardVariant}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default AthleteList;
