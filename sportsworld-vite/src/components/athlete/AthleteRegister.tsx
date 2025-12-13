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

// Registrerer nye atleter om url parameteret er undefined
// Om id er passert som parameter, oppdateres den assosierte athleten

export const AthleteRegister: FC = () => {
  const { athletes, updateAthlete, addAthlete, athleteIsLoading } = useContext(
    AthleteContext
  ) as IAthleteContext;

  const { athleteId } = useParams<{ athleteId: string }>();

  // Redigeringsmodus om det er passert parameter i url (athlete.id)
  const isEditMode = athleteId !== undefined;

  const athlete = isEditMode
    ? athletes.find((a) => a.id === Number(athleteId))
    : undefined;

  // Settes fra IDefaultResponse osv ved funksjonskall
  const [operationSuccess, setOperationSuccess] = useState<boolean | null>(
    null
  );
  const [operationError, setOperationError] = useState<string>("");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [gender, setGender] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    setOperationSuccess(null);
    setOperationError("");

    // Knappen poster ny athlet om vi ikke er i redigeringsmodus
    // Ved å sjekke om athlete er undefined i stedet for å sjekke isEditMode,
    // kan updateAthlete trygt bruke athlete.id når vi er i redigeringsmodus uten typescript klage.
    if (athlete === undefined) {
      if (!name || !price || !gender || !image) {
        alert("Please fill in all fields.");
        return;
      }
      const newAthlete = {
        name,
        price: Number(price),
        gender,
        purchased: false,
      };

      const response = await addAthlete(newAthlete, image);
      setOperationError(response.error ?? "");
      setOperationSuccess(response.success);
    } else {
      // image kan være tom, da beholdes gamle bildet
      if (!name || !price || !gender) {
        alert("Please fill in all fields.");
        return;
      }

      const updatedAthlete = {
        id: athlete.id,
        name,
        price: Number(price),
        gender,
        image: athlete.image,
        purchased: athlete.purchased,
      };

      if (image) {
        const updateResponse = await updateAthlete(updatedAthlete, image);
        setOperationError(updateResponse.error ?? "");
        setOperationSuccess(updateResponse.success);
      } else {
        const updateResponse = await updateAthlete(updatedAthlete);
        setOperationError(updateResponse.error ?? "");
        setOperationSuccess(updateResponse.success);
      }
    }

    setName("");
    setPrice("");
    setGender("");
    setImage(null);
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
    } // useEffect kjøres om disse verdiene endrer seg for å oppdatere inputfeltene
  }, [athlete, isEditMode]);

  // --- Tailwind styling variabler ---
  const sectionStyling =
    "col-span-9 col-start-3 sm:col-span-6 lg:col-span-4 py-6 pt-12";
  const titleContainerStyling =
    "rounded-sm shadow-md shadow-black/40 px-4 py-2 bg-black text-black w-full";
  const titleStyling = "text-lg text-white font-bold";
  const inputStyling =
    "flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4C0000] min-w-0";
  const buttonStyling =
    "bg-[#4C0000] text-white p-2 rounded font-bold hover:shadow hover:cursor-pointer hover:bg-[#870000]";
  const formContainerStyling = "flex flex-col gap-4 p-4";
  const inputContainerStyling = "flex flex-col gap-1";

  const errorContainerStyling =
    "bg-red-50 border border-red-400 text-red-700 px-4 py-3 mb-10 rounded";
  const loadingContainerStyling = "flex justify-center items-center py-12";
  const loadingTextStyling = "text-gray-500 text-lg";

  const renderJsx = () => {
    // Vi sjekker kun etter id- og athlete- relaterte feil når ID er passert og komponenten skal være i redigeringsmodus
    if (isEditMode) {
      const idNumber = Number(athleteId);
      if (isNaN(idNumber)) {
        return (
          <section className={sectionStyling}>
            <div className={errorContainerStyling}>
              <p>Invalid id</p>
              <Link to="/register">Back</Link>
            </div>
          </section>
        );
      }
      if (!athlete || athlete === undefined) {
        return (
          <section className={sectionStyling}>
            <div className={errorContainerStyling}>
              <p>Athlete not found</p>
              <Link className={buttonStyling} to="/register">
                Create New Athlete
              </Link>
            </div>
          </section>
        );
      }
    }

    // Innhold laser inn
    if (athleteIsLoading) {
      return (
        <section className={sectionStyling}>
          <div className={loadingContainerStyling}>
            <p className={loadingTextStyling}>Loading athletes...</p>
          </div>
        </section>
      );
    }

    // Dersom noe gikk galt (viktig å sjekke at den er false siden null er default)
    if (operationSuccess === false) {
      return (
        <section className={sectionStyling}>
          <div className={errorContainerStyling}>
            <p>{operationError}</p>
          </div>
        </section>
      );
    }

    // Redigerings vindu
    return (
      <section className={sectionStyling}>
        <div className={titleContainerStyling}>
          <h3 className={titleStyling}>
            {isEditMode
              ? `Edit Athlete: ${athlete?.name}`
              : "Register New Athlete"}
          </h3>
        </div>

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
      </section>
    );
  };

  return renderJsx();
};
