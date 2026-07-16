import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, ArrowLeft, Fingerprint, Shield, Sun, Moon, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminPanel from '@/components/AdminPanel';
import { getApiUrl } from '@/lib/api';
import { getAssetUrl } from '@/lib/utils';
import { NativeBiometric, AccessControl } from '@capgo/capacitor-native-biometric';
import { Capacitor } from '@capacitor/core';
import { setSecureItem } from '@/lib/preferences';

// NOTE: the admin password itself is never stored anywhere on the device
// (not localStorage, not Preferences, not even the biometric Keystore vault).
// It is sent to the server exactly once, at login, in exchange for a
// short-lived (12h) JWT session token. That token — never the password —
// is what gets persisted and resent on subsequent admin API calls.
const ADMIN_TOKEN_STORAGE_KEY = 'wawasan_admin_token';
const BIOMETRIC_ENABLED_KEY = 'wawasan_biometric_enabled';
const BIOMETRIC_SERVER_KEY = 'com.wawasanpakusop.app.admin';

export default function AdminPage() {
  const { t, language } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [token, setToken] = useState(
    () => localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || ''
  );
  // isAuthenticated is derived directly from whether a token string exists —
  // NOT from a separate persisted flag. A separate flag (the previous
  // approach) never gets cleared when the token expires on its own, so the
  // UI kept showing the admin panel as "logged in" with a stale/expired
  // token that the server would reject on the first real request. If the
  // token turns out to be expired, AdminPanel's own 401 handling on
  // fetchOrders calls onLogout() to correct this after the fact.
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(token));
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(
    () => localStorage.getItem(BIOMETRIC_ENABLED_KEY) === 'true'
  );

  // Translation helper for dual-language inline strings
  const tText = (en: string, bm: string) => (language === 'bm' ? bm : en);

  // Check biometric availability
  useEffect(() => {
    const checkBiometric = async () => {
      if (!Capacitor.isNativePlatform()) return;
      try {
        const result = await NativeBiometric.isAvailable();
        setBiometricAvailable(result.isAvailable);
      } catch (err) {
        console.error('Failed to check biometric availability', err);
      }
    };
    checkBiometric();
  }, []);

  const handleBiometricAuth = async () => {
    try {
      setError('');
      setIsLoading(true);

      // getSecureCredentials triggers the OS biometric prompt itself (needed
      // to decrypt the Keystore-protected entry) — no separate verifyIdentity()
      // call, that would prompt the user twice.
      const creds = await NativeBiometric.getSecureCredentials({
        server: BIOMETRIC_SERVER_KEY,
        reason: 'Authenticate to access Admin Panel',
        title: 'Restoran Wawasan Admin',
      });

      if (creds.username && creds.password) {
        // The admin password is only ever kept transiently in memory here,
        // long enough to exchange it for a fresh session token. It is never
        // written back to localStorage or Preferences.
        const response = await fetch(getApiUrl('/api/admin/login'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: creds.password })
        });
        const data = await response.json();

        if (response.ok && data.success && data.token) {
          setToken(data.token);
          localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, data.token);
          setIsAuthenticated(true);
        } else {
          setError(tText(
            'Saved biometric credentials were rejected by the server. Please log in with your password again.',
            'Kelayakan biometrik yang disimpan ditolak oleh server. Sila log masuk semula dengan kata laluan.'
          ));
        }
      } else {
        setError(tText(
          'Please complete password login first before using biometrics.',
          'Sila lengkapkan log masuk kata laluan terlebih dahulu sebelum menggunakan biometrik.'
        ));
      }
    } catch (err) {
      console.error('Biometrics failed:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      if (errMsg.toLowerCase().includes('cancel')) {
        setError(tText('Biometric authentication cancelled.', 'Autentikasi biometrik dibatalkan.'));
      } else {
        setError(tText(
          'Biometric authentication failed. Please use password.',
          'Autentikasi biometrik gagal. Sila gunakan kata laluan.'
        ));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(getApiUrl('/api/admin/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (response.ok && data.success && data.token) {
        setToken(data.token);
        localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, data.token);
        setIsAuthenticated(true);

        // Offer to enable biometrics after first successful login. The
        // password (still held in this function's local state at this
        // point, never persisted) is saved to the native Keystore-backed
        // vault, gated by biometric access control — not to localStorage.
        if (biometricAvailable && !biometricEnabled) {
          const enable = window.confirm(
            tText(
              'Login successful! Enable biometric authentication for faster access next time?',
              'Log masuk berjaya! Aktifkan pengesahan biometrik untuk akses lebih cepat lain kali?'
            )
          );
          if (enable) {
            try {
              await NativeBiometric.setCredentials({
                username: 'admin',
                password: password,
                server: BIOMETRIC_SERVER_KEY,
                accessControl: AccessControl.BIOMETRY_ANY,
              });
              await setSecureItem(BIOMETRIC_ENABLED_KEY, 'true');
              setBiometricEnabled(true);
            } catch (credErr) {
              console.error('Failed to save biometric credentials:', credErr);
            }
          }
        }
      } else {
        setError(t('wrong_password') || 'Invalid password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-trigger biometric if enabled
  useEffect(() => {
    if (!isAuthenticated && biometricEnabled && biometricAvailable) {
      const timer = setTimeout(handleBiometricAuth, 800);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [biometricEnabled, biometricAvailable, isAuthenticated]);

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cream dark:bg-background pattern-dots flex flex-col">
        <header className="fixed top-0 left-0 right-0 z-50 bg-cream/90 dark:bg-background/90 backdrop-blur-xl border-b border-border pt-[var(--sat)]">
          <div className="flex items-center justify-between px-6 md:px-12 h-[72px]">
            <div onClick={() => navigate('/home', { replace: true })} className="flex items-center gap-3 group cursor-pointer">
              <img
                src={getAssetUrl("/assets/wawasan_logo.jpg")}
                alt="Restoran Wawasan Logo"
                className="w-10 h-10 object-contain shrink-0 mix-blend-multiply"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="font-display font-semibold text-xl text-deep-forest leading-none">
                  Wawasan
                </span>
                <span className="block font-body text-[10px] text-crisp-carrot font-bold uppercase tracking-[0.18em] leading-tight mt-0.5">
                  Pak Usop
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleTheme} 
                className="p-2 md:p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-deep-forest" />
                ) : (
                  <Sun className="w-5 h-5 text-sunshine" />
                )}
              </button>
              <Button variant="ghost" onClick={() => navigate('/home', { replace: true })} className="text-stone hover:text-crisp-carrot hover:bg-sunshine/10 rounded-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('back')}
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 pt-[calc(72px+var(--sat)+2rem)]">
          <div className="w-full max-w-md">
            <div className="bg-white dark:bg-card rounded-3xl shadow-2xl border border-border overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-sunshine to-crisp-carrot" />
              
              <div className="p-8 md:p-10">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-sunshine/10 flex items-center justify-center border border-sunshine/20">
                    <Lock className="w-8 h-8 text-sunshine" />
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-display font-bold text-deep-forest text-center mb-2">
                  {t('admin_login')}
                </h2>
                <p className="text-stone text-center text-sm font-medium mb-8 uppercase tracking-widest text-[10px]">
                  Restricted Access • Staff Only
                </p>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-deep-forest mb-2">
                      {t('password')}
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-cream dark:bg-background border-border text-deep-forest placeholder:text-stone focus:border-sunshine focus:ring-1 focus:ring-sunshine h-12 rounded-xl"
                    />
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-tomato-burst/10 border border-tomato-burst/20 text-tomato-burst text-sm font-semibold text-center">
                      {error}
                    </div>
                  )}

                  <div className="space-y-3">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-sunshine text-white font-bold hover:bg-crisp-carrot transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2 rounded-xl shadow-sm"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4" />
                          {t('loading')}
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4" />
                          {t('login')}
                        </>
                      )}
                    </Button>

                    {biometricAvailable && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleBiometricAuth}
                        disabled={isLoading}
                        className="w-full h-12 border border-border text-deep-forest hover:text-sunshine hover:border-sunshine/30 hover:bg-sunshine/5 rounded-xl font-bold"
                      >
                        <Fingerprint className="w-5 h-5 mr-2" />
                        {tText('Use Fingerprint / Face ID', 'Guna Cap Jari / Face ID')}
                      </Button>
                    )}
                  </div>
                </form>

                <p className="mt-8 text-center text-[10px] text-stone">
                  This area is protected. Unauthorized access is prohibited.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <AdminPanel
      adminToken={token}
      onLogout={() => {
        localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
        setIsAuthenticated(false);
        setToken('');
      }}
    />
  );
}
