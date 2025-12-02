import type { IVenueCardProps } from "../interfaces/IVenueCard.ts";

export const VenueCard = ({
  venue,
  variant,
  onEdit,
  onDelete,
}: IVenueCardProps) => {
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
    <div className={`bg-green-100 rounded-lg p-4 shadow-md`}>
      <img
        src={`/images/AthleteImages/${venue.image}`}
        alt={venue.name}
        className="w-full h-48 object-cover rounded-md mb-3"
      />

      <h3 className="text-xl font-bold">{venue.name}</h3>
      <p>Capacity: {venue.capacity} $</p>

      {/* Kondisjonelle knapper basert på variant parameteret */}
      <div className="mt-4 flex gap-2">{renderButtons()}</div>
    </div>
  );
};
