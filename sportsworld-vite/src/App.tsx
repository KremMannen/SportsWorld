import "./App.css";
import AppRouting from "./routing/AppRouting";
import { AthleteProvider } from "./contexts/AthleteContext";
import { VenueProvider } from "./contexts/VenueContext";

function App() {
  return (
    <VenueProvider>
      <AthleteProvider>
        <AppRouting />
      </AthleteProvider>
    </VenueProvider>
  );
}

export default App;
