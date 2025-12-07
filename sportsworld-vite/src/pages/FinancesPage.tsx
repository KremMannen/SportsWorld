import { AthleteList } from "../components/athlete/AthleteList";

import { NarrowLayout } from "../components/common/NarrowLayout";
import { PageLayout } from "../components/common/PageLayout";
import { FinanceDashboard } from "../components/finance/FinanceDashboard";
import { FinanceLoanWindow } from "../components/finance/FinanceLoanWindow";

const FinancesPage = () => {
  return (
    <PageLayout>
      <NarrowLayout>
        <FinanceDashboard limitedVariant={false} />
      </NarrowLayout>
      <AthleteList filterType="owned" cardVariant="finance" />
      <AthleteList filterType="available" cardVariant="finance" />
    </PageLayout>
  );
};

export default FinancesPage;
