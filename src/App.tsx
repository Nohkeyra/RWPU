import { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { SplashScreen } from '@capacitor/splash-screen';
import { SafeArea } from 'capacitor-plugin-safe-area';
import { Capacitor } from '@capacitor/core';
import { syncPreferencesToLocalStorage } from '@/lib/preferences';
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
    // Sync Capacitor Preferences to localStorage for synchronous access fallback
    syncPreferencesToLocalStorage();

    const hideSplash = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      await SplashScreen.hide();
    };

    hideSplash();

    // Setup Safe Area CSS variables (especially for Android edge-to-edge)
    const setupSafeArea = async () => {
      // Set initial defaults for native platforms to prevent immediate overlap before plugin resolves
      if (Capacitor.isNativePlatform()) {
        const platform = Capacitor.getPlatform();
        const defaultTopInset = platform === 'ios' ? '44px' : '28px';
        document.documentElement.style.setProperty('--safe-area-inset-top', defaultTopInset);
        document.documentElement.style.setProperty('--safe-area-inset-bottom', '20px');
      }

      try {
        const { insets } = await SafeArea.getSafeAreaInsets();
        const platform = Capacitor.getPlatform();
        
        // If the plugin returns 0 but we are on native platform, use fallback defaults so they don't overlay
        const topInset = (insets.top === 0 && Capacitor.isNativePlatform()) 
          ? (platform === 'ios' ? 44 : 28) 
          : insets.top;
          
        const bottomInset = (insets.bottom === 0 && Capacitor.isNativePlatform())
          ? 20
          : insets.bottom;

        document.documentElement.style.setProperty('--safe-area-inset-top', `${topInset}px`);
        document.documentElement.style.setProperty('--safe-area-inset-bottom', `${bottomInset}px`);
        document.documentElement.style.setProperty('--safe-area-inset-left', `${insets.left}px`);
        document.documentElement.style.setProperty('--safe-area-inset-right', `${insets.right}px`);

        SafeArea.addListener('safeAreaChanged', data => {
          const { insets: newInsets } = data;
          const currentPlatform = Capacitor.getPlatform();
          const newTopInset = (newInsets.top === 0 && Capacitor.isNativePlatform())
            ? (currentPlatform === 'ios' ? 44 : 28)
            : newInsets.top;
            
          const newBottomInset = (newInsets.bottom === 0 && Capacitor.isNativePlatform())
            ? 20
            : newInsets.bottom;

          document.documentElement.style.setProperty('--safe-area-inset-top', `${newTopInset}px`);
          document.documentElement.style.setProperty('--safe-area-inset-bottom', `${newBottomInset}px`);
          document.documentElement.style.setProperty('--safe-area-inset-left', `${newInsets.left}px`);
          document.documentElement.style.setProperty('--safe-area-inset-right', `${newInsets.right}px`);
        });
      } catch (err) {
        console.warn('SafeArea plugin error, using fallbacks:', err);
        if (Capacitor.isNativePlatform()) {
          const platform = Capacitor.getPlatform();
          document.documentElement.style.setProperty('--safe-area-inset-top', platform === 'ios' ? '44px' : '28px');
          document.documentElement.style.setProperty('--safe-area-inset-bottom', '20px');
        }
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
