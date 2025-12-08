import type { FC } from "react";
import { NavLink } from "react-router-dom";

// Vi velger å bruke NavLink for å enkelt kunne bruke isActive propertien til å kontrollere stylingen av hvert element i listen basert på hvilken page man bruker er på.
// Alternativt så kunne vi brukt useLocation-hooken for å sammenligne route med url-objektet useLocation lagrer, og style basert på om route og url-path matcher, men da dette er utenfor pensum valgte vi en enkel NavLink løsning

const Header: FC = () => {
  const baseStyling =
    "bg-[#4C0000] text-white text-sm lg:text-xl font-medium h-10 px-2 lg:px-4 py-2 rounded-md hover:bg-[#870000] flex items-center gap-2 whitespace-nowrap";

  const activeStyling = "bg-[#870000] border-1 border-red-600 shadow-sm";

  return (
    <header className="bg-black shadow-md px-4 py-2">
      <nav className="flex justify-between px-4">
        <NavLink to="/" className="text-white text-4xl font-bold hover:text-red-600">
          SportsWorld
        </NavLink>

        <ul className="flex items-center gap-2 lg:space-x-6 overflow-x-auto flex-nowrap">

          <li>
            <NavLink
              to="/admin"
              className={({ isActive }) => 
                (isActive ? `${baseStyling} ${activeStyling}` : baseStyling)}
            >
              <i className="fas fa-user-shield !inline lg:!hidden"></i>
              <span className="!hidden lg:!inline">Admin</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/register"
              className={({ isActive }) => 
                (isActive ? `${baseStyling} ${activeStyling}` : baseStyling)}
            >
              <i className="fas fa-user-plus !inline lg:!hidden"></i>
              <span className="!hidden lg:!inline">Register</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/finances"
              className={({ isActive }) => 
                (isActive ? `${baseStyling} ${activeStyling}` : baseStyling)}
            >
              <i className="fas fa-coins !inline lg:!hidden"></i>
              <span className="!hidden lg:!inline">Finances</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/venues"
              className={({ isActive }) => 
                (isActive ? `${baseStyling} ${activeStyling}` : baseStyling)}
            >
              <i className="fas fa-building !inline lg:!hidden"></i>
              <span className="!hidden lg:!inline">Venues</span>
            </NavLink>
          </li>

        </ul>
      </nav>
    </header>
  );
};

export default Header;