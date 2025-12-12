import type { FC } from "react";
import { NavLink } from "react-router-dom";

const Header: FC = () => {
  // Header and navigation container styles
  const headerContainer = "bg-black py-4";
  const navContainer = "flex justify-between px-4";
  const logoLink =
    "text-white text-3xl lg:text-4xl font-bold hover:text-red-600";
  const navList = "flex items-center overflow-x-auto flex-nowrap";

  // Navigation link styles
  const navLinkBase =
    "h-10 bg-[#4C0000] text-white text-xs sm:text-base lg:text-lg xl:text-xl font-medium h-8 px-2 sm:px-3 lg:px-4 rounded-md hover:bg-[#870000] flex items-center gap-2";
  const navLinkActive = "bg-[#870000] border-1 border-red-600 shadow-sm";

  // List item and content styles
  const navListItem = "mr-2 sm:mr-2 lg:mr-4";
  const iconMobile = "!inline sm:!hidden fas text-xl";
  const textDesktop = "!hidden sm:!inline";

  return (
    <header className={headerContainer}>
      <nav className={navContainer}>
        <NavLink to="/" className={logoLink}>
          SportsWorld
        </NavLink>

        <ul className={navList}>
          <li className={navListItem}>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive ? `${navLinkBase} ${navLinkActive}` : navLinkBase
              }
            >
              <i className={`fa-user-shield ${iconMobile}`}></i>
              <span className={textDesktop}>Admin</span>
            </NavLink>
          </li>

          <li className={navListItem}>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                isActive ? `${navLinkBase} ${navLinkActive}` : navLinkBase
              }
            >
              <i className={`fa-user-plus ${iconMobile}`}></i>
              <span className={textDesktop}>Register</span>
            </NavLink>
          </li>

          <li className={navListItem}>
            <NavLink
              to="/finances"
              className={({ isActive }) =>
                isActive ? `${navLinkBase} ${navLinkActive}` : navLinkBase
              }
            >
              <i className={`fa-coins ${iconMobile}`}></i>
              <span className={textDesktop}>Finances</span>
            </NavLink>
          </li>

          <li className={navListItem}>
            <NavLink
              to="/venues"
              className={({ isActive }) =>
                isActive ? `${navLinkBase} ${navLinkActive}` : navLinkBase
              }
            >
              <i className={`fa-building ${iconMobile}`}></i>
              <span className={textDesktop}>Venues</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
