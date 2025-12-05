import type { FC } from "react";
import type { IAthleteCardProps } from "../interfaces/properties/IAthleteCardProps.ts";
import { Link } from "react-router-dom";


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

  // Varierende høyde basert på om kortet skal vise knapper eller ikke.
  const cardHeight = variant === "manage" || variant === "sign" ? "h-48" : "h-32";
  const imageSize = variant === "manage" || variant === "sign" ? "w-32 h-48" : "w-32 h-32";

  //Knappstyling og hover effekt presets for knapper og kort, da kun kort på hovedsiden med viewcase skal ha synlig klikkbar effekt
  const cardHoverEffect = variant === "manage" || variant === "sign" ? "hover:shadow-black/40" : "hover:scale-[1.05] hover:shadow-black/40 hover:cursor-pointer" ;
  const buttonBase = "px-4 py-2 rounded transition-transform transition-shadow duration-200 transform text-white ";
  const buttonHover = "hover:shadow hover:cursor-pointer hover:border border-red-600";

  // Linker kort til aktuelle pages. Your fighters sender deg til admin og available fighters sender deg til finances for å kjøpe
  const viewCardHref = athlete.purchased ? "/admin" : "/finances";

  const renderButtons = () => {
    switch (variant) {
      case "view":
        return null;

      case "manage":
        return (
          <>
            <button
              type="button"
              onClick={() => onEdit?.(athlete)}
              className={`${buttonBase} ${buttonHover} bg-black`}
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() => onDelete?.(athlete.id)}
              className={`${buttonBase} ${buttonHover} bg-[#4C0000]`}
            >
              Delete
            </button>
          </>
        );

      case "sign":
        if (athlete.purchased) return null;

        return (
          <button
            type="button"
            onClick={() => onSign?.(athlete)}
            className={`${buttonBase} ${buttonHover} bg-green-500 w-full`}
          >
            Sign to Team
          </button>
        );

      default:
        return null;
    }
  };

  const articleJSX = (
    <article
      className={`${bgColor} rounded-lg shadow-md shadow-black/20 flex overflow-hidden ${cardHeight} w-full`}
    >
      <div className={`${imageSize} flex-shrink-0`}>
        <img
          src={`http://localhost:5110/images/AthleteImages/${athlete.image}`}
          alt={athlete.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className={`${textColor} p-4 flex-1 flex flex-col justify-between`}>
        <div>
          <h3 className="text-xl font-bold">{athlete.name}</h3>
          <p>Price: {athlete.price} $</p>
          <p>Gender: {athlete.gender}</p>
        </div>

        <div className="flex gap-2">{renderButtons()}</div>
      </div>
    </article>
  );

  return variant === "view" ? (
    <Link
      to={viewCardHref}
      className={`block col-span-12 sm:col-span-6 lg:flex-shrink-0 lg:w-[400px] xl:col-span-3 xl:w-auto transition-transform duration-200 ${cardHoverEffect}`}
    >
      {articleJSX}
    </Link>
  ) : (
    <div
      className={`col-span-12 sm:col-span-6 lg:flex-shrink-0 lg:w-[400px] xl:col-span-3 xl:w-auto transition-transform duration-200 ${cardHoverEffect}`}
    >
      {articleJSX}
    </div>
  );
};
