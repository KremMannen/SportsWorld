import { AthleteList } from "../components/athlete/AthleteList";

import { MediumLayout } from "../components/common/MediumLayout";
import { WideLayout } from "../components/common/WideLayout";
import { FinanceDashboard } from "../components/finance/FinanceDashboard";
import { FinanceLoanWindow } from "../components/finance/FinanceLoanWindow";

const FinancesPage = () => {
  return (
    <WideLayout>
      <MediumLayout>
        <FinanceDashboard limitedVariant={false} />
      </MediumLayout>
      <AthleteList filterType="owned" cardVariant="finance" />
      <AthleteList filterType="available" cardVariant="finance" />
    </WideLayout>
  );
};

export default FinancesPage;
