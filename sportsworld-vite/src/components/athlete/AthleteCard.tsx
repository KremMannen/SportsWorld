import { useContext, type FC } from "react";
import type { IAthleteCardProps } from "../../interfaces/components/IAthleteCardProps.ts";
import { Link } from "react-router-dom";
import { AthleteContext } from "../../contexts/AthleteContext.tsx";
import type { IAthleteContext } from "../../interfaces/contexts/IAthleteContext.ts";
import { FinanceContext } from "../../contexts/FinanceContext.tsx";
import type { IFinanceContext } from "../../interfaces/contexts/IFinanceContext.ts";

// Modulær komponent som genererer forskjellige varianter (view-, manage- og finance-cards) av athletes.
// Håndterer alle i en komponent ihht DRY.
// Typesafety-håndtering forklares i IAthleteCard.ts
export const AthleteCard: FC<IAthleteCardProps> = ({
  athlete,
  variant,
  layoutVariant = "horizontal",
  confirming = false,
  onConfirmingChange,
}) => {
  // Unngår prop drilling ved å bruke context direkte
  const { updateAthlete, deleteAthleteById } = useContext(
    AthleteContext
  ) as IAthleteContext;

  const { finances, updateFinance } = useContext(
    FinanceContext
  ) as IFinanceContext;

  const isPurchased = athlete.purchased;
  const isManageOrFinance = variant === "manage" || variant === "finance";

  // --- Card Styling ---
  const baseCardClasses = "flex rounded-lg shadow-md overflow-hidden";
  const cardColorClasses = isPurchased
    ? "bg-white text-black"
    : "bg-[#3D4645] text-white";
  const cardHeightClasses = isManageOrFinance ? "h-48" : "h-32";
  const cardHoverClasses =
    variant === "view"
      ? "hover:scale-[1.05] hover:shadow-black/40"
      : "hover:shadow-black/40";

  // Grid layout for admin page vs horizontal scroll for andre pages
  const cardGridClasses =
    layoutVariant === "grid"
      ? "col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3"
      : "col-span-12 sm:col-span-6 lg:flex-shrink-0 lg:w-[400px] xl:col-span-3 xl:w-auto";

  const cardClasses = `${baseCardClasses} ${cardColorClasses} ${cardHeightClasses} ${cardHoverClasses} ${cardGridClasses} shadow-black/20`;

  const imageContainerClasses = isManageOrFinance ? "w-32 h-48" : "w-32 h-32";
  const imageClasses = "w-full h-full object-cover";

  const contentContainerClasses = "p-4 flex-1 flex flex-col justify-between";
  const titleClasses = "text-xl font-bold";
  const buttonContainerClasses = "flex gap-2";

  const viewCardHref = isPurchased ? "/admin" : "/finances";

  // --- Separate stylinger for bekreftelses-kortet til delete-knappen  ---
  const deleteContentClasses = "p-4 h-full flex flex-col justify-between";
  const deleteTextClasses =
    "flex-1 flex items-center justify-center text-center";
  const deleteCardClasses = `${baseCardClasses} bg-[#252828] text-white text-lg ${cardHeightClasses} ${cardGridClasses} border-1 border-red-600 shadow-black/60 scale-[1.05]`;

  // --- Button Styling ---
  const buttonBase =
    "w-full px-4 py-2 rounded transition-colors duration-200 text-white hover:bg-[#870000] hover:shadow cursor-pointer";
  const buttonPrimary = `${buttonBase} bg-black`;
  const buttonDelete = `${buttonBase} bg-[#4C0000]`;
  const buttonSell =
    isPurchased && variant === "finance" ? buttonDelete : buttonPrimary;
  const buttonLink = `${buttonPrimary} text-center`;

  // --- Knapp handlers ---
  const handleFinanceClick = async () => {
    if (!finances) return;

    const updatedFinance = { ...finances };
    const updatedAthlete = { ...athlete, purchased: !isPurchased };

    if (isPurchased) {
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
  // Sjekker onConfirmingChange i renderJsx og gir bruker et bekreftelses vindu før sletting.
  const handleDeleteClick = () => onConfirmingChange?.(true);
  // Kansellere handling
  const handleCancel = () => onConfirmingChange?.(false);

  const handleConfirmDelete = () => {
    deleteAthleteById(athlete.id);
    onConfirmingChange?.(false);
  };

  const renderButtons = () => {
    switch (variant) {
      case "view":
        return null;

      case "manage":
        // Bekreftelses vindu for sletting
        if (confirming) {
          return (
            <div className={buttonContainerClasses}>
              <button onClick={handleConfirmDelete} className={buttonDelete}>
                Yes
              </button>
              <button onClick={handleCancel} className={buttonPrimary}>
                No
              </button>
            </div>
          );
        }

        // Manage-variant kort (edit og delete knapper)
        return (
          <>
            <Link to={`/register/${athlete.id}`} className={buttonLink}>
              Edit
            </Link>
            <button
              type="button"
              onClick={handleDeleteClick}
              className={buttonDelete}
            >
              Delete
            </button>
          </>
        );

      // Finance-variant kort (sign og sell knapper)
      case "finance":
        return (
          <button
            type="button"
            onClick={handleFinanceClick}
            className={buttonSell}
          >
            {isPurchased ? "Sell Athlete" : "Sign Athlete"}
          </button>
        );

      default:
        return null;
    }
  };

  // Athlete Kortet
  const content = (
    <>
      <div className={imageContainerClasses}>
        <img
          src={`http://localhost:5110/images/AthleteImages/${athlete.image}`}
          alt={athlete.name}
          className={imageClasses}
        />
      </div>

      <div className={contentContainerClasses}>
        <div>
          <h3 className={titleClasses}>{athlete.name}</h3>
          <p>Price: {athlete.price} $</p>
          <p>Gender: {athlete.gender}</p>
        </div>

        <div className={buttonContainerClasses}>{renderButtons()}</div>
      </div>
    </>
  );

  const renderJsx = () => {
    // Sjekker først om vi skal vise confirmdelete vindu
    if (confirming) {
      return (
        <article className={deleteCardClasses}>
          <div className={deleteContentClasses}>
            <p className={deleteTextClasses}>
              Deleting: {athlete.name}. Are you sure?
            </p>
            {renderButtons()}
          </div>
        </article>
      );
    }

    // View-varianten skal være clickable, trenger link-wrapper
    if (variant === "view") {
      // Grid column span (cardClasses) må settes på ytterste element for å svare AthleteLists grid-col-12.
      // Vanligvis er column-logikk samlet i en komponent, men vi tillater dette siden AthleteCard alltid er child av AthleteList
      return (
        <Link to={viewCardHref} className={cardClasses}>
          {content}
        </Link>
      );
    } else {
      return <article className={cardClasses}>{content}</article>;
    }
  };

  return renderJsx();
};
