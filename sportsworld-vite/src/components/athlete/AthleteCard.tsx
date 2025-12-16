import { useContext, type FC } from "react";
import type { IAthleteCardProps } from "../../interfaces/components/IAthleteCardProps.ts";
import { Link } from "react-router-dom";
import { AthleteContext } from "../../contexts/AthleteContext.tsx";
import type { IAthleteContext } from "../../interfaces/contexts/IAthleteContext.ts";
import { FinanceContext } from "../../contexts/FinanceContext.tsx";
import type { IFinanceContext } from "../../interfaces/contexts/IFinanceContext.ts";
import type { IFinance } from "../../interfaces/objects/IFinance.ts";
import type { IAthlete } from "../../interfaces/objects/IAthlete.ts";
import type {
  IAthleteResponseSingle,
  IDefaultResponse,
  IFinanceResponseSingle,
} from "../../interfaces/IServiceResponses.ts";

// Modulær komponent som genererer forskjellige varianter (view-, manage- og finance-cards) av athletes.
// Håndterer alle i en komponent ihht DRY.
// Typesafety-håndtering forklares i IAthleteCard.ts
export const AthleteCard: FC<IAthleteCardProps> = ({
  athlete,
  variant,
  layoutVariant = "horizontal",
  confirming = false,
  onConfirmingChange,
  onActionFeedback,
}) => {
  // Unngår prop drilling ved å bruke context direkte
  const { updateAthlete, deleteAthleteById } = useContext(
    AthleteContext
  ) as IAthleteContext;

  const { finances, updateFinance } = useContext(
    FinanceContext
  ) as IFinanceContext;

  // --- Card Styling ---
  const isManageOrFinance = variant === "manage" || variant === "finance";

  const baseCardClasses = "flex rounded-lg shadow-md overflow-hidden";
  const cardColorClasses = athlete.purchased
    ? "bg-white text-black"
    : "bg-[#3D4645] text-white";
  const cardHeightClasses = isManageOrFinance ? "h-48" : "h-32";
  const cardHoverClasses =
    variant === "view"
      ? "hover:scale-[1.05] hover:shadow-black/40"
      : "hover:shadow-black/40";

  const cardGridClasses =
    layoutVariant === "grid"
      ? "col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3"
      : "col-span-12 sm:col-span-6 lg:flex-shrink-0 lg:w-[400px] xl:col-span-3 xl:w-auto";

  const cardClasses = `${baseCardClasses} ${cardColorClasses} ${cardHeightClasses} ${cardHoverClasses} ${cardGridClasses} shadow-black/20`;
  const linkCardClasses = `${cardGridClasses}`;

  const imageContainerClasses = isManageOrFinance ? "w-32 h-48" : "w-32 h-32";
  const imageClasses = "w-full h-full object-cover";

  const contentContainerClasses = "p-4 flex-1 flex flex-col justify-between";
  const titleClasses = "text-xl font-bold";
  const buttonContainerClasses = "flex gap-2";

  const viewCardHref = athlete.purchased ? "/admin" : "/finances";

  // --- Confirm-Delete Styling ---
  const deleteContentClasses =
    "p-4 h-full w-full flex flex-col justify-center justify-between";
  const deleteTextClasses =
    "flex-1 flex items-center justify-center text-center font-bold text-white text-lg";
  const deleteCardClasses = `${baseCardClasses} bg-[#252828]  ${cardHeightClasses} ${cardGridClasses} border-1 border-red-600 shadow-black/60 scale-[1.05]`;

  // --- Button Styling ---
  const buttonBase =
    "w-full px-4 py-2 rounded transition-colors duration-200 text-white hover:bg-[#870000] hover:shadow cursor-pointer";
  const buttonPrimary = `${buttonBase} bg-black`;
  const buttonDelete = `${buttonBase} bg-[#4C0000]`;
  const buttonSell =
    athlete.purchased && variant === "finance" ? buttonDelete : buttonPrimary;
  const buttonLink = `${buttonPrimary} text-center`;

  // --- Knapp handlers ---
  const handleFinanceClick = async () => {
    if (!finances) return;

    const updatedFinance: IFinance = { ...finances };
    const updatedAthlete: IAthlete = {
      ...athlete,
      purchased: !athlete.purchased,
    };

    if (athlete.purchased) {
      updatedFinance.moneyLeft += athlete.price;
      const updateAthleteResponse: IAthleteResponseSingle = await updateAthlete(
        updatedAthlete
      );
      const updateFinanceResponse: IFinanceResponseSingle = await updateFinance(
        updatedFinance
      );

      if (updateAthleteResponse.success && updateFinanceResponse.success) {
        onActionFeedback?.(`${athlete.name} successfully sold`);
      } else {
        onActionFeedback?.(`Failed to sell ${athlete.name}`);
      }
      return;
    }

    if (updatedFinance.moneyLeft < athlete.price) {
      onActionFeedback?.(
        `Insufficient funds. Missing ${(
          athlete.price - updatedFinance.moneyLeft
        ).toLocaleString()} $`
      );
      return;
    }

    updatedFinance.moneyLeft -= athlete.price;
    updatedFinance.moneySpent += athlete.price;

    const updateAthleteResponse: IAthleteResponseSingle = await updateAthlete(
      updatedAthlete
    );
    const updateFinanceResponse: IFinanceResponseSingle = await updateFinance(
      updatedFinance
    );
    if (updateAthleteResponse.success && updateFinanceResponse.success) {
      onActionFeedback?.(`${athlete.name} successfully signed`);
    } else {
      onActionFeedback?.(`Failed to sign ${athlete.name}`);
    }
  };
  // Gir bruker bekreftelses vindu før sletting.
  const handleDeleteClick = () => {
    onConfirmingChange?.(true);
    onActionFeedback?.("");
  };

  // Kansellere handling
  const handleCancel = () => {
    onConfirmingChange?.(false);
    onActionFeedback?.("Cancelled deleting athlete.");
  };

  // Gjennomfør sletting
  const handleConfirmDelete = async () => {
    const deleteResponse: IDefaultResponse = await deleteAthleteById(
      athlete.id
    );
    onConfirmingChange?.(false);

    if (deleteResponse.success) {
      onActionFeedback?.(`${athlete.name} successfully deleted`);
    } else {
      onActionFeedback?.(`Failed to delete ${athlete.name}`);
    }
  };

  const renderJsx = () => {
    // Generer knapper basert på variant
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
              <Link
                to={`/register/${athlete.id}`}
                className={buttonLink}
                onClick={() => onActionFeedback?.("")}
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

        // Finance-variant kort (sign og sell knapper)
        case "finance":
          return (
            <button
              type="button"
              onClick={handleFinanceClick}
              className={buttonSell}
            >
              {athlete.purchased ? "Sell Athlete" : "Sign Athlete"}
            </button>
          );

        default:
          return null;
      }
    };

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

    // Generer athlete kort innhold
    const renderContent = () => (
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
            <p>Price: {athlete.price.toLocaleString()} $</p>
            <p>Gender: {athlete.gender}</p>
          </div>

          <div className={buttonContainerClasses}>{renderButtons()}</div>
        </div>
      </>
    );

    // View-varianten skal være clickable, trenger link-wrapper
    if (variant === "view") {
      // Grid column span (cardClasses) må settes på ytterste element for å svare AthleteLists grid-col-12.
      // Vanligvis er column-logikk samlet i en komponent, men vi tillater dette siden AthleteCard alltid er child av AthleteList
      return (
        <Link to={viewCardHref} className={linkCardClasses}>
          <article className={cardClasses}>{renderContent()}</article>
        </Link>
      );
    } else {
      return <article className={cardClasses}>{renderContent()}</article>;
    }
  };

  return renderJsx();
};
