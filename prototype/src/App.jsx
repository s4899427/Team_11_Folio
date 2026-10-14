import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { FolioProvider, useFolio } from '@/lib/folio-store';
import FolioLayout from '@/components/folio/FolioLayout';
import Welcome from '@/pages/Welcome';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Today from '@/pages/Today';
import Browse from '@/pages/Browse';
import ArtistSpace from '@/pages/ArtistSpace';
import EditionPage from '@/pages/EditionPage';
import Me from '@/pages/Me';
import Studio from '@/pages/Studio';
import Pitch from '@/pages/Pitch';
import Feedback from '@/pages/Feedback';
import Apply from '@/pages/Apply';
import Admin from '@/pages/Admin';
import Sandbox from '@/pages/Sandbox';

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 10000, retry: 1 } } });

function ThemeEffect() {
  const { theme, city } = useFolio();
  useEffect(() => { document.documentElement.classList.toggle('light', theme === 'light'); }, [theme]);
  // Each city carries its own accent colour.
  useEffect(() => { document.documentElement.style.setProperty('--folio-saffron-rgb', city.accentRgb); }, [city.accentRgb]);
  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FolioProvider>
        <ThemeEffect />
        <Router>
          <Routes>
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/demo" element={<Sandbox />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route element={<FolioLayout />}>
              <Route path="/" element={<Today />} />
              <Route path="/archive" element={<Browse />} />
              <Route path="/artist" element={<ArtistSpace />} />
              <Route path="/edition/:date" element={<EditionPage />} />
              <Route path="/me" element={<Me />} />
              <Route path="/studio" element={<Studio />} />
              <Route path="/pitch" element={<Pitch />} />
              <Route path="/apply" element={<Apply />} />
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Routes>
        </Router>
      </FolioProvider>
    </QueryClientProvider>
  );
}
