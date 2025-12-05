import FighterList from "../components/FighterList";

import { FinancePortal } from "../components/FinancePortal";
import { PageLayout } from "../components/common/PageLayout";

const FinancesPage = () => {
  return (
    <PageLayout>
      <FinancePortal />
      <FighterList filterType="owned" cardVariant="finance" />
      <FighterList filterType="available" cardVariant="finance" />
    </PageLayout>
  );
};

export default FinancesPage;
