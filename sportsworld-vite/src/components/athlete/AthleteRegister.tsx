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
import type { IAthleteRegisterProps } from "../../interfaces/components/IAthleteRegisterProps";
import { Link, useParams } from "react-router-dom";

// Denne komponenten registrerer nye atleter om parameteret er undefined
// Om id er passert som parameter, oppdaterer den tilhørende athlete istedet

export const AthleteRegister: FC = () => {
  const {
    athletes,
    updateAthlete,
    addAthlete,
    athleteIsLoading,
    athleteErrorMessage,
  } = useContext(AthleteContext) as IAthleteContext;

  const { athleteId } = useParams<{ athleteId: string }>();

  // Vi sjekker kun etter id- og athlete- relaterte feil når ID er passert og komponenten skal være i redigeringsmodus
  const isEditMode = athleteId !== undefined;

  console.log(isEditMode);

  const athlete = isEditMode
    ? athletes.find((a) => a.id === Number(athleteId))
    : undefined;

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [gender, setGender] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

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
      await addAthlete(newAthlete, image);
    } else {
      // image kan være tom, da beholder bare gamle bildet
      if (!name || !price || !gender) {
        alert("Please fill in all fields.");
        return;
      }

      if (image) {
        const updatedAthlete = {
          id: athlete.id,
          name,
          price: Number(price),
          gender,
          image: athlete.image,
          purchased: false,
        };
        await updateAthlete(updatedAthlete, image);
      } else {
        const updatedAthlete = {
          id: athlete.id,
          name,
          price: Number(price),
          gender,
          image: athlete.image,
          purchased: false,
        };
        await updateAthlete(updatedAthlete);
      }
    }

    setName("");
    setPrice("");
    setGender("");
    setImage(null);
  };

  // --- Tailwind styling variables ---
  const sectionStyling = "col-span-9 col-start-3 sm:col-span-6 lg:col-span-4";
  const titleContainerStyling =
    "rounded-sm shadow-md shadow-black/40 px-4 py-2 bg-black text-black w-full";
  const titleStyling = "text-md text-white";
  const inputStyling =
    "flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4C0000] min-w-0";
  const buttonStyling =
    "bg-[#4C0000] text-white px-6 py-2 rounded font-bold hover:shadow hover:cursor-pointer hover:bg-[#870000] transition-colors whitespace-nowrap";
  const formContainerStyling = "flex flex-col gap-4 mt-4";

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files != null) {
      setImage(files[0]);
    }
  };

  useEffect(() => {
    if (athlete) {
      console.log("filled fields");
      setName(athlete.name);
      setPrice(athlete.price.toString());
      setGender(athlete.gender);
    } else if (!isEditMode) {
      console.log("cleared fields");
      setName("");
      setPrice("");
      setGender("");
      setImage(null);
    }
  }, [athlete, isEditMode]);

  if (isEditMode) {
    const idNumber = Number(athleteId);
    if (isNaN(idNumber)) {
      return (
        <article>
          <p>Invalid id</p>
          <Link to="/register">Back</Link>
        </article>
      );
    }
    if (!athlete || athlete === undefined) {
      return (
        <article>
          <p>Athlete not found</p>
          <Link to="/register">Back</Link>
        </article>
      );
    }
  }

  const renderJsx = () => {
    if (athleteIsLoading) {
      return (
        <div className="text-center">
          <p className="text-xl text-gray-600">Loading athletes...</p>
        </div>
      );
    }

    if (athleteErrorMessage) {
      return (
        <div className="text-center">
          <p className="text-xl text-red-600">{athleteErrorMessage}</p>
        </div>
      );
    }

    return (
      <section className={sectionStyling}>
        <div className={titleContainerStyling}>
          <h3 className={titleStyling}>
            {isEditMode ? "Edit Athlete" : "Register New Athlete"}
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
            placeholder="Price"
            value={price}
            className={inputStyling}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            type="text"
            placeholder="Gender"
            value={gender}
            className={inputStyling}
            onChange={(e) => setGender(e.target.value)}
          />

          <h3 className="text-gray-800 font-medium mb-2">Upload image</h3>
          <input type="file" onChange={handleImageChange} />

          <button type="submit" className={buttonStyling}>
            {isEditMode ? "Update Athlete" : "Register Athlete"}
          </button>
        </form>
      </section>
    );
  };

  return renderJsx();
};
