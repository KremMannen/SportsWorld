import type { FC } from "react";
import { Link } from "react-router-dom";

const Header: FC = () => {
  return (
    <header className="bg-black shadow-md px-4 py-2 ">
      <nav className="flex justify-between px-4">
        <Link
          to="/"
          className="text-white text-4xl font-bold hover:text-red-300"
        >
          SportsWorld
        </Link>
        <ul className="flex items-center space-x-6">
          <li>
            <Link
              to="/admin"
              className="text-white text-2xl hover:text-red-300 font-medium"
            >
              Admin
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              className="text-white text-2xl hover:text-red-300 font-medium"
            >
              Register
            </Link>
          </li>
          <li>
            <Link
              to="/finances"
              className="text-white text-2xl hover:text-red-300 font-medium"
            >
              Finances
            </Link>
          </li>
          <li>
            <Link
              to="/venues"
              className="text-white text-2xl hover:text-red-300 font-medium"
            >
              Venues
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
