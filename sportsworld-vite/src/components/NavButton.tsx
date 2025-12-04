import { Link } from "react-router-dom";
import type { INavButton } from "../interfaces/properties/INavButton";
import type { FC } from "react";

const NavButton: FC<INavButton> = ({ destination }) => {
  // Tekst for knapp-tittel basert på destination
  let displayTitle;
  switch (destination) {
    case "/":
      displayTitle = "FRONTPAGE";
      break;
    case "/admin":
      displayTitle = "MANAGE FIGHTERS";
      break;
    case "/finances":
      displayTitle = "SIGN FIGHTERS";
      break;
    case "/venues":
      displayTitle = "SEE VENUES";
      break;
    case "/register":
      displayTitle = "REGISTER NEW FIGHTER";
      break;
  }

  return (
    <nav className="flex justify-center mt-14 mt-14">
      <Link
        to={destination}
        // gjør knappene usynlige, utenom på store skjermer
        className="hidden lg:block bg-[#4C0000] text-white lg:text-xl xl:text-2xl font-bold hover:bg-[#870000] lg:px-4 lg:py-2 xl:px-8 xl:py-3 rounded w-full 
        lg:max-w-md xl:max-w-xl text-center hover:shadow-md hover:shadow-black/40 hover:scale-[1.05]"
      >
        {displayTitle}
      </Link>
    </nav>
  );
};

export default NavButton;
