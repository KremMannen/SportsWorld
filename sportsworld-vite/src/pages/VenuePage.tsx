import { PageLayout } from "../components/common/PageLayout";
import { VenueList } from "../components/venue/VenueList";
import { VenueRegister } from "../components/venue/VenueRegister";

const VenuePage = () => {
  return (
    <PageLayout>
      <VenueRegister />
      <VenueList cardVariant="manage" />
    </PageLayout>
  );
};

export default VenuePage;
