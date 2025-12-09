import {
  useContext,
  useEffect,
  useState,
  type ChangeEvent,
  type FC,
  type FormEvent,
} from "react";

import { Link, useParams } from "react-router-dom";
import { VenueContext } from "../../contexts/VenueContext";
import type { IVenueContext } from "../../interfaces/contexts/IVenueContext";

export const VenueRegister: FC = () => {
  const { venues, addVenue, updateVenue, isLoading, errorMessage } = useContext(
    VenueContext
  ) as IVenueContext;

  const { venueId } = useParams<{ venueId: string }>();

  const isEditMode = venueId !== undefined;
  const venue = isEditMode
    ? venues.find((v) => v.id === Number(venueId))
    : undefined;

  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (venue === undefined) {
      if (!name || !capacity || !image) {
        alert("Please fill in all fields.");
        return;
      }
      const newVenue = {
        name,
        capacity: Number(capacity),
        image,
      };
      await addVenue(newVenue, image);
    } else {
      // image kan være tom, da beholdes gamle bildet
      if (!name || !capacity) {
        alert("Please fill in all fields.");
        return;
      }
      const updatedVenue = {
        id: venue.id,
        name,
        capacity: Number(capacity),
        image: venue.image,
      };
      if (image) {
        await updateVenue(updatedVenue, image);
      } else {
        await updateVenue(updatedVenue);
      }
    }

    setName("");
    setImage(null);
    setCapacity("");
  };

  // --- Tailwind styling variabler ---
  const containerStyling = "p-4";
  const titleContainerStyling =
    "rounded-sm shadow-md shadow-black/40 px-4 py-2 bg-black text-black w-full gap-6";
  const titleStyling = "text-md text-white";
  const inputStyling =
    "flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4C0000] min-w-0";
  const buttonStyling =
    "bg-[#4C0000] text-white px-6 py-2 rounded font-bold hover:shadow hover:cursor-pointer hover:bg-[#870000] mb-8";
  const formContainerStyling = "flex flex-col gap-4 mt-4";
  const errorContainerStyling =
    "bg-red-50 border border-red-400 text-red-700 px-4 py-3 mb-10 rounded";
  const loadingContainerStyling = "flex justify-center items-center py-12";
  const loadingTextStyling = "text-gray-500 text-lg";

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files != null) {
      setImage(files[0]);
    }
  };

  useEffect(() => {
    if (venue) {
      setName(venue.name);
      setCapacity(venue.capacity.toString());
    } else if (!isEditMode) {
      setName("");
      setImage(null);
      setCapacity("");
      setImage(null);
    }
  }, [venue, isEditMode]);

  const renderJsx = () => {
    if (isEditMode) {
      const idNumber = Number(venueId);
      if (isNaN(idNumber)) {
        return (
          <article className={errorContainerStyling}>
            <p>Invalid id</p>
            <Link to="/venues">Back</Link>
          </article>
        );
      }
      if (!venue || venue === undefined) {
        return (
          <article className={errorContainerStyling}>
            <p>Venue not found</p>
            <Link to="/venues">Back</Link>
          </article>
        );
      }
    }

    if (isLoading) {
      return (
        <div className={loadingContainerStyling}>
          <p className={loadingTextStyling}>Loading athletes...</p>
        </div>
      );
    }

    if (errorMessage) {
      return (
        <div className={errorContainerStyling}>
          <p>{errorMessage}</p>
        </div>
      );
    }

    return (
      <div className={containerStyling}>
        <div className={titleContainerStyling}>
          <h3 className={titleStyling}>
            {isEditMode ? "Edit Venue" : "Register New Venue"}
          </h3>
        </div>

        <form className={formContainerStyling} onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            className={inputStyling}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Capacity"
            value={capacity}
            className={inputStyling}
            onChange={(e) => setCapacity(e.target.value)}
          />

          <input
            type="file"
            onChange={handleImageChange}
            className="px-4 py-2 border border-gray-300 rounded cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#4C0000] file:text-white file:cursor-pointer hover:file:bg-[#870000]"
            accept="image/*"
          />

          <button type="submit" className={buttonStyling}>
            {isEditMode ? "Update Venue" : "Register Venue"}
          </button>
        </form>
      </div>
    );
  };

  return renderJsx();
};
