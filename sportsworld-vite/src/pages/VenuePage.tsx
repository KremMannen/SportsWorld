import { NarrowLayout } from "../components/common/NarrowLayout";
import { PageLayout } from "../components/common/PageLayout";
import { VenueList } from "../components/venue/VenueList";
import { VenueRegister } from "../components/venue/VenueRegister";

const VenuePage = () => {
  return (
    <PageLayout>
      <NarrowLayout>
        <VenueRegister />
      </NarrowLayout>

      <VenueList cardVariant="manage" />
    </PageLayout>
  );
};

export default VenuePage;
