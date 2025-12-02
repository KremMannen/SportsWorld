import type { FC } from "react";
import type { IAthleteCardProps } from "../interfaces/IAthleteCardProps.ts";

// Vi ønsker en modulær AthleteCard komponent som kan generere de forskjellige variantene vi
// skisserte i prototype-fasen.
// På denne måten slipper vi å skrive 3 veldig like komponenter i henhold til DRY-prinsippet.
// Vi tar derfor en string som parameter i komponenten som bestemmer hvilke knapper som skal genereres i kortet.
// Hvordan vi håndterer TypeSafetyen til stringen forklares i IAthleteCard

export const AthleteCard: FC<IAthleteCardProps> = ({
  athlete,
  variant,
  onEdit,
  onDelete,
  onSign,
}) => {
  // Endrer bakgrunnsfarge ut ifra om de er kjøpt eller ikke
  const bgColor = athlete.purchased ? "bg-green-100" : "bg-gray-100";

  const renderButtons = () => {
    // Bruker switch fremfor if. Representerer i større grad at variant skal være 1 av 3 muligheter.
    switch (variant) {
      case "view":
        return null;

      case "manage":
        return (
          <>
            <button
              onClick={() => onEdit?.(athlete)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete?.(athlete.id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </>
        );

      case "sign":
        if (athlete.purchased) return null;

        return (
          <button
            onClick={() => onSign?.(athlete)}
            className="bg-green-500 text-white px-4 py-2 rounded w-full"
          >
            Sign to Team
          </button>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`${bgColor} rounded-lg p-4 shadow-md`}>
      <img
        src={`/images/AthleteImages/${athlete.image}`}
        alt={athlete.name}
        className="w-full h-48 object-cover rounded-md mb-3"
      />

      <h3 className="text-xl font-bold">{athlete.name}</h3>
      <p>Price: {athlete.price} $</p>
      <p>Gender: {athlete.gender}</p>

      {/* Kondisjonelle knapper basert på variant parameteret */}
      <div className="mt-4 flex gap-2">{renderButtons()}</div>
    </div>
  );
};
