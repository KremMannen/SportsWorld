import type { FC } from "react";
import { Link, useLocation } from "react-router-dom";

const Header: FC = () => {

  // bruker useLocation hook for å hente brukerens nåværende sted i nettsiden.
  const { pathname } = useLocation();

  // Alle nav-elementer i listen har en boks, som endrer styling dersom man er på siden elementet linker til.
const getNavigationItemStyling = (route: string) => {

  const baseStyling= `
    bg-[#4C0000]
    text-white text-sm lg:text-xl font-medium
    h-10
    px-2 lg:px-4 py-2
    rounded-md
    hover:bg-[#870000]
    flex items-center gap-2
    whitespace-nowrap
`;
  // Boksen endrer bakgrunn og får rød border dersom route matcher url-objektet lagret i useLocation
  const activeClasses = pathname === route ? "bg-[#870000] border-2 border-red-600 shadow-sm" : "";

  return `${baseStyling} ${activeClasses}`;
}

  return (
    <header className="bg-black shadow-md px-4 py-2">
      <nav className="flex justify-between px-4">
        <Link
          to="/"
          className= "text-white text-4xl font-bold hover:text-red-600"
        >
          SportsWorld
        </Link>

         <ul className="flex items-center gap-2 lg:space-x-6 overflow-x-auto flex-nowrap">
          <li>
            <Link
              to="/admin"
              className= {getNavigationItemStyling("/admin")}
            >
              {/* Viser ikon på små skjermer */}
              {/* Må bruke !inline osv for å force endringene i tailwind. Hvis ikke forsvinner ikke ikonene, vises heller sammen med ordet. */}
              <i className="fas fa-user-shield !inline lg:!hidden"></i>
              {/* Viser tekst på store skjermer */}
              <span className="!hidden lg:!inline">Admin</span>
            </Link>
          </li>

          <li>
            <Link
              to="/register"
              className= {getNavigationItemStyling("/register")}
            >
              <i className="fas fa-user-plus !inline lg:!hidden"></i>
              <span className="!hidden lg:!inline">Register</span>
            </Link>
          </li>

          <li>
            <Link
              to="/finances"
              className= {getNavigationItemStyling("/finances")}
            >
              <i className="fas fa-coins !inline lg:!hidden"></i>
              <span className="!hidden lg:!inline">Finances</span>
            </Link>
          </li>

          <li>
            <Link
              to="/venues"
              className= {getNavigationItemStyling("/venues")}
            >
              <i className="fas fa-building !inline lg:!hidden"></i>
              <span className="!hidden lg:!inline">Venues</span>
            </Link>
          </li>

        </ul>

      </nav>
    </header>
  );
};

export default Header;
