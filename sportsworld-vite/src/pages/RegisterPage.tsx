import { AthleteList } from "../components/athlete/AthleteList";
import { AthleteRegister } from "../components/athlete/AthleteRegister";
import { NarrowLayout } from "../components/common/NarrowLayout";
import { WideLayout } from "../components/common/WideLayout";

const RegisterPage = () => {
  return (
    <WideLayout>
      <NarrowLayout>
        <AthleteRegister />
      </NarrowLayout>

      <AthleteList filterType="all" cardVariant="manage" />
    </WideLayout>
  );
};

export default RegisterPage;
