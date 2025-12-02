import { BrowserRouter, Routes, Route, NavLink, Link } from "react-router-dom";
import HomePage from "../pages/HomePage";
import {
  AdminPage,
  FinancesPage,
  NotFoundPage,
  RegisterPage,
  VenuePage,
} from "../pages";

const AppRouting = () => {
  return (
    <BrowserRouter>
      {/* Header component*/}

      <header className="">
        <nav className="">
          <h1 className="">SportsWorld</h1>
          <ul className="">
            <li>
              <Link to="/" className="">
                Hjem
              </Link>
            </li>
            <li>
              <Link to="/admin" className="">
                Admin
              </Link>
            </li>
            <li>
              <Link to="/register" className="">
                Register
              </Link>
            </li>
            <li>
              <Link to="/finances" className="">
                Finances
              </Link>
            </li>
            <li>
              <Link to="/venues" className="">
                Venues
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/finances" element={<FinancesPage />} />
          <Route path="/venues" element={<VenuePage />} />
        </Routes>
      </main>

      {/* Footer component*/}
    </BrowserRouter>
  );
};

export default AppRouting;
