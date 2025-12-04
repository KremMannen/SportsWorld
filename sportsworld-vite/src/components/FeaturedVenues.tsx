import { useContext, type FC } from "react";
import { VenueContext } from "../contexts/VenueContext";
import type { IVenueContext } from "../interfaces/IVenueContext";
import type { IFeaturedVenuesProps } from "../interfaces/properties/IFeaturedVenuesProps";
import { VenueCard } from "./VenueCard";

export const FeaturedVenues: FC<IFeaturedVenuesProps> = () => {
  const { venues, errorMessage, isLoading } = useContext(
    VenueContext
  ) as IVenueContext;

  return (
    <div className="container px-4 py-8 max-w-[1600px] mx-auto">
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
        <div className="grid grid-cols-12 gap-6 lg:flex lg:flex-row lg:overflow-x-auto lg:gap-4 xl:grid xl:overflow-visible">
          {venues.slice(0, 4).map((venue) => (
            <VenueCard key={venue.id} venue={venue} variant="view" />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedVenues;
