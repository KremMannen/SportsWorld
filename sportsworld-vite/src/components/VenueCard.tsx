import type { FC } from "react";
import type { IVenueCardProps } from "../interfaces/IVenueCard.ts";

export const VenueCard: FC<IVenueCardProps> = ({
  venue,
  variant,
  onEdit,
  onDelete,
}) => {
  const renderButtons = () => {
    switch (variant) {
      case "view":
        return null;

      case "manage":
        return (
          <>
            <button
              onClick={() => onEdit?.(venue)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete?.(venue.id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </>
        );

      default:
        return null;
    }
  };

return (
    <div className="bg-[#252828] col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3 rounded-lg shadow-md shadow-black/20 
                      overflow-hidden transition-transform duration-200 hover:scale-[1.05] hover:shadow-black/40 hover:cursor-pointer">
      <div className="w-full h-48">
        <img
          src={`http://localhost:5110/images/VenueImages/${venue.image}`}
          alt={venue.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="text-white p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold">{venue.name}</h3>
          <p>Capacity: {venue.capacity}</p>
        </div>

        {/* Kondisjonelle knapper basert på variant parameteret */}
        <div className="flex gap-2 mt-4">{renderButtons()}</div>
      </div>
    </div>
  );
};
