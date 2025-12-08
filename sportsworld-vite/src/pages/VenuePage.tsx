import { NarrowLayout } from "../components/common/NarrowLayout";
import { WideLayout } from "../components/common/WideLayout";
import { VenueList } from "../components/venue/VenueList";
import { VenueRegister } from "../components/venue/VenueRegister";

const VenuePage = () => {
  return (
    <WideLayout>
      <NarrowLayout>
        <VenueRegister />
      </NarrowLayout>

      <VenueList cardVariant="manage" layoutVariant="grid"/>
    </WideLayout>
  );
};

export default VenuePage;
