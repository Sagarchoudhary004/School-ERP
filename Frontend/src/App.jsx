
import ErrorBoundary from "./components/ErrorBoundary";
import AppRoutes from "./routes/appRoutes.jsx"

function App() {
  return (
    <ErrorBoundary>
      <AppRoutes/>
    </ErrorBoundary>
  );
}

export default App;
