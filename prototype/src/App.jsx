import { useEffect } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FolioProvider, useFolio } from '@/lib/folio-store';
import { ComposerProvider } from '@/lib/folio-composer';
import FolioLayout from '@/components/folio/FolioLayout';
import Onboarding from '@/components/folio/Onboarding';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Today from '@/pages/Today';
import Archive from '@/pages/Archive';
import Me from '@/pages/Me';
import ThreadDetail from '@/pages/ThreadDetail';
import Feedback from '@/pages/Feedback';
import CuratorStudio from '@/pages/CuratorStudio';

const queryClient = new QueryClient();

function ThemeEffect() {
  const { theme } = useFolio();
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FolioProvider>
        <ThemeEffect />
        <ComposerProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/curator" element={<CuratorStudio />} />
              <Route element={<FolioLayout />}>
                <Route path="/" element={<Today />} />
                <Route path="/archive" element={<Archive />} />
                <Route path="/me" element={<Me />} />
                <Route path="/thread/:id" element={<ThreadDetail />} />
              </Route>
            </Routes>
          </Router>
        </ComposerProvider>
      </FolioProvider>
    </QueryClientProvider>
  )
}

export default App
