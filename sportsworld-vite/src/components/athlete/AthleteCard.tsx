import { useContext, type FC, useState } from "react";
import type { IAthleteCardProps } from "../../interfaces/components/IAthleteCardProps.ts";
import { Link } from "react-router-dom";
import { AthleteContext } from "../../contexts/AthleteContext.tsx";
import type { IAthleteContext } from "../../interfaces/contexts/IAthleteContext.ts";
import { FinanceContext } from "../../contexts/FinanceContext.tsx";
import type { IFinanceContext } from "../../interfaces/contexts/IFinanceContext.ts";

// Modulær komponent som genererer forskjellige varianter (view, manage, finance) for mer DRY kode.
// TypeSafety for parameterene håndteres i IAthleteCardProps.
export const AthleteCard: FC<IAthleteCardProps> = ({
  athlete,
  variant,
  layoutVariant = "horizontal",
}) => {
  // Siden context-mønsteret allerede er implementert, unngår vi prop drilling ved å bruke context direkte
  const { updateAthlete, deleteAthleteById } = useContext(
    AthleteContext
  ) as IAthleteContext;
  const { finances, updateFinance } = useContext(
    FinanceContext
  ) as IFinanceContext;

  // Bekreftelses-state slik at brukeren må bekrefte sletting
  const [confirming, setConfirming] = useState(false);

  const isPurchased = athlete.purchased;
  const isManageOrFinance = variant === "manage" || variant === "finance";

  // Kort styling - varierer basert på purchased status og variant
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

  // Styling for delete-bekreftelse kortet
  const deleteCardClasses = `${baseCardClasses} bg-[#252828] text-white text-lg font-bold ${cardHeightClasses} ${cardGridClasses} border-1 border-red-600 shadow-black/60 scale-[1.05]`;

  const imageContainerClasses = isManageOrFinance ? "w-32 h-48" : "w-32 h-32";
  const viewCardHref = isPurchased ? "/admin" : "/finances";

  // Knapp styling
  const buttonBase =
    "w-full px-4 py-2 rounded transition-colors duration-200 text-white hover:bg-[#870000] hover:shadow cursor-pointer";
  const buttonPrimary = `${buttonBase} bg-black`;
  const buttonDelete = `${buttonBase} bg-[#4C0000]`;
  const buttonSell =
    isPurchased && variant === "finance" ? buttonDelete : buttonPrimary;

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

  // Delete-knappen åpner bekreftelse-popup i kortet
  const handleDeleteClick = () => setConfirming(true);
  const handleCancel = () => setConfirming(false);
  const handleConfirmDelete = () => {
    deleteAthleteById(athlete.id);
    setConfirming(false);
  };

  const renderButtons = () => {
    switch (variant) {
      case "view":
        return null;

      case "manage":
        if (confirming) {
          return (
            <div className="flex gap-2">
              <button onClick={handleConfirmDelete} className={buttonDelete}>
                Yes
              </button>
              <button onClick={handleCancel} className={buttonPrimary}>
                No
              </button>
            </div>
          );
        }

        return (
          <>
            <Link
              to={`/register/${athlete.id}`}
              className={`${buttonPrimary} text-center`}
            >
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

  const content = (
    <>
      <div className={imageContainerClasses}>
        <img
          src={`http://localhost:5110/images/AthleteImages/${athlete.image}`}
          alt={athlete.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold">{athlete.name}</h3>
          <p>Price: {athlete.price} $</p>
          <p>Gender: {athlete.gender}</p>
        </div>

        <div className="flex gap-2">{renderButtons()}</div>
      </div>
    </>
  );

  // Grid column span må håndteres her for å fungere med AthleteLists grid-col-12.
  // Vanligvis vil vi ha all column-logikk samlet i en komponent, men vi tillater dette for nå.
  const renderJsx = () => {
    if (confirming) {
      return (
        <article className={deleteCardClasses}>
          <div className="p-4 flex-1 flex flex-col justify-between">
            <p>Deleting: {athlete.name}. Are you sure?</p>
            {renderButtons()}
          </div>
        </article>
      );
    }

    if (variant === "view") {
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
