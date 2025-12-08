import { useContext, type FC } from "react";
import { Link } from "react-router-dom";

import type { IVenueCardProps } from "../../interfaces/components/IVenueCardProps";
import type { IVenueContext } from "../../interfaces/contexts/IVenueContext";
import { VenueContext } from "../../contexts/VenueContext";

export const VenueCard: FC<IVenueCardProps> = ({ venue, variant }) => {
  const { deleteVenueById } = useContext(VenueContext) as IVenueContext;

  const isManage = variant === "manage";

  // --- Styling ---
  const cardHover = isManage ? "" : "hover:scale-[1.05] hover:cursor-pointer";

  const cardClasses = `
    bg-[#252828] text-white rounded-lg shadow-md shadow-black/20 overflow-hidden
    transition-transform duration-200 col-span-12 sm:col-span-6 
    lg:flex-shrink-0 lg:w-[400px] xl:col-span-3 xl:w-auto
    ${cardHover}
  `;

  // ---Knappstyling---
  const buttonBase =
    "w-full px-4 py-2 rounded transition duration-200 text-white";
  const buttonColor = "bg-black";
  const deleteButtonColor = "bg-[#4C0000]";
  const buttonHover = "hover:bg-[#870000] hover:shadow hover:cursor-pointer";
  const buttonContainerStyling = "flex gap-2 pt-2";

  // --- Logic ---
  const handleDelete = () => deleteVenueById(venue.id);

const renderButtons = () => {
    if (!isManage) return;

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
          onClick={handleDelete}
          className={`${buttonBase} ${buttonHover} ${deleteButtonColor}`}
        >
          Delete
        </button>
      </>
    );
  };

  // --- Render handler ---
  const renderJsx = () => (
    <div className={cardClasses}>
      <div className="w-full h-40">
        <img
          src={`http://localhost:5110/images/VenueImages/${venue.image}`}
          alt={venue.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold">{venue.name}</h3>
          <p>Capacity: {venue.capacity}</p>
        </div>

        <div className={buttonContainerStyling}>{renderButtons()}</div>
      </div>
    </div>
  );

  return renderJsx();
};
