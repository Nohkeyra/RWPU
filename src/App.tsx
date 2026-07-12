import { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { SplashScreen } from '@capacitor/splash-screen';
import { SafeArea } from 'capacitor-plugin-safe-area';
import { LanguageProvider } from '@/context/LanguageContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { ToastProvider } from '@/components/ui/Toast';
import PushNotificationHandler from '@/components/PushNotificationHandler';
import NativeBackButtonHandler from '@/components/NativeBackButtonHandler';

import LandingPage from '@/pages/LandingPage';
import OrderPage from '@/pages/OrderPage';
import AdminPage from '@/pages/AdminPage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  
  return null;
}

// Smooth scroll handler for anchor links
function SmoothScrollHandler() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href !== '#' && !href.startsWith('#/')) {
          e.preventDefault();
          const el = document.querySelector(href);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}

function AppContent() {
  return (
    <>
      <ScrollToTop />
      <SmoothScrollHandler />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/main" element={<LandingPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </>
  );
}

function App() {
  useEffect(() => {
    const hideSplash = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      await SplashScreen.hide();
    };

    hideSplash();

    // Setup Safe Area CSS variables (especially for Android edge-to-edge)
    const setupSafeArea = async () => {
      try {
        const { insets } = await SafeArea.getSafeAreaInsets();
        for (const [key, value] of Object.entries(insets)) {
          document.documentElement.style.setProperty(
            `--safe-area-inset-${key}`,
            `${value}px`
          );
        }

        SafeArea.addListener('safeAreaChanged', data => {
          const { insets } = data;
          for (const [key, value] of Object.entries(insets)) {
            document.documentElement.style.setProperty(
              `--safe-area-inset-${key}`,
              `${value}px`
            );
          }
        });
      } catch {
        // Plugin not available (e.g. running in web browser)
      }
    };
    
    setupSafeArea();
  }, []);

  return (
    <SettingsProvider>
      <LanguageProvider>
        <ToastProvider>
          <Router>
            <PushNotificationHandler />
            <NativeBackButtonHandler />
            <AppContent />
          </Router>
        </ToastProvider>
      </LanguageProvider>
    </SettingsProvider>
  );
}

export default App;
