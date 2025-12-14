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
import type { IVenue } from "../../interfaces/objects/IVenue";
import type { IVenueResponseSingle } from "../../interfaces/IServiceResponses";

export const VenueRegister: FC = () => {
  const {
    venues,
    initError,
    hasInitialized,
    addVenue,
    updateVenue,
    isLoading,
  } = useContext(VenueContext) as IVenueContext;

  const { venueId } = useParams<{ venueId: string }>();
  const [name, setName] = useState<string>("");
  const [capacity, setCapacity] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);

  const [actionFeedback, setActionFeedback] = useState("");
  const [operationSuccess, setOperationSuccess] = useState<boolean | null>(
    true
  );
  const [operationError, setOperationError] = useState<string>("");

  const isEditMode: boolean = venueId !== undefined;
  const venue: IVenue | undefined = isEditMode
    ? venues.find((v) => v.id === Number(venueId))
    : undefined;

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setOperationSuccess(null);
    setActionFeedback("");
    setOperationError("");
    if (venue === undefined) {
      if (!name || !capacity || !image) {
        setActionFeedback("Please fill in all fields.");
        return;
      }
      const newVenue: Omit<IVenue, "image" | "id"> = {
        name,
        capacity: Number(capacity),
      };
      const response: IVenueResponseSingle = await addVenue(newVenue, image);
      if (response.success) {
        setActionFeedback(`Venue ${response.data?.name} successfully created `);
      }
      if (!response.success) {
        setActionFeedback(`Failed to create venue `);
      }
      setOperationSuccess(response.success);
      setOperationError(response.error ?? "");
    } else {
      // image kan være tom, da beholdes gamle bildet
      if (!name || !capacity) {
        setActionFeedback("Please fill in all fields.");
        return;
      }
      const updatedVenue: IVenue = {
        id: venue.id,
        name,
        capacity: Number(capacity),
        image: venue.image,
      };
      const updateResponse: IVenueResponseSingle = image
        ? await updateVenue(updatedVenue, image)
        : await updateVenue(updatedVenue);

      if (updateResponse.success) {
        setActionFeedback(
          `Venue ${updateResponse.data?.name} successfully updated `
        );
      } else if (!updateResponse.success) {
        setActionFeedback(`Venue failed to update`);
        setOperationError(updateResponse.error ?? "");
        setOperationSuccess(updateResponse.success);
      }

      setOperationSuccess(updateResponse.success);
      setOperationError(updateResponse.error ?? "");
    }
    setName("");
    setImage(null);
    setCapacity("");
  };

  // --- Tailwind styling variabler ---

  const sectionStyling =
    "col-span-9 col-start-3 sm:col-span-6 lg:col-span-4 py-6 pt-12 ";
  const titlesectionStyling =
    "rounded-sm shadow-md shadow-black/40 px-4 py-2 bg-black text-black w-full gap-6";
  const titleStyling = "text-lg text-white font-bold";
  const inputStyling =
    "flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4C0000] min-w-0";
  const buttonStyling =
    "bg-[#4C0000] text-white px-6 py-2 rounded font-bold hover:shadow hover:cursor-pointer hover:bg-[#870000]";
  const formsectionStyling = "flex flex-col gap-4 p-4";
  const inputsectionStyling = "flex flex-col gap-1";

  const feedbackStyling = "text-sm text-black text-center";
  const feedbackContainerStyling = `gap-2 rounded-sm px-2 py-1 border border-gray-300 shadow bg-white flex items-center justify-center max-w-[400px] mx-auto mt-4`;

  const errorsectionStyling =
    "flex  flex-col gap-4 max-w-[200px] mx-auto mx-auto bg-red-50 border border-red-400 text-red-700 p-2 mb-10 rounded";

  const loadingsectionStyling = "flex justify-center items-center py-12";
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
    // Bestemmer hvilket innhold som skal vises basert på tilstand
    const getMainContent = () => {
      if (initError) {
        return (
          <div className={errorsectionStyling}>
            <p>{initError}</p>
          </div>
        );
      }

      // Sjekker etter id- og venue-relaterte feil når ID er passert og komponenten skal være i redigeringsmodus
      if (isEditMode) {
        const idNumber = Number(venueId);
        if (isNaN(idNumber)) {
          return (
            <div className={errorsectionStyling}>
              <p>Invalid id</p>
              <Link to="/venues">Back</Link>
            </div>
          );
        }
        if (!venue || venue === undefined) {
          return (
            <div className={errorsectionStyling}>
              <p>Venue not found</p>
              <Link className={buttonStyling} to="/venues">
                Create New Venue
              </Link>
            </div>
          );
        }
      }

      // Laster innhold
      if (!hasInitialized) {
        return (
          <div className={loadingsectionStyling}>
            <p className={loadingTextStyling}>Loading athletes...</p>
          </div>
        );
      }

      // Dersom noe gikk galt (viktig å sjekke at den er false siden null er default)
      if (operationSuccess === false) {
        return (
          <div className={errorsectionStyling}>
            <p>{operationError}</p>
          </div>
        );
      }

      // Redigerings vindu
      return (
        <>
          <header className={titlesectionStyling}>
            <h3 className={titleStyling}>
              {isEditMode ? `Edit Venue: ${venue?.name}` : "Register New Venue"}
            </h3>
          </header>

          <form className={formsectionStyling} onSubmit={handleRegister}>
            <div className={inputsectionStyling}>
              <label
                htmlFor="venue-name"
                className="text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="venue-name"
                type="text"
                placeholder="Enter venue name"
                value={name}
                className={inputStyling}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className={inputsectionStyling}>
              <label
                htmlFor="venue-capacity"
                className="text-sm font-medium text-gray-700"
              >
                Capacity
              </label>
              <input
                id="venue-capacity"
                type="number"
                placeholder="Enter capacity"
                value={capacity}
                className={inputStyling}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>

            <div className={inputsectionStyling}>
              <label
                htmlFor="venue-image"
                className="text-sm font-medium text-gray-700"
              >
                Venue Image
              </label>
              <input
                id="venue-image"
                type="file"
                onChange={handleImageChange}
                className="px-4 py-2 border border-gray-300 rounded cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#4C0000] file:text-white file:cursor-pointer hover:file:bg-[#870000]"
                accept="image/*"
              />
            </div>

            <button type="submit" className={buttonStyling}>
              {isEditMode ? "Update Venue" : "Register Venue"}
            </button>
          </form>

          {isLoading && <p className={loadingTextStyling}>Loading venues...</p>}

          {actionFeedback && (
            <div className={feedbackContainerStyling}>
              <p className={feedbackStyling}>{actionFeedback}</p>
            </div>
          )}
        </>
      );
    };

    // Returnerer resultat med section wrapper
    return <section className={sectionStyling}>{getMainContent()}</section>;
  };

  return renderJsx();
};
