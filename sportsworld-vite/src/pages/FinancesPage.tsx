import AthleteList from "../components/athlete/AthleteList";

import { FinancePortal } from "../components/finance/FinancePortal";
import { PageLayout } from "../components/common/PageLayout";

const FinancesPage = () => {
  return (
    <PageLayout>
      <FinancePortal />
      <AthleteList filterType="owned" cardVariant="finance" />
      <AthleteList filterType="available" cardVariant="finance" />
    </PageLayout>
  );
};

export default FinancesPage;
