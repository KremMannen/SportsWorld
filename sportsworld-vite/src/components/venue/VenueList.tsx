import { useContext, type FC } from "react";
import { VenueContext } from "../../contexts/VenueContext";
import type { IVenueContext } from "../../interfaces/contexts/IVenueContext";
import type { IVenueListProps } from "../../interfaces/components/IVenueListProps";
import { VenueCard } from "./VenueCard";

export const VenueList: FC<IVenueListProps> = ({
  cardVariant = "view",
  isLimited = false,
}) => {
  const { venues, errorMessage, isLoading } = useContext(
    VenueContext
  ) as IVenueContext;

  // --- Styling variabler ---
  const titleStyling = "text-3xl font-bold mb-6";
  const loadingContainerStyling = "flex justify-center items-center py-12";
  const loadingTextStyling = "text-gray-500 text-lg";
  const errorContainerStyling =
    "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded";
  const errorTitleStyling = "font-medium";
  const cardGridStyling =
    "grid grid-cols-12 gap-6 p-2 lg:flex lg:flex-row lg:overflow-x-auto lg:gap-4 lg:py-2 xl:grid xl:overflow-visible xl:p-2";

  let displayTitle;
  switch (cardVariant) {
    case "view":
      displayTitle = "Featured venues";
      break;
    case "manage":
      displayTitle = "All venues";
      break;
    default:
      displayTitle = "All venues";
      break;
  }

  const renderJsx = () => {
    // Innhold laster inn
    if (isLoading) {
      return (
        <div className={loadingContainerStyling}>
          <div className={loadingTextStyling}>Loading venues...</div>
        </div>
      );
    }

    // Feilmelding eller tom liste
    if (errorMessage || venues.length === 0) {
      return (
        <div className={errorContainerStyling}>
          <p className={errorTitleStyling}>Error:</p>
          <p>{errorMessage || "No venues available"}</p>
        </div>
      );
    }

    // Viser kun 4 venue-cards
    if (isLimited) {
      return (
        <>
          <h2 className={titleStyling}>{displayTitle}</h2>
          <div className={cardGridStyling}>
            {venues.slice(0, 4).map((venue) => (
              <VenueCard key={venue.id} venue={venue} variant={cardVariant} />
            ))}
          </div>
        </>
      );
    }
    return (
      <>
        <h2 className={titleStyling}>{displayTitle}</h2>
        <div className={cardGridStyling}>
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} variant={cardVariant} />
          ))}
        </div>
      </>
    );
  };

  return renderJsx();
};
