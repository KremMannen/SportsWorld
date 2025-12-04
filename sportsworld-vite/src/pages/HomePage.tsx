import FighterList from "../components/FighterList";
import FeaturedVenues from "../components/FeaturedVenues";

const HomePage = () => {
  return (
    <main>
      <section>
        <FighterList filterType="owned" />
        <FighterList filterType="available" />
        <FeaturedVenues />
      </section>
    </main>
  );
};

export default HomePage;
