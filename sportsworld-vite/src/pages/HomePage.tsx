import FighterList from "../components/FighterList";
import FeaturedVenues from "../components/FeaturedVenues";
import NavButton from "../components/NavButton";
import { FinanceDashboard } from "../components/FinanceDashboard";
import { PageLayout } from "../components/PageLayout";

const HomePage = () => {
  return (
    <PageLayout>
      <FinanceDashboard limitedVariant={true} />
      <FighterList filterType="available" />
      <NavButton destination="/finances" />
      <FighterList filterType="owned" />
      <NavButton destination="/admin" />
      <FeaturedVenues />
    </PageLayout>
  );
};

export default HomePage;
