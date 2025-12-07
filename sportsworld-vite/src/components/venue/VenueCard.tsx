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

  const btnBase = "px-4 py-2 rounded text-white transition-all duration-200";
  const editBtn = `${btnBase} bg-blue-500 hover:bg-blue-600 inline-block text-center`;
  const deleteBtn = `${btnBase} bg-red-500 hover:bg-red-800`;

  // --- Logic ---
  const handleDelete = () => deleteVenueById(venue.id);

  const renderButtons = () => {
    if (!isManage) return null;

    return (
      <>
        <Link to={`/venues/${venue.id}`} className={editBtn}>
          Edit
        </Link>

        <button onClick={handleDelete} className={deleteBtn}>
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

        <div className="flex gap-2 mt-4">{renderButtons()}</div>
      </div>
    </div>
  );

  return renderJsx();
};
