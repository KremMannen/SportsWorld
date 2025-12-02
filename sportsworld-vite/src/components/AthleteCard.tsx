import type { IAthleteCardProps } from "../interfaces/IAthleteCard.ts";

export const AthleteCard = ({
  athlete,
  variant,
  onEdit,
  onDelete,
  onSign,
}: IAthleteCardProps) => {
  // Endrer bakgrunnsfarge ut ifra om de er kjøpt eller ikke
  const bgColor = athlete.purchased ? "bg-green-100" : "bg-gray-100";

  const renderButtons = () => {
    switch (variant) {
      case "view":
        return null;

      case "manage":
        return (
          <>
            <button
              onClick={() => onEdit?.(athlete)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete?.(athlete.id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </>
        );

      case "sign":
        return !athlete.purchased ? (
          <button
            onClick={() => onSign?.(athlete)}
            className="bg-green-500 text-white px-4 py-2 rounded w-full"
          >
            Sign to Team
          </button>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className={`${bgColor} rounded-lg p-4 shadow-md`}>
      <img
        src={`/images/AthleteImages/${athlete.image}`}
        alt={athlete.name}
        className="w-full h-48 object-cover rounded-md mb-3"
      />

      <h3 className="text-xl font-bold">{athlete.name}</h3>
      <p>Price: {athlete.price} kg</p>
      <p>Gender: {athlete.gender}</p>

      {/* Kondisjonelle knapper basert på variant parameteret */}
      <div className="mt-4 flex gap-2">{renderButtons()}</div>
    </div>
  );
};
