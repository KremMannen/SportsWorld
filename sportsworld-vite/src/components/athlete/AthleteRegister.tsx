import {
  useContext,
  useEffect,
  useState,
  type ChangeEvent,
  type FC,
  type FormEvent,
} from "react";
import { AthleteContext } from "../../contexts/AthleteContext";
import type { IAthleteContext } from "../../interfaces/contexts/IAthleteContext";
import { Link, useParams } from "react-router-dom";
import type { IAthleteResponseSingle } from "../../interfaces/IServiceResponses";
import type { IAthlete } from "../../interfaces/objects/IAthlete";

// Registrerer nye atleter om url parameteret er undefined
// Om id er passert som parameter, oppdateres den assosierte athleten

export const AthleteRegister: FC = () => {
  const { athletes, initError, updateAthlete, addAthlete, athleteIsLoading } =
    useContext(AthleteContext) as IAthleteContext;

  const { athleteId } = useParams<{ athleteId: string }>();
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);

  const [actionFeedback, setActionFeedback] = useState("");
  const [operationSuccess, setOperationSuccess] = useState<boolean | null>(
    null
  );
  const [operationError, setOperationError] = useState<string>("");

  // Redigeringsmodus om det er passert parameter i url (athlete.id)
  const isEditMode: boolean = athleteId !== undefined;

  const athlete: IAthlete | undefined = isEditMode
    ? athletes.find((a) => a.id === Number(athleteId))
    : undefined;

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    setOperationSuccess(null);
    setOperationError("");

    // update skal beholde input fields ved register
    if (!isEditMode) {
      handleAddAthlete();
      setName("");
      setPrice("");
      setGender("");
      setImage(null);
    } else if (isEditMode) {
      handleUpdateAthlete();
    }
  };

  const handleAddAthlete = async () => {
    if (!name || !price || !gender || !image) {
      alert("Please fill in all fields.");
      return;
    }
    const newAthlete: Omit<IAthlete, "image" | "id"> = {
      name,
      price: Number(price),
      gender,
      purchased: false,
    };

    const response: IAthleteResponseSingle = await addAthlete(
      newAthlete,
      image
    );
    if (response.success) {
      setActionFeedback(`Athlete ${response.data?.name} successfully created `);
    }
    if (!response.success) {
      setActionFeedback(`Failed to create athlete `);
    }
    setOperationError(response.error ?? "");
    setOperationSuccess(response.success);
  };

  const handleUpdateAthlete = async () => {
    // vil aldri forekomme, tilfredsstiller IDE'en / TS
    if (!athlete) return;
    // image kan være tom, da beholdes gamle bildet
    if (!name || !price || !gender) {
      alert("Please fill in all fields.");
      return;
    }

    const updatedAthlete: IAthlete = {
      id: athlete.id,
      name,
      price: Number(price),
      gender,
      image: athlete.image,
      purchased: athlete.purchased,
    };

    const updateResponse: IAthleteResponseSingle = image
      ? await updateAthlete(updatedAthlete, image)
      : await updateAthlete(updatedAthlete);

    if (updateResponse.success) {
      setActionFeedback(
        `Athlete ${updateResponse.data?.name} successfully updated `
      );
    } else if (!updateResponse.success) {
      setActionFeedback(`Athlete failed to update`);
      setOperationError(updateResponse.error ?? "");
      setOperationSuccess(updateResponse.success);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files != null) {
      setImage(files[0]);
    }
  };

  useEffect(() => {
    if (athlete) {
      setName(athlete.name);
      setPrice(athlete.price.toString());
      setGender(athlete.gender);
    } else if (!isEditMode) {
      setName("");
      setPrice("");
      setGender("");
      setImage(null);
    } // useEffect kjøres om disse verdiene endrer seg for å oppdatere inputfeltene ved åpning av siden
  }, [athlete, isEditMode]);

  // --- Tailwind styling variabler ---
  const sectionStyling =
    "col-span-9 col-start-3 sm:col-span-6 lg:col-span-4 py-6 pt-12";
  const titleContainerStyling = isEditMode
    ? "rounded-sm shadow-md shadow-black/40 px-4 py-2 bg-[#3D4645] w-full gap-6"
    : "rounded-sm shadow-md shadow-black/40 px-4 py-2 bg-black w-full gap-6";
  const titleStyling = "text-lg text-white font-bold text-center";
  const feedbackStyling = "text-sm text-black text-center";
  const feedbackContainerStyling = `gap-2 rounded-sm px-2 py-1 border border-gray-300 shadow bg-white flex items-center justify-center gap-2 max-w-[400px] mx-auto`;

  const inputStyling =
    "flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4C0000] min-w-0";
  const buttonStyling =
    "bg-[#4C0000] text-white p-2 rounded font-bold hover:shadow hover:cursor-pointer hover:bg-[#870000]";
  const formContainerStyling = "flex flex-col gap-4 p-4";
  const inputContainerStyling = "flex flex-col gap-1";

  const errorContainerStyling =
    "bg-red-50 border border-red-400 text-red-700 px-4 py-3 my-10 mb-10 rounded max-w-[200px] mx-auto";
  const loadingContainerStyling = "flex justify-center items-center py-12";
  const loadingTextStyling = "text-gray-500 text-lg";

  const renderJsx = () => {
    // Generer header
    const renderHeader = () => (
      <header className={titleContainerStyling}>
        <h3 className={titleStyling}>
          {isEditMode
            ? `Currently editing athlete: ${athlete?.name}`
            : "Register New Athlete"}
        </h3>
      </header>
    );

    // Viser hovedinnhold, evt ved teknisk feil feilmeldinger
    const renderContent = () => {
      if (initError) {
        return (
          <div className={errorContainerStyling}>
            <p>{initError}</p>
          </div>
        );
      }

      // Sjekker bare for ID feil om vi er i edit-mode
      if (isEditMode) {
        const idNumber = Number(athleteId);
        if (isNaN(idNumber)) {
          return (
            <div className={errorContainerStyling}>
              <p>Invalid id</p>
              <Link to="/register">Back</Link>
            </div>
          );
        }
        if (!athlete || athlete === undefined) {
          return (
            <div className={errorContainerStyling}>
              <p>Athlete not found</p>
              <Link className={buttonStyling} to="/register">
                Create New Athlete
              </Link>
            </div>
          );
        }
      }

      if (operationSuccess === false) {
        return (
          <div className={errorContainerStyling}>
            <p>{operationError}</p>
          </div>
        );
      }

      if (athleteIsLoading) {
        return (
          <div className={loadingContainerStyling}>
            <p className={loadingTextStyling}>Loading athletes...</p>
          </div>
        );
      }

      // Redigerings vindu
      return (
        <form className={formContainerStyling} onSubmit={handleRegister}>
          <div className={inputContainerStyling}>
            <label
              htmlFor="athlete-name"
              className="text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="athlete-name"
              type="text"
              placeholder="Enter athlete name"
              value={name}
              className={inputStyling}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={inputContainerStyling}>
            <label
              htmlFor="athlete-price"
              className="text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <input
              id="athlete-price"
              type="number"
              placeholder="Enter price"
              value={price}
              className={inputStyling}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className={inputContainerStyling}>
            <label
              htmlFor="athlete-gender"
              className="text-sm font-medium text-gray-700"
            >
              Gender
            </label>
            <input
              id="athlete-gender"
              type="text"
              placeholder="Enter gender"
              value={gender}
              className={inputStyling}
              onChange={(e) => setGender(e.target.value)}
            />
          </div>

          <div className={inputContainerStyling}>
            <label
              htmlFor="athlete-image"
              className="text-sm font-medium text-gray-700"
            >
              Athlete Image
            </label>
            <input
              id="athlete-image"
              type="file"
              onChange={handleImageChange}
              className="px-4 py-2 border border-gray-300 rounded cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#4C0000] file:text-white file:cursor-pointer hover:file:bg-[#870000]"
              accept="image/*"
            />
          </div>

          <button type="submit" className={buttonStyling}>
            {isEditMode ? "Update Athlete" : "Register Athlete"}
          </button>
        </form>
      );
    };

    // Generer feedback til bruker
    const renderFeedback = () => {
      if (initError) return null;

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
