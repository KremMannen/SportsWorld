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

  const handleAddVenue = async () => {
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
  };

  const handleUpdateVenue = async () => {
    // vil aldri forekomme, tilfredsstiller IDE'en / TS
    if (!venue) return;
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
    }

    setOperationSuccess(updateResponse.success);
    setOperationError(updateResponse.error ?? "");
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setOperationSuccess(null);
    setActionFeedback("");
    setOperationError("");
    if (!isEditMode) {
      handleAddVenue();
      setName("");
      setImage(null);
      setCapacity("");
    } else if (isEditMode) {
      handleUpdateVenue();
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files != null) {
      setImage(files[0]);
    }
  };

  useEffect(() => {
    if (venue && isEditMode) {
      setName(venue.name);
      setCapacity(venue.capacity.toString());
    } else if (!isEditMode) {
      setName("");
      setImage(null);
      setCapacity("");
      setImage(null);
    }
  }, [venue, isEditMode]);

  // --- Tailwind styling variabler ---
  const sectionStyling =
    "col-span-9 col-start-3 sm:col-span-6 lg:col-span-4 py-6 pt-12 ";
  const titleContainerStyling = isEditMode
    ? "rounded-sm shadow-md shadow-black/40 px-4 py-2 bg-[#3D4645] w-full gap-6"
    : "rounded-sm shadow-md shadow-black/40 px-4 py-2 bg-black w-full gap-6";
  const titleStyling = "text-lg text-white font-bold text-center";

  const inputStyling =
    "flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4C0000] min-w-0";
  const imageInputStyling =
    "px-4 py-2 border border-gray-300 rounded cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#4C0000] file:text-white file:cursor-pointer hover:file:bg-[#870000]";

  const buttonStyling =
    "bg-[#4C0000] text-white px-6 py-2 rounded font-bold hover:shadow hover:cursor-pointer hover:bg-[#870000]";
  const formSectionStyling = "flex flex-col gap-4 p-4";
  const inputSectionStyling = "flex flex-col gap-1";
  const labelTextStyling = "text-sm font-medium text-gray-700";

  const feedbackStyling = "text-sm text-black text-center";
  const feedbackContainerStyling = `gap-2 rounded-sm px-2 py-1 border border-gray-300 shadow bg-white flex items-center justify-center max-w-[400px] mx-auto mt-4`;

  const errorContainerStyling =
    "bg-red-50 border border-red-400 text-red-700 px-4 py-3 my-10 mb-10 rounded max-w-[200px] mx-auto";

  const loadingContainerStyling =
    "flex w-full justify-center items-center py-12 max-w-[200px] mx-auto";
  const loadingTextStyling = "w-full text-gray-500 text-lg text-center";

  const renderJsx = () => {
    // Generer header
    const renderHeader = () => (
      <header className={titleContainerStyling}>
        <h3 className={titleStyling}>
          {isEditMode ? `Editing Venue: ${venue?.name}` : "Register New Venue"}
        </h3>
      </header>
    );

    // Bestemmer hvilket innhold som skal vises
    const renderContent = () => {
      if (initError) {
        return (
          <div className={errorContainerStyling}>
            <p>{initError}</p>
          </div>
        );
      }

      // Laster innhold
      if (!hasInitialized) {
        return (
          <div className={loadingContainerStyling}>
            <p className={loadingTextStyling}>Loading venues...</p>
          </div>
        );
      }

      // Sjekker etter id- og venue-relaterte feil når ID er passert og komponenten skal være i redigeringsmodus
      if (isEditMode) {
        const idNumber = Number(venueId);
        if (isNaN(idNumber)) {
          return (
            <div className={errorContainerStyling}>
              <p>Invalid id</p>
              <Link to="/venues">Back</Link>
            </div>
          );
        }
        if (!venue || venue === undefined) {
          return (
            <div className={errorContainerStyling}>
              <p>Venue not found</p>
              <Link className={buttonStyling} to="/venues">
                Create New Venue
              </Link>
            </div>
          );
        }
      }

      // Dersom noe gikk galt (viktig å sjekke at den er false siden null er default)
      if (operationSuccess === false) {
        return (
          <div className={errorContainerStyling}>
            <p>{operationError}</p>
          </div>
        );
      }

      if (isLoading) {
        return (
          <div className={loadingContainerStyling}>
            <p className={loadingTextStyling}>Loading venues...</p>
          </div>
        );
      }

      // Redigerings vindu
      return (
        <form className={formSectionStyling} onSubmit={handleRegister}>
          <div className={inputSectionStyling}>
            <label htmlFor="venue-name" className={labelTextStyling}>
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

          <div className={inputSectionStyling}>
            <label htmlFor="venue-capacity" className={labelTextStyling}>
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

          <div className={inputSectionStyling}>
            <label htmlFor="venue-image" className={labelTextStyling}>
              Venue Image
            </label>
            <input
              id="venue-image"
              type="file"
              onChange={handleImageChange}
              className={imageInputStyling}
              accept="image/*"
            />
          </div>

          <button type="submit" className={buttonStyling}>
            {isEditMode ? "Update Venue" : "Register Venue"}
          </button>
        </form>
      );
    };

    // Generer feedback til bruker
    const renderFeedback = () => {
      if (initError || !hasInitialized) return null;

      return (
        <>
          {actionFeedback && (
            <div className={feedbackContainerStyling}>
              <p className={feedbackStyling}>{actionFeedback}</p>
            </div>
          )}
        </>
      );
    };

    // Returnerer resultat med section wrapper
    return (
      <section className={sectionStyling}>
        {renderHeader()}
        {renderContent()}
        {renderFeedback()}
      </section>
    );
  };

  return renderJsx();
};
