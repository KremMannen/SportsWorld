import FighterList from "../components/FighterList";
import FeaturedVenues from "../components/FeaturedVenues";
import NavButton from "../components/NavButton";
import { FinanceDashboard } from "../components/FinanceDashboard";

const HomePage = () => {
  return (
    <main>
      <section>
        <FinanceDashboard />
        <FighterList filterType="available" />
        <NavButton destination="/finances" />
        <FighterList filterType="owned" />
        <NavButton destination="/admin" />
        <FeaturedVenues />
      </section>
    </main>
  );
};

export default HomePage;
