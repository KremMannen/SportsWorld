import { AthleteList } from "../components/athlete/AthleteList";
import { PageLayout } from "../components/common/PageLayout";

const AdminPage = () => {
  return (
    <PageLayout>
      <AthleteList filterType="all" cardVariant="manage" />
    </PageLayout>
  );
};

export default AdminPage;
