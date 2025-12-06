import { useContext, type FC } from "react";
import { VenueContext } from "../../contexts/VenueContext";
import type { IVenueContext } from "../../interfaces/IVenueContext";
import type { IVenueListProps } from "../../interfaces/properties/IVenueListProps";
import { VenueCard } from "./VenueCard";

export const VenueList: FC<IVenueListProps> = () => {
  const { venues, errorMessage, isLoading } = useContext(
    VenueContext
  ) as IVenueContext;

  return (
    <>
      <h2 className="text-3xl font-bold mb-6">Featured venues</h2>

      {/* Innhold laster inn */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500 text-lg">Loading venues...</div>
        </div>
      ) : errorMessage || venues.length === 0 ? (
        /* Feilmelding. Om noe gikk galt vises errorMessage fra context, om ikke informeres det bare om at det ikke er noen venues tilgjengelig (tom database feks)*/
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error:</p>
          <p>{errorMessage || "No venues available"}</p>
        </div>
      ) : (
        /* Viser venue-cards */
        <div className="grid grid-cols-12 gap-6 p-2 lg:flex lg:flex-row lg:overflow-x-auto lg:gap-4 lg:py-2 xl:grid xl:overflow-visible xl:p-2 ">
          {venues.slice(0, 4).map((venue) => (
            <VenueCard key={venue.id} venue={venue} variant="view" />
          ))}
        </div>
      )}
    </>
  );
};

export default VenueList;
