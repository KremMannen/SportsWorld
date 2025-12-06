import { PageLayout } from "../components/common/PageLayout";
import { VenueList } from "../components/venue/VenueList";

const VenuePage = () => {
  return (
    <PageLayout>
      <VenueList cardVariant="manage" />
    </PageLayout>
  );
};

export default VenuePage;
