import { AthleteList } from "../components/athlete/AthleteList";

import { MediumLayout } from "../components/common/MediumLayout";
import { WideLayout } from "../components/common/WideLayout";
import { FinanceDashboard } from "../components/finance/FinanceDashboard";

const FinancesPage = () => {
  return (
    <WideLayout>
      <MediumLayout>
        <FinanceDashboard limitedVariant={false} />
      </MediumLayout>
      <AthleteList filterType="owned" cardVariant="finance" layoutVariant="horizontal"/>
      <AthleteList filterType="available" cardVariant="finance" layoutVariant="horizontal"/>
    </WideLayout>
  );
};

export default FinancesPage;
