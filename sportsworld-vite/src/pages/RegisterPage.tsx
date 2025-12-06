import { AthleteList } from "../components/athlete/AthleteList";
import { PageLayout } from "../components/common/PageLayout";

const RegisterPage = () => {
  return (
    <PageLayout>
      <AthleteList filterType="all" cardVariant="manage" />
    </PageLayout>
  );
};

export default RegisterPage;
