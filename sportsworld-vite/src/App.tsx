import "./App.css";
import AppRouting from "./routing/AppRouting";
import { AthleteProvider } from "./contexts/AthleteContext";

function App() {
  return (
    <AthleteProvider>
      <AppRouting />
    </AthleteProvider>
  );
}

export default App;
