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
  // Siden context mønsteret allerede er implementert, unngår vi "prop drilling" ved å bruke context direkte.
  const { updateAthlete } = useContext(AthleteContext) as IAthleteContext;
  const { finances, updateFinance } = useContext(
    FinanceContext
  ) as IFinanceContext;

  // -------- Kort styling --------
  // Tailwind tilbyr å bruke egendefinerte farger med syntaxen under.
  // Dermed kan vi beholde farge palletten fra figma prototypen.
  const cardColor = athlete.purchased ? "bg-white" : "bg-[#3D4645]";
  const cardTextColor = athlete.purchased ? "text-black" : "text-white";
  const cardHoverEffect =
    variant === "manage" || variant === "finance"
      ? "hover:shadow-black/40"
      : "hover:scale-[1.05] hover:shadow-black/40 hover:cursor-pointer";

  // Varierende høyde basert på om kortet skal vise knapper eller ikke.
  const cardHeightStyling =
    variant === "manage" || variant === "finance" ? "h-48" : "h-32";
  const cardImageContainerStyling =
    variant === "manage" || variant === "finance" ? "w-32 h-48" : "w-32 h-32";

  const cardContainerStyling = `block col-span-12 sm:col-span-6 lg:flex-shrink-0 lg:w-[400px] xl:col-span-3 xl:w-auto transition-transform duration-200 ${cardHoverEffect} ${cardColor} rounded-lg shadow-md shadow-black/20 flex overflow-hidden ${cardHeightStyling} w-full`;
  const cardImageStyling = "w-full h-full object-cover";
  const cardContentContainerStyling =
    "p-4 flex-1 flex flex-col justify-between";

  const cardTitleStyling = "text-xl font-bold";

  // viewCards onclick fører til forskjellige sider basert på om athlete er kjøpt eller ikke
  const viewCardHref = athlete.purchased ? "/admin" : "/finances";

  // -------- Knappstyling --------
  const buttonBase =
    "w-full px-4 py-2 rounded transition-transform transition-shadow duration-200 transform text-white ";
  const buttonColor =
    athlete.purchased && variant === "finance"
      ? "bg-[#4C0000]"
      : "bg-[#000000]";
  const buttonHover = "hover:shadow hover:cursor-pointer hover:bg-[#870000]";
  const buttonText = athlete.purchased ? "Sell Athlete" : "Sign Athlete";
  const buttonContainerStyling = "flex gap-2";

  // -------- Knapp handlers --------
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
              className={`${buttonBase} ${buttonHover} ${buttonColor}`}
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() => handleDeleteClick()}
              className={`${buttonBase} ${buttonHover} ${buttonColor}`}
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
            className={`${buttonBase} ${buttonHover} ${buttonColor}`}
          >
            {buttonText}
          </button>
        );

      default:
        return null;
    }
  };

  const renderJsx = () => {
    const content = (
      <article className={cardContainerStyling}>
        <div className={`${cardImageContainerStyling}`}>
          <img
            src={`http://localhost:5110/images/AthleteImages/${athlete.image}`}
            alt={athlete.name}
            className={cardImageStyling}
          />
        </div>

        <div className={`${cardTextColor} ${cardContentContainerStyling}`}>
          <div>
            <h3 className={cardTitleStyling}>{athlete.name}</h3>
            <p>Price: {athlete.price} $</p>
            <p>Gender: {athlete.gender}</p>
          </div>

          <div className={buttonContainerStyling}>{renderButtons()}</div>
        </div>
      </article>
    );

    if (variant === "view") {
      return (
        <Link to={viewCardHref} className={cardContainerStyling}>
          {content}
        </Link>
      );
    }

    return content;
  };

  return renderJsx();
};
