import type { FC } from "react";
import { NavLink } from "react-router-dom";

const Header: FC = () => {
  const baseStyling =
    "h-10 bg-[#4C0000] text-white text-xs sm:text-base lg:text-lg xl:text-xl font-medium h-8 px-2 sm:px-3 lg:px-4 rounded-md hover:bg-[#870000] flex items-center gap-2 whitespace-nowrap";
  const activeStyling = "bg-[#870000] border-1 border-red-600 shadow-sm";
  const listItemMargin = "mr-2 sm:mr-2 lg:mr-4";
  const iconStyling = "!inline sm:!hidden fas text-xl ";
  const spanStyling = "!hidden sm:!inline";

  return (
    <header className="bg-black py-4">
      <nav className="flex justify-between px-4">
        <NavLink to="/" className="text-white text-3xl lg:text-4xl font-bold hover:text-red-600">
          SportsWorld
        </NavLink>

        <ul className="flex items-center overflow-x-auto flex-nowrap">
          <li className={listItemMargin}>
            <NavLink
              to="/admin"
              className={({ isActive }) => 
                (isActive ? `${baseStyling} ${activeStyling}` : baseStyling)}
            >
              <i className={`fa-user-shield ${iconStyling}`}></i>
              <span className={spanStyling}>Admin</span>
            </NavLink>
          </li>

          <li className={listItemMargin}>
            <NavLink
              to="/register"
              className={({ isActive }) => 
                (isActive ? `${baseStyling} ${activeStyling}` : baseStyling)}
            >
              <i className={`fa-user-plus ${iconStyling}`}></i>
              <span className={spanStyling}>Register</span>
            </NavLink>
          </li>

          <li className={listItemMargin}>
            <NavLink
              to="/finances"
              className={({ isActive }) => 
                (isActive ? `${baseStyling} ${activeStyling}` : baseStyling)}
            >
              <i className={`fa-coins ${iconStyling}`}></i>
              <span className={spanStyling}>Finances</span>
            </NavLink>
          </li>

          <li className={listItemMargin}>
            <NavLink
              to="/venues"
              className={({ isActive }) => 
                (isActive ? `${baseStyling} ${activeStyling}` : baseStyling)}
            >
              <i className={`fa-building ${iconStyling}`}></i>
              <span className={spanStyling}>Venues</span>
            </NavLink>
          </li>

        </ul>
      </nav>
    </header>
  );
};

export default Header;