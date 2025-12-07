import { VenueList } from "../components/venue/VenueList";
import { FinanceDashboard } from "../components/finance/FinanceDashboard";
import { WideLayout } from "../components/common/WideLayout";
import { AthleteList } from "../components/athlete/AthleteList";
import NavButton from "../components/common/NavButton";
import { MediumLayout } from "../components/common/MediumLayout";

const HomePage = () => {
  return (
    <WideLayout>
      <MediumLayout>
        <FinanceDashboard limitedVariant={true} />
      </MediumLayout>

      <AthleteList filterType="owned" />
      <NavButton destination="/admin" />
      <AthleteList filterType="available" />
      <NavButton destination="/finances" />
      <VenueList />
    </WideLayout>
  );
};

export default HomePage;
