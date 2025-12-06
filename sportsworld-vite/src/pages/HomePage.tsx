import FeaturedVenues from "../components/venue/FeaturedVenues";
import { FinanceDashboard } from "../components/finance/FinanceDashboard";
import { PageLayout } from "../components/common/PageLayout";
import AthleteList from "../components/athlete/AthleteList";
import NavButton from "../components/common/NavButton";

const HomePage = () => {
  return (
    <PageLayout>
      <FinanceDashboard limitedVariant={true} />
      <AthleteList filterType="owned" />
      <NavButton destination="/admin" />
      <AthleteList filterType="available" />
      <NavButton destination="/finances" />
      <FeaturedVenues />
    </PageLayout>
  );
};

export default HomePage;
