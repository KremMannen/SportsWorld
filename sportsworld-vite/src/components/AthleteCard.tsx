import type { FC } from "react";
import type { IAthleteCardProps } from "../interfaces/properties/IAthleteCardProps.ts";

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
  // Tailwind tilbyr å bruke egendefinerte farger med syntaxen under.
  // Dermed kan vi beholde farge palletten fra figma prototypen.
  const bgColor = athlete.purchased ? "bg-green-100" : "bg-[#3D4645]";
  const textColor = athlete.purchased ? "text-black" : "text-white";

  const renderButtons = () => {
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
    <div className={`${bgColor} rounded-lg shadow-md flex overflow-hidden`}>
      <img
        src={`http://localhost:5110/images/AthleteImages/${athlete.image}`}
        alt={athlete.name}
        className="w-1/3 object-cover"
      />

      <div className={`${textColor} p-4 flex-1 flex flex-col justify-between`}>
        <div>
          <h3 className="text-xl font-bold">{athlete.name}</h3>
          <p>Price: {athlete.price} $</p>
          <p>Gender: {athlete.gender}</p>
        </div>

        <div className="flex gap-2">{renderButtons()}</div>
      </div>
    </div>
  );
};
