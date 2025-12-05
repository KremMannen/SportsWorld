import FighterList from "../components/FighterList";
import { PageLayout } from "../components/common/PageLayout";

const AdminPage = () => {
  return (
    <PageLayout>
      <FighterList filterType="all" cardVariant="manage" />
    </PageLayout>
  );
};

export default AdminPage;
