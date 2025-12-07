import { VenueList } from "../components/venue/VenueList";
import { FinanceDashboard } from "../components/finance/FinanceDashboard";
import { PageLayout } from "../components/common/PageLayout";
import { AthleteList } from "../components/athlete/AthleteList";
import NavButton from "../components/common/NavButton";
import { NarrowLayout } from "../components/common/NarrowLayout";

const HomePage = () => {
  return (
    <PageLayout>
      <NarrowLayout>
        <FinanceDashboard limitedVariant={true} />
      </NarrowLayout>

      <AthleteList filterType="owned" />
      <NavButton destination="/admin" />
      <AthleteList filterType="available" />
      <NavButton destination="/finances" />
      <VenueList />
    </PageLayout>
  );
};

export default HomePage;
