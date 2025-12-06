import {
  useContext,
  useState,
  type ChangeEvent,
  type FC,
  type FormEvent,
} from "react";
import { AthleteContext } from "../../contexts/AthleteContext";
import type { IAthleteContext } from "../../interfaces/contexts/IAthleteContext";
import type { IAthleteRegisterProps } from "../../interfaces/components/IAthleteRegisterProps";

// Denne komponenten registrerer nye atleter, eller om man bruker den med athlet som prop: oppdaterer den athleten.

export const AthleteRegister: FC<IAthleteRegisterProps> = ({ athlete }) => {
  const { updateAthlete, addAthlete, athleteIsLoading, athleteErrorMessage } =
    useContext(AthleteContext) as IAthleteContext;

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [gender, setGender] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    if (!name || !price || !gender || !image) {
      alert("Please fill in all fields.");
      return;
    }

    if (athlete === undefined) {
      const newAthlete = {
        name,
        price: Number(price),
        gender,
        image: null,
        purchased: false,
      };
      await addAthlete(newAthlete, image);
    } else {
      const updatedAthlete = {
        id: athlete.id,
        name,
        price: Number(price),
        gender,
        image: null,
        purchased: false,
      };
      await updateAthlete(updatedAthlete, image);
    }

    setName("");
    setPrice("");
    setGender("");
    setImage(null);
  };

  // --- Tailwind styling variables ---
  const sectionStyling = "col-span-12 sm:col-span-6 lg:col-span-4";
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

  // --- Render function ---
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
          <h3 className={titleStyling}>Register New Athlete</h3>
        </div>

        <form className={formContainerStyling} onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputStyling}
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputStyling}
          />
          <input
            type="text"
            placeholder="Gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className={inputStyling}
          />
          <h3 className="text-gray-800 font-medium mb-2">Upload image</h3>
          <label>
            <input onChange={handleImageChange} type="file" />
          </label>
          <button type="submit" className={buttonStyling}>
            Register Athlete
          </button>
        </form>
      </section>
    );
  };

  return renderJsx();
};
