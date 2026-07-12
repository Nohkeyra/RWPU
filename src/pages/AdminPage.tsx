import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, ArrowLeft, Fingerprint, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminPanel from '@/components/AdminPanel';
import { getApiUrl } from '@/lib/api';
import { getAssetUrl } from '@/lib/utils';
import { NativeBiometric } from '@capgo/capacitor-native-biometric';
import { Capacitor } from '@capacitor/core';

const ADMIN_AUTH_STORAGE_KEY = 'wawasan_admin_authenticated';
const ADMIN_PASSWORD_STORAGE_KEY = 'wawasan_admin_password';
const BIOMETRIC_ENABLED_KEY = 'wawasan_biometric_enabled';

export default function AdminPage() {
  const { t, language } = useLanguage();
  
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === 'true'
  );
  const [password, setPassword] = useState(
    () => localStorage.getItem(ADMIN_PASSWORD_STORAGE_KEY) || ''
  );
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

      await NativeBiometric.verifyIdentity({
        reason: 'Authenticate to access Admin Panel',
        title: 'Restoran Wawasan Admin',
        subtitle: 'Use fingerprint or face ID',
      });

      // Success
      const savedPassword = localStorage.getItem(ADMIN_PASSWORD_STORAGE_KEY);
      if (savedPassword) {
        setPassword(savedPassword);
        setIsAuthenticated(true);
        localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, 'true');

        // Automatically ensure biometric is enabled if authenticated successfully
        if (!biometricEnabled) {
          localStorage.setItem(BIOMETRIC_ENABLED_KEY, 'true');
          setBiometricEnabled(true);
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
      
      if (response.ok && data.success) {
        setIsAuthenticated(true);
        localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, 'true');
        localStorage.setItem(ADMIN_PASSWORD_STORAGE_KEY, password);

        // Offer to enable biometrics after first successful login
        if (biometricAvailable && !biometricEnabled) {
          const enable = window.confirm(
            tText(
              'Login successful! Enable biometric authentication for faster access next time?',
              'Log masuk berjaya! Aktifkan pengesahan biometrik untuk akses lebih cepat lain kali?'
            )
          );
          if (enable) {
            localStorage.setItem(BIOMETRIC_ENABLED_KEY, 'true');
            setBiometricEnabled(true);
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
      <div className="min-h-screen bg-charcoal flex flex-col">
        <header className="fixed top-0 left-0 right-0 z-50 bg-charcoal/95 backdrop-blur-xl pt-[var(--sat)]">
          <div className="flex items-center justify-between px-6 md:px-12 h-[72px]">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src={getAssetUrl("/assets/wawasan_logo.jpg")}
                alt="Restoran Wawasan Logo"
                className="w-9 h-9 rounded-lg border border-white/10 shadow-md object-cover"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="font-display font-semibold text-xl text-deep-forest leading-none">
                  Wawasan
                </span>
                <span className="block font-body text-xs text-deep-forest/60 leading-tight mt-0.5">
                  Pak Usop
                </span>
              </div>
            </Link>
            <Link to="/">
              <Button variant="ghost" className="text-deep-forest hover:text-warm-gold hover:bg-transparent">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('back')}
              </Button>
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 pt-[calc(72px+var(--sat)+2rem)]">
          <div className="w-full max-w-md">
            <div className="bg-deep-brown rounded-2xl shadow-[0_8px_60px_rgba(0,0,0,0.4)] border border-warm-gold/10 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-warm-gold via-warm-gold/80 to-warm-gold/60" />
              
              <div className="p-8 md:p-10">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-warm-gold/10 flex items-center justify-center border border-warm-gold/20">
                    <Lock className="w-8 h-8 text-warm-gold" />
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-display font-bold text-deep-forest text-center mb-2">
                  {t('admin_login')}
                </h2>
                <p className="text-deep-forest/50 text-center text-sm mb-8">
                  Restricted Access • Staff Only
                </p>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-deep-forest/70 mb-2">
                      {t('password')}
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-charcoal/50 border-warm-gold/20 text-deep-forest placeholder:text-deep-forest/30 focus:border-warm-gold/50 focus:ring-warm-gold/20 h-12"
                    />
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                      {error}
                    </div>
                  )}

                  <div className="space-y-3">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-warm-gold text-charcoal font-semibold hover:bg-[#E0BC74] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
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
                        className="w-full h-12 border border-warm-gold/30 text-warm-gold hover:bg-warm-gold/10"
                      >
                        <Fingerprint className="w-5 h-5 mr-2" />
                        {tText('Use Fingerprint / Face ID', 'Guna Cap Jari / Face ID')}
                      </Button>
                    )}
                  </div>
                </form>

                <p className="mt-6 text-center text-xs text-deep-forest/40">
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
  return <AdminPanel adminPassword={password} />;
}
