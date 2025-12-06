import { useContext, type FC } from "react";
import type { IAthleteCardProps } from "../../interfaces/properties/IAthleteCardProps.ts";
import { Link } from "react-router-dom";
import { AthleteContext } from "../../contexts/AthleteContext.tsx";
import type { IAthleteContext } from "../../interfaces/IAthleteContext.ts";
import { FinanceContext } from "../../contexts/FinanceContext.tsx";
import type { IFinanceContext } from "../../interfaces/IFinanceContext.ts";

// Vi ønsker en modulær AthleteCard komponent som kan generere de forskjellige variantene vi
// skisserte i prototype-fasen.
// På denne måten slipper vi å skrive 3 veldig like komponenter i henhold til DRY-prinsippet.
// Vi tar derfor en string som parameter i komponenten som bestemmer hvilke knapper som skal genereres i kortet.
// Hvordan vi håndterer TypeSafetyen til stringen forklares i IAthleteCardProps

export const AthleteCard: FC<IAthleteCardProps> = ({ athlete, variant }) => {
  // En løsning kunne vært å bruke callback funksjon og la parent komponenten håndtere oppdateringen av athlete.
  // Siden context mønsteret allerede er implementert, unngår vi den "prop drillingen" ved å bruke context direkte.
  const { updateAthlete } = useContext(AthleteContext) as IAthleteContext;
  const { finances, updateFinance } = useContext(
    FinanceContext
  ) as IFinanceContext;

  // Tailwind tilbyr å bruke egendefinerte farger med syntaxen under.
  // Dermed kan vi beholde farge palletten fra figma prototypen.
  const bgColor = athlete.purchased ? "bg-white" : "bg-[#3D4645]";
  const textColor = athlete.purchased ? "text-black" : "text-white";

  // viewCards onclick fører til forskjellige sider basert på om athlete er kjøpt eller ikke
  const viewCardHref = athlete.purchased ? "/admin" : "/finances";

  const buttonText = athlete.purchased ? "Sell Athlete" : "Sign Athlete";

  // Varierende høyde basert på om kortet skal vise knapper eller ikke.
  const cardHeight =
    variant === "manage" || variant === "finance" ? "h-48" : "h-32";
  const imageSize =
    variant === "manage" || variant === "finance" ? "w-32 h-48" : "w-32 h-32";

  // Knappstyling og hover effekt presets for knapper og kort, da kun kort på hovedsiden med viewcase skal ha synlig klikkbar effekt
  const cardHoverEffect =
    variant === "manage" || variant === "finance"
      ? "hover:shadow-black/40"
      : "hover:scale-[1.05] hover:shadow-black/40 hover:cursor-pointer";
  const buttonBase =
    athlete.purchased && variant === "finance"
      ? "bg-[#4C0000] w-full px-4 py-2 rounded transition-transform transition-shadow duration-200 transform text-white "
      : "bg-[#000000] w-full px-4 py-2 rounded transition-transform transition-shadow duration-200 transform text-white ";
  const buttonHover = "hover:shadow hover:cursor-pointer hover:bg-[#870000]";

  // --- Button handlers ---
  const handleFinanceClick = async () => {
    if (!finances) return;

    const updatedFinance = { ...finances };
    const updatedAthlete = { ...athlete, purchased: !athlete.purchased };

    if (athlete.purchased) {
      // Selger athlete
      updatedFinance.moneyLeft += athlete.price;
    } else {
      if (updatedFinance.moneyLeft < athlete.price) {
        alert("Insufficient funds to sign this athlete.");
        return;
      }
      // Kjøper athlete
      updatedFinance.moneyLeft -= athlete.price;
      updatedFinance.moneySpent += athlete.price;
    }

    await updateAthlete(updatedAthlete);

    await updateFinance(updatedFinance);
  };

  const handleEditClick = () => {};

  const handleDeleteClick = () => {};

  const renderButtons = () => {
    switch (variant) {
      case "view":
        return null;

      case "manage":
        return (
          <>
            <button
              type="button"
              onClick={() => handleEditClick()}
              className={`${buttonBase} ${buttonHover}`}
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() => handleDeleteClick()}
              className={`${buttonBase} ${buttonHover}`}
            >
              Delete
            </button>
          </>
        );

      case "finance":
        return (
          <button
            type="button"
            onClick={() => {
              handleFinanceClick();
            }}
            className={`${buttonBase} ${buttonHover} `}
          >
            {buttonText}
          </button>
        );

      default:
        return null;
    }
  };

  const cardContent = (
    <article
      className={`block col-span-12 sm:col-span-6 lg:flex-shrink-0 lg:w-[400px] xl:col-span-3 xl:w-auto transition-transform duration-200 ${cardHoverEffect} ${bgColor} rounded-lg shadow-md shadow-black/20 flex overflow-hidden ${cardHeight} w-full`}
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

  if (variant === "view") {
    return (
      <Link
        to={viewCardHref}
        className={`block col-span-12 sm:col-span-6 lg:flex-shrink-0 lg:w-[400px] xl:col-span-3 xl:w-auto transition-transform duration-200 ${cardHoverEffect}`}
      >
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};
