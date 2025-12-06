import FeaturedVenues from "../components/FeaturedVenues";
import { FinanceDashboard } from "../components/FinanceDashboard";
import { PageLayout } from "../components/common/PageLayout";
import FighterList from "../components/FighterList";
import NavButton from "../components/NavButton";

const HomePage = () => {
  return (
    <PageLayout>
      <FinanceDashboard limitedVariant={true} />
      <FighterList filterType="owned" />
      <NavButton destination="/admin" />
      <FighterList filterType="available" />
      <NavButton destination="/finances" />
      <FeaturedVenues />
    </PageLayout>
  );
};

export default HomePage;
