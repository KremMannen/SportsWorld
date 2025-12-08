import { useContext, type FC } from "react";
import type { IAthleteCardProps } from "../../interfaces/components/IAthleteCardProps.ts";
import { Link } from "react-router-dom";
import { AthleteContext } from "../../contexts/AthleteContext.tsx";
import type { IAthleteContext } from "../../interfaces/contexts/IAthleteContext.ts";
import { FinanceContext } from "../../contexts/FinanceContext.tsx";
import type { IFinanceContext } from "../../interfaces/contexts/IFinanceContext.ts";

// Vi ønsker en modulær AthleteCard komponent som kan generere de forskjellige variantene vi
// skisserte i prototype-fasen.
// På denne måten slipper vi å skrive 3 veldig like komponenter i henhold til DRY-prinsippet.
// Vi tar derfor en string som parameter i komponenten som bestemmer hvilke knapper som skal genereres i kortet.
// Hvordan vi håndterer TypeSafetyen til stringen forklares i IAthleteCardProps

export const AthleteCard: FC<IAthleteCardProps> = ({ athlete, variant, layoutVariant = "horizontal" }) => {
  // En løsning kunne vært å bruke callback funksjon og la parent komponenten håndtere oppdateringen av athlete.
  // Siden context mønsteret allerede er implementert, unngår vi "prop drilling" ved å bruke context direkte.
  const { updateAthlete, deleteAthleteById } = useContext(
    AthleteContext
  ) as IAthleteContext;
  const { finances, updateFinance } = useContext(
    FinanceContext
  ) as IFinanceContext;

  // -------- Kort styling --------
  const cardColor = athlete.purchased ? "bg-white" : "bg-[#3D4645]";
  const cardTextColor = athlete.purchased ? "text-black" : "text-white";

  const cardHoverEffect =
    variant === "manage" || variant === "finance"
      ? "hover:shadow-black/40"
      : "hover:scale-[1.05] hover:shadow-black/40";

  const cardHeight =
    variant === "manage" || variant === "finance" ? "h-48" : "h-32";
  const cardImageContainer =
    variant === "manage" || variant === "finance" ? "w-32 h-48" : "w-32 h-32";

    // Styler col-span for kort i grid på admin-page, som ikke skal ha horizontal row scrolling slik de andre pagene har
  const cardGridSpan = layoutVariant === "grid" 
    ? "col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3" // Kortene på admin page spanner nå 3 kolonner hver
    : "col-span-12 sm:col-span-6 lg:flex-shrink-0 lg:w-[400px] xl:col-span-3 xl:w-auto"; 

  // Container-klassene som sitter på elementet som er direkte child i grid.
  const cardContainerStyling = `flex ${cardGridSpan} ${cardHoverEffect} ${cardColor} rounded-lg shadow-md shadow-black/20 overflow-hidden ${cardHeight}`;

  const cardImageStyling = "w-full h-full object-cover";
  const cardContentContainerStyling =
    "p-4 flex-1 flex flex-col justify-between";

  const cardTitleStyling = "text-xl font-bold";
  const viewCardHref = athlete.purchased ? "/admin" : "/finances";

  // -------- Knappstyling --------
  const buttonBase =
    "w-full px-4 py-2 rounded transition duration-200 text-white";
  const buttonColor =
    athlete.purchased && variant === "finance" ? "bg-[#4C0000]" : "bg-black";
  const deleteButtonColor = "bg-[#4C0000]";

  const buttonHover = "hover:bg-[#870000] hover:shadow hover:cursor-pointer";
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

  const handleDeleteClick = () => {
    deleteAthleteById(athlete.id);
  };

  const renderButtons = () => {
    switch (variant) {
      case "view":
        return null;

      case "manage":
        return (
          <>
            <Link
              to={`/register/${athlete.id}`}
              className={`${buttonBase} ${buttonHover} ${buttonColor} text-center`}
            >
              Edit
            </Link>

            <button
              type="button"
              onClick={handleDeleteClick}
              className={`${buttonBase} ${buttonHover} ${deleteButtonColor}`}
            >
              Delete
            </button>
          </>
        );

      case "finance":
        return (
          <button
            type="button"
            onClick={handleFinanceClick}
            className={`${buttonBase} ${buttonHover} ${buttonColor}`}
          >
            {athlete.purchased ? "Sell Athlete" : "Sign Athlete"}
          </button>
        );

      default:
        return null;
    }
  };

  // Vi lager content uten de ytre grid-klassene slik at vi kan legge disse
  // på enten Link (for view) eller article (for ikke-view).
  const content = (
    <>
      <div className={cardImageContainer}>
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
    </>
  );

  // Det ytre elementet (Link eller article) må ha cardContainerStyling så grid-col-span fungerer.
  const renderJsx = () => {
    if (variant === "view") {
      return (
        <Link to={viewCardHref} className={`${cardContainerStyling} `}>
          {content}
        </Link>
      );
    } else {
      return <article className={cardContainerStyling}>{content}</article>;
    }
  };

  return renderJsx();
};
