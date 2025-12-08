import { useContext, type FC } from "react";
import { AthleteCard } from "./AthleteCard";
import { AthleteContext } from "../../contexts/AthleteContext";
import type { IAthleteContext } from "../../interfaces/contexts/IAthleteContext";
import type { IAthleteListProps } from "../../interfaces/components/IAthleteListProps";

export const AthleteList: FC<IAthleteListProps> = ({
  filterType = "all",
  cardVariant = "view",
}) => {
  const { athletes, athleteErrorMessage, athleteIsLoading } = useContext(
    AthleteContext
  ) as IAthleteContext;

  // --- Styling variables ---
  const titleStyling = "text-3xl font-bold mb-6 pl-4";
  const loadingContainerStyling = "flex justify-center items-center py-12";
  const loadingTextStyling = "text-gray-500 text-lg";
  const errorContainerStyling =
    "bg-red-50 border border-red-400 text-red-700 px-4 py-3 mb-10 rounded";
  const cardsContainerBaseStyling = "grid grid-cols-12 gap-6 p-4 mb-8";
  const cardsContainerLgStyling =
    "lg:flex lg:flex-row lg:overflow-x-auto lg:gap-4 lg:p-4";
  const cardsContainerXlStyling = "xl:grid xl:overflow-visible xl:p-4";

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

  const renderJsx = () => {
    if (athleteIsLoading) {
      return (
        <div className={loadingContainerStyling}>
          <div className={loadingTextStyling}>Loading fighters...</div>
        </div>
      );
    }

    if (athleteErrorMessage || filteredAthletes.length === 0) {
      const errorMessage = athleteErrorMessage
        ? athleteErrorMessage
        : filterType === "owned"
        ? "No fighters signed yet"
        : "No fighters available";

      return (
        <div className={errorContainerStyling}>
          <p>{errorMessage}</p>
        </div>
      );
    }

    const cardsContainerStyling = `${cardsContainerBaseStyling} ${cardsContainerLgStyling} ${cardsContainerXlStyling}`;

    return (
      <>
        <h2 className={titleStyling}>{displayTitle}</h2>
        <div className={cardsContainerStyling}>
          {filteredAthletes.map((athlete) => (
            <AthleteCard
              key={athlete.id}
              athlete={athlete}
              variant={cardVariant}
            />
          ))}
        </div>
      </>
    );
  };

  return renderJsx();
};
