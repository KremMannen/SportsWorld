import { useContext, type FC } from "react";
import { Link } from "react-router-dom";

import type { IVenueCardProps } from "../../interfaces/components/IVenueCardProps";
import type { IVenueContext } from "../../interfaces/contexts/IVenueContext";
import { VenueContext } from "../../contexts/VenueContext";

export const VenueCard: FC<IVenueCardProps> = ({
  venue,
  variant,
  layoutVariant = "horizontal",
  confirming = false,
  onConfirmingChange,
  onActionFeedback,
}) => {
  const { deleteVenueById } = useContext(VenueContext) as IVenueContext;

  const isView = variant === "view";

  // --- Styling ---

  const baseCardClasses =
    "rounded-lg shadow-md overflow-hidden transition-transform duration-200";
  const cardColorClasses = "bg-[#252828] text-white";
  const cardHoverClasses = isView
    ? "hover:scale-[1.05] hover:cursor-pointer"
    : "";

  const cardGridSpan =
    layoutVariant === "grid"
      ? "col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3"
      : "col-span-12 sm:col-span-6 lg:flex-shrink-0 lg:w-[400px] xl:col-span-3 xl:w-auto";

  const cardClasses = `${baseCardClasses} ${cardColorClasses} ${cardGridSpan} ${cardHoverClasses} shadow-black/20`;

  const deleteCardClasses = `
    bg-[#252828] text-white text-lg font-bold rounded-lg shadow-md overflow-hidden
    border-1 border-red-600 shadow-black/60 scale-[1.05]
    ${cardGridSpan}
  `;

  const venueViewCardHref = "/venues";

  // --- Button styling ---
  const buttonBase =
    "w-full px-4 py-2 rounded transition duration-200 text-white";
  const buttonColor = "bg-black";
  const deleteButtonColor = "bg-[#4C0000]";
  const buttonHover = "hover:bg-[#870000] hover:shadow hover:cursor-pointer";
  const buttonContainerStyling = "flex gap-2 pt-2";

  // --- Content layout classes ---
  const imageContainerClasses = "w-full h-40";
  const imageClasses = "w-full h-full object-cover";
  const contentContainerClasses = "p-4 flex flex-col justify-between";
  const titleClasses = "text-xl font-bold";

  // --- Separate stylinger for bekreftelses-kortet til delete-knappen  ---
  const deleteContentClasses = "p-4 h-full flex flex-col justify-between";
  const deleteTextClasses =
    "flex-1 flex items-center justify-center text-center";

  // Delete-knappen åpner bekreftelse-popup i kortet
  // Knappene i popuppen kaller på deleteVenueById fra context, eller lukker staten og går tilbake til vanlig kort
  const handleDeleteClick = () => {
    onConfirmingChange?.(true);
  };
  const handleCancel = () => onConfirmingChange?.(false);
  const handleConfirmDelete = () => {
    deleteVenueById(venue.id);
    onActionFeedback?.(`${venue.name} successfully deleted`);
    onConfirmingChange?.(false);
  };

  const renderButtons = () => {
    switch (variant) {
      case "view":
        return null;

      case "manage":
        // Hvis bruker har trykket på delete-knappen vises knappene under i et nytt kort
        if (confirming) {
          return (
            <div className={buttonContainerStyling}>
              <button
                onClick={handleConfirmDelete}
                className={`${buttonBase} ${buttonHover} ${deleteButtonColor}`}
              >
                Yes
              </button>
              <button
                onClick={handleCancel}
                className={`${buttonBase} ${buttonHover} ${buttonColor}`}
              >
                No
              </button>
            </div>
          );
        }

        // Vanlig manage-variant kort så sant ingenting er trykket på
        return (
          <>
            <Link
              to={`/venues/${venue.id}`}
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

      default:
        return null;
    }
  };

  const content = (
    <>
      <div className={imageContainerClasses}>
        <img
          src={`http://localhost:5110/images/VenueImages/${venue.image}`}
          alt={venue.name}
          className={imageClasses}
        />
      </div>

      <div className={contentContainerClasses}>
        <div>
          <h3 className={titleClasses}>{venue.name}</h3>
          <p>Capacity: {venue.capacity.toLocaleString()}</p>
        </div>

        <div className={buttonContainerStyling}>{renderButtons()}</div>
      </div>
    </>
  );

  // Grid column span må håndteres her for å fungere med AthleteLists grid-col-12.
  // Vanligvis vil vi ha all column-logikk samlet i en komponent, men vi tillater dette for nå.
  const renderJsx = () => {
    if (confirming) {
      return (
        <article className={deleteCardClasses}>
          <div className={deleteContentClasses}>
            <p className={deleteTextClasses}>
              Deleting: {venue.name}. Are you sure?
            </p>
            {renderButtons()}
          </div>
        </article>
      );
    }

    if (variant === "view") {
      return (
        <Link to={venueViewCardHref} className={cardClasses}>
          {content}
        </Link>
      );
    } else {
      return <article className={cardClasses}>{content}</article>;
    }
  };

  return renderJsx();
};
