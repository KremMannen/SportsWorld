import FighterList from "../components/FighterList";
import { FinanceDashboard } from "../components/FinanceDashboard";
import { FinancePortal } from "../components/FinancePortal";
import { PageLayout } from "../components/PageLayout";

const FinancesPage = () => {
  return (
    <PageLayout>
      <FinanceDashboard />
      <FinancePortal />
      <FighterList filterType="owned" cardVariant="manage" />
      <FighterList filterType="available" cardVariant="sign" />
    </PageLayout>
  );
};

export default FinancesPage;
