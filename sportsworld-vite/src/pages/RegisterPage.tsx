import { AthleteList } from "../components/athlete/AthleteList";
import { AthleteRegister } from "../components/athlete/AthleteRegister";
import { PageLayout } from "../components/common/PageLayout";

const RegisterPage = () => {
  return (
    <PageLayout>
      <AthleteRegister />
      <AthleteList filterType="all" cardVariant="view" />
    </PageLayout>
  );
};

export default RegisterPage;
