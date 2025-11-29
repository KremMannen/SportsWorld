import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import HomePage from "../pages/HomePage";

const AppRouting = () => {
  return (
    <BrowserRouter>
      {/* Header component*/}

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </main>

      {/* Footer component*/}
    </BrowserRouter>
  );
};

export default AppRouting;
