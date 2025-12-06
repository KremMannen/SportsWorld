import type { FC } from "react";
import { Link } from "react-router-dom";

const Header: FC = () => {
  return (
    <header className="bg-black shadow-md px-4 py-2">
      <nav className="flex justify-between px-4">
        <Link
          to="/"
          className="text-white text-4xl font-bold hover:text-red-300"
        >
          SportsWorld
        </Link>
         <ul className="flex items-center space-x-6">

          {/* Admin */}
          <li>
            <Link
              to="/admin"
              className="text-white text-2xl hover:text-red-300 font-medium flex items-center"
            >
              {/* Icon on small screens */}
              <i className="fas fa-user-shield !inline lg:!hidden"></i>
              {/* Text on large screens */}
              <span className="!hidden lg:!inline">Admin</span>
            </Link>
          </li>

          {/* Register */}
          <li>
            <Link
              to="/register"
              className="text-white text-2xl hover:text-red-300 font-medium flex items-center"
            >
              <i className="fas fa-user-plus !inline lg:!hidden"></i>
              <span className="!hidden lg:!inline">Register</span>
            </Link>
          </li>

          {/* Finances */}
          <li>
            <Link
              to="/finances"
              className="text-white text-2xl hover:text-red-300 font-medium flex items-center"
            >
              <i className="fas fa-coins !inline lg:!hidden"></i>
              <span className="!hidden lg:!inline">Finances</span>
            </Link>
          </li>

          {/* Venues */}
          <li>
            <Link
              to="/venues"
              className="text-white text-2xl hover:text-red-300 font-medium flex items-center"
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
