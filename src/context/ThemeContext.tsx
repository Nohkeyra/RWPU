/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { setSecureItem, getSecureItem } from '@/lib/preferences';
import { db } from '@/firebaseConfig';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

type Theme = 'light' | 'dark';
export type AccentColor = 'sunshine' | 'kiwi';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
  updateAccentInDb: (accent: AccentColor) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('app_theme');
    return stored === 'dark' ? 'dark' : 'light';
  });

  const [accent, setAccentState] = useState<AccentColor>(() => {
    const stored = localStorage.getItem('app_accent');
    return stored === 'kiwi' ? 'kiwi' : 'sunshine';
  });

  // Load initial theme and accent from Capacitor preferences asynchronously on mount
  // to avoid native WebView race conditions and override any stale/empty localStorage state
  useEffect(() => {
    const loadDurableTheme = async () => {
      try {
        const savedTheme = await getSecureItem('app_theme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setTheme(savedTheme);
        }
        const savedAccent = await getSecureItem('app_accent');
        if (savedAccent === 'kiwi' || savedAccent === 'sunshine') {
          setAccentState(savedAccent);
        }
      } catch (err) {
        console.warn('Failed to load theme/accent from preferences on mount:', err);
      }
    };
    loadDurableTheme();
  }, []);

  useEffect(() => {
    // Sync to localStorage / secure storage
    setSecureItem('app_theme', theme);
    
    // Apply class to document.documentElement
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // Sync accent to localStorage / secure storage
    setSecureItem('app_accent', accent);
    
    // Apply class to document.documentElement
    if (accent === 'kiwi') {
      document.documentElement.classList.add('accent-kiwi');
    } else {
      document.documentElement.classList.remove('accent-kiwi');
    }
  }, [accent]);

  // Firestore real-time listener for app branding accent color
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const docRef = doc(db, 'settings', 'branding');
      unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data && (data.accent === 'kiwi' || data.accent === 'sunshine')) {
            setAccentState(data.accent);
          }
        }
      }, (error) => {
        console.warn('Firestore branding listener failed (expected if offline or unauthorized):', error.message);
      });
    } catch (err) {
      console.warn('Could not set up Firestore branding sync:', err);
    }
    return () => unsubscribe();
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setAccent = (newAccent: AccentColor) => {
    setAccentState(newAccent);
  };

  const updateAccentInDb = async (newAccent: AccentColor) => {
    setAccentState(newAccent);
    try {
      const docRef = doc(db, 'settings', 'branding');
      await setDoc(docRef, { accent: newAccent }, { merge: true });
    } catch (err) {
      console.error('Failed to update branding accent in database:', err);
      throw err;
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, accent, setAccent, updateAccentInDb }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
