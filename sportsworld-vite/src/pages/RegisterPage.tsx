import { AthleteList } from "../components/athlete/AthleteList";
import { AthleteRegister } from "../components/athlete/AthleteRegister";
import { NarrowLayout } from "../components/common/NarrowLayout";
import { PageLayout } from "../components/common/PageLayout";

const RegisterPage = () => {
  return (
    <PageLayout>
      <NarrowLayout>
        <AthleteRegister />
      </NarrowLayout>

      <AthleteList filterType="all" cardVariant="manage" />
    </PageLayout>
  );
};

export default RegisterPage;
