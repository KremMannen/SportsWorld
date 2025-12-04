import { useContext, type FC } from "react";
import { AthleteCard } from "./AthleteCard";
import { AthleteContext } from "../contexts/AthleteContext";
import type { IAthleteContext } from "../interfaces/IAthleteContext";
import type { IFeaturedFightersProps } from "../interfaces/properties/IFeaturedFightersProps";

export const FeaturedFighters: FC<IFeaturedFightersProps> = () => {
  const { athletes, errorMessage, isLoading } = useContext(
    AthleteContext
  ) as IAthleteContext;

  return (
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Featured Fighters</h2>

      {/* Innhold laster inn */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500 text-lg">Loading fighters...</div>
        </div>
      ) : errorMessage || athletes.length === 0 ? (
        /* Feilmelding. Om noe gikk galt vises errorMessage fra context, om ikke informeres det bare om at det ikke er noen fighters tilgjengelig (tom database feks)*/
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error:</p>
          <p>{errorMessage || "No fighters available"}</p>
        </div>
      ) : (
        /* Viser athlete-cards */
        <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-center">
          {athletes.map((athlete) => (
            <AthleteCard key={athlete.id} athlete={athlete} variant="view" />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedFighters;
