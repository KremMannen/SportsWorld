import "./App.css";
import AppRouting from "./routing/AppRouting";
import { AthleteProvider } from "./contexts/AthleteContext";
import { VenueProvider } from "./contexts/VenueContext";
import { FinanceProvider } from "./contexts/FinanceContext";

function App() {
  return (
    <FinanceProvider>
      <VenueProvider>
        <AthleteProvider>
          <AppRouting />
        </AthleteProvider>
      </VenueProvider>
    </FinanceProvider>
  );
}

export default App;
