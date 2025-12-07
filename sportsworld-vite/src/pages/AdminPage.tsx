import { AthleteList } from "../components/athlete/AthleteList";
import { WideLayout } from "../components/common/WideLayout";

const AdminPage = () => {
  return (
    <WideLayout>
      <AthleteList filterType="all" cardVariant="manage" />
    </WideLayout>
  );
};

export default AdminPage;
