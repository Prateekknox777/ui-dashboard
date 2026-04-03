import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import TransactionsPage from './pages/TransactionsPage';
import InsightsPage from './pages/InsightsPage';
import { AuthProvider } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';

function App() {
  // Simple beginner setup for Dark Mode persistence
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setIsDarkMode(true);
      document.body.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.body.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
      setIsDarkMode(false);
    } else {
      document.body.classList.add("dark");
      localStorage.setItem("darkMode", "true");
      setIsDarkMode(true);
    }
  };

  return (
    <AuthProvider>
      <FinanceProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />}>
              <Route index element={<Dashboard />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="insights" element={<InsightsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </FinanceProvider>
    </AuthProvider>
  );
}

export default App;
