import FighterList from "../components/FighterList";
import FeaturedVenues from "../components/FeaturedVenues";
import NavButton from "../components/NavButton";

const HomePage = () => {
  return (
    <main>
      <section>
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
