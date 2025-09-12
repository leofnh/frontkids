import "./App.css";
import CustomRoutes from "./routes";
import { DataProvider } from "./components/context";

function App() {
  return (
    <DataProvider>
      <CustomRoutes />
    </DataProvider>
  );
}

export default App;
