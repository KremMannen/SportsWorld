import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import {
  AdminPage,
  FinancesPage,
  NotFoundPage,
  RegisterPage,
  VenuePage,
} from "../pages";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AppRouting = () => {
  return (
    <BrowserRouter>
      <Header />
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
      <Footer />

      {/* Footer component*/}
    </BrowserRouter>
  );
};

export default AppRouting;
