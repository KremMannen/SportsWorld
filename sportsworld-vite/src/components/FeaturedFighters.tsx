import { useContext, type FC } from "react";
import { AthleteCard } from "./AthleteCard";
import { AthleteContext } from "../contexts/AthleteContext";
import type { IAthleteContext } from "../interfaces/IAthleteContext";

export const FeaturedFighters: FC = () => {
  const { athletes, errorMessage } = useContext(
    AthleteContext
  ) as IAthleteContext;

  return (
    <div className="container px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Featured Fighters</h2>

      {/* Om contexts' errorMessage variabel ikke er tom, har det forekommet en feil og feilmelding vises. */}
      {errorMessage ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error:</p>
          <p>{errorMessage}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {athletes.map((athlete) => (
              <AthleteCard key={athlete.id} athlete={athlete} variant="view" />
            ))}
          </div>

          {/* Default feilmelding */}
          {athletes.length === 0 && (
            <p className="text-gray-500 py-8">No fighters available</p>
          )}
        </>
      )}
    </div>
  );
};

export default FeaturedFighters;
