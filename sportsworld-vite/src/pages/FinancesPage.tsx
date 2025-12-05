import { FinanceDashboard } from "../components/FinanceDashboard";
import { FinancePortal } from "../components/FinancePortal";
import { PageLayout } from "../components/PageLayout";

const FinancesPage = () => {
  return (
    <PageLayout>
      <FinanceDashboard />
      <FinancePortal />
    </PageLayout>
  );
};

export default FinancesPage;
