import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";
import "./assets/global.css";
import { ThemeProvider } from "./context/ThemeContext";
import { SurveyApp } from "./pages/survey/SurveyApp";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { WelcomePage } from "./pages/welcome/WelcomePage";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/survey" element={<SurveyApp />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
