import type { FC } from "react";
import type { IVenueCardProps } from "../../interfaces/properties/IVenueCardProps.ts";

export const VenueCard: FC<IVenueCardProps> = ({
  venue,
  variant,
  onEdit,
  onDelete,
}) => {
  // --- Knappstyling ---
  const buttonBase =
    "px-4 py-2 rounded text-white transition-colors duration-200";
  const editButtonStyling = `${buttonBase} bg-blue-500 hover:bg-blue-600`;
  const deleteButtonStyling = `${buttonBase} bg-red-500 hover:bg-red-600`;

  // --- Kortstyling ---
  const cardContainerStyling =
    "bg-[#252828] col-span-12 sm:col-span-6 lg:flex-shrink-0 lg:w-[400px] xl:col-span-3 xl:w-auto rounded-lg shadow-md shadow-black/20 overflow-hidden transition-transform duration-200 hover:scale-[1.05] hover:shadow-black/40 hover:cursor-pointer";
  const imageContainerStyling = "w-full h-40";
  const imageStyling = "w-full h-full object-cover";
  const textContainerStyling = "text-white p-4 flex flex-col justify-between";
  const titleStyling = "text-xl font-bold";
  const buttonContainerStyling = "flex gap-2 mt-4";

  const renderButtons = () => {
    switch (variant) {
      case "view":
        return null;

      case "manage":
        return (
          <>
            <button
              onClick={() => onEdit?.(venue)}
              className={editButtonStyling}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete?.(venue.id)}
              className={deleteButtonStyling}
            >
              Delete
            </button>
          </>
        );

      default:
        return null;
    }
  };

  const renderJsx = () => (
    <div className={cardContainerStyling}>
      <div className={imageContainerStyling}>
        <img
          src={`http://localhost:5110/images/VenueImages/${venue.image}`}
          alt={venue.name}
          className={imageStyling}
        />
      </div>

      <div className={textContainerStyling}>
        <div>
          <h3 className={titleStyling}>{venue.name}</h3>
          <p>Capacity: {venue.capacity}</p>
        </div>

        {/* Kondisjonelle knapper basert på variant parameteret */}
        <div className={buttonContainerStyling}>{renderButtons()}</div>
      </div>
    </div>
  );

  return renderJsx();
};
