import type { FC } from "react";
import { Link } from "react-router-dom";

const Header: FC = () => {

  const hoverEffect ="hover:text-red-700"
  const listItemStyling = `text-white text-2xl hover:text-red-300 font-medium flex items-center ${hoverEffect}`

  return (
    <header className="bg-black shadow-md px-4 py-2">
      <nav className="flex justify-between px-4">
        <Link
          to="/"
          className= {`text-white text-4xl font-bold ${hoverEffect}`}
        >
          SportsWorld
        </Link>

         <ul className="flex items-center space-x-6">
          <li>
            <Link
              to="/admin"
              className= {`${listItemStyling}`}
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
              className= {`${listItemStyling}`}
            >
              <i className="fas fa-user-plus !inline lg:!hidden"></i>
              <span className="!hidden lg:!inline">Register</span>
            </Link>
          </li>

          <li>
            <Link
              to="/finances"
              className= {`${listItemStyling}`}
            >
              <i className="fas fa-coins !inline lg:!hidden"></i>
              <span className="!hidden lg:!inline">Finances</span>
            </Link>
          </li>

          <li>
            <Link
              to="/venues"
              className= {`${listItemStyling}`}
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
