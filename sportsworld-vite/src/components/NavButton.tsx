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
    <nav className="flex justify-center px-4">
      <Link
        to={destination}
        // gjør knappene usynlige, utenom på store skjermer
        className="hidden lg:block bg-[#870000] text-white text-2xl font-bold hover:bg-red-700 px-40 py-3 rounded"
      >
        {displayTitle}
      </Link>
    </nav>
  );
};

export default NavButton;
